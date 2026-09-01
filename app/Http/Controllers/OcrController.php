<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class OcrController extends Controller
{
    public function processReceipt(Request $request)
    {
    try {
        // 1. Validation and File Storage
        $request->validate([
            'receipt_image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:4096',
            'bank_id' => 'nullable|exists:bank_accounts,id',
        ]);

        $receipt = $request->file('receipt_image');
        if (!$receipt || !$receipt->isValid()) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid file uploaded. Please ensure the file is a valid image.',
            ], 422);
        }

        // Stores the uploaded file to 'storage/app/public/receipts'
        $path = $receipt->store('receipts', 'public');
        if (!$path) {
            throw new \RuntimeException('Failed to store receipt file. Please check storage permissions.');
        }
        
        $storedUrl = asset('storage/' . ltrim($path, '/'));
        $processedAt = now()->toIso8601String();
        // 2. OCR.space API Call Setup
        $verifySsl = config('services.ocr_space.verify', env('OCR_SPACE_VERIFY_SSL', false));
        if (is_string($verifySsl)) {
            $normalized = filter_var($verifySsl, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
            $verifySsl = $normalized === null ? true : $normalized;
        }

        $client = new Client([
            'timeout' => 30, // Request timeout in seconds
            'verify' => $verifySsl,
        ]);

        $ocrUrl = config('services.ocr_space.url', env('OCR_SPACE_URL', 'https://api.ocr.space/Parse/Image'));
        $apiKey = config('services.ocr_space.key', env('OCR_SPACE_API_KEY'));

        if (empty($apiKey)) {
            Log::warning('OCR Processing skipped: missing OCR_SPACE_API_KEY.');
            return response()->json([
                'success' => false,
                'message' => 'OCR configuration is missing. Please set OCR_SPACE_API_KEY.',
            ], 503);
        }

        // 3. File Upload (multipart/form-data POST request)
        $filePath = $receipt->getRealPath();
        if (!$filePath || !file_exists($filePath)) {
            throw new \RuntimeException('Receipt file not found or inaccessible.');
        }

        $fileResource = fopen($filePath, 'r');
        if (!$fileResource) {
            throw new \RuntimeException('Failed to open receipt file for OCR processing.');
        }

        try {
            $response = $client->request('POST', $ocrUrl, [
                'multipart' => [
                    ['name' => 'apikey', 'contents' => $apiKey],
                    ['name' => 'language', 'contents' => 'eng'],
                    ['name' => 'isOverlayRequired', 'contents' => 'true'],
                    [
                        'name'     => 'file',
                        'contents' => $fileResource,
                        'filename' => $receipt->getClientOriginalName(),
                    ],
                ]
            ]);
            
            // Close file resource after successful request
            if (is_resource($fileResource)) {
                fclose($fileResource);
            }
        } catch (\GuzzleHttp\Exception\RequestException $e) {
            // Close file resource on error
            if (is_resource($fileResource)) {
                fclose($fileResource);
            }
            $errorMessage = 'Failed to connect to OCR service.';
            if ($e->hasResponse()) {
                $statusCode = $e->getResponse()->getStatusCode();
                $errorMessage = "OCR API returned error code: {$statusCode}";
                if ($statusCode === 401 || $statusCode === 403) {
                    $errorMessage = 'OCR API authentication failed. Please check your API key.';
                } elseif ($statusCode === 429) {
                    $errorMessage = 'OCR API rate limit exceeded. Please try again later.';
                }
            } elseif (strpos($e->getMessage(), 'timeout') !== false || strpos($e->getMessage(), 'timed out') !== false) {
                $errorMessage = 'OCR API request timed out. Please try again.';
            } elseif (strpos($e->getMessage(), 'SSL') !== false || strpos($e->getMessage(), 'certificate') !== false) {
                $errorMessage = 'SSL certificate verification failed when contacting OCR provider.';
            }
            
            Log::error('OCR API Request Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => $errorMessage,
                'error' => $e->getMessage(),
                'hint' => strpos($e->getMessage(), 'SSL') !== false || strpos($e->getMessage(), 'certificate') !== false
                    ? 'Set OCR_SPACE_VERIFY_SSL=false in your .env file for local development or install the required CA certificates.'
                    : null,
            ], 502);
        }

        $responseBody = $response->getBody()->getContents();
        $ocrData = json_decode($responseBody, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new \RuntimeException('Invalid JSON response from OCR API: ' . json_last_error_msg());
        }

        if (!is_array($ocrData) || !isset($ocrData['ParsedResults'])) {
             throw new \RuntimeException('Unexpected OCR API response structure.');
        }

        if (!empty($ocrData['IsErroredOnProcessing'])) {
            $errorMessage = $ocrData['ErrorMessage'][0] ?? 'OCR API reported an error.';
            return response()->json([
                'success' => false,
                'message' => $errorMessage,
                'results' => null,
            ], 422);
        }

        // 4. Data Extraction Logic (Key-to-Key Capture Strategy)
        $extractedText = '';
        
        // Initializing extraction results
        $bankRefNumber = 'N/A';
        $beneficiaryName = 'N/A';
        $transferAmount = 'N/A';
        $transferAmountValue = null;
        $transferCurrency = 'N/A';
        $transactionDateTime = 'N/A';
        $paymentDate = 'N/A';

        if (isset($ocrData['ParsedResults'][0]['ParsedText'])) {
            $extractedText = $ocrData['ParsedResults'][0]['ParsedText'];

            // Clean the text: remove line breaks and normalize spacing for robust RegEx matching.
            $cleanText = str_replace(["\r", "\n", "\t"], ' ', $extractedText);
            $cleanText = preg_replace('/\s+/', ' ', $cleanText); 
            
            // -----------------------------------------------------------
            // 🎯 KEY-TO-KEY RegEx Patterns (Most Reliable for Structured Receipts)
            // We use non-greedy capture (.+?) between two known labels.
            // -----------------------------------------------------------
            
            // Helper function to capture the value between two keys and clean it
            $extractAndClean = function ($pattern, $text, $replace = []) {
                if (preg_match($pattern, $text, $matches)) {
                    $value = trim($matches[1]);
                    if (!empty($replace)) {
                        return str_replace(array_keys($replace), array_values($replace), $value);
                    }
                    return $value;
                }
                return 'N/A';
            };

            // 1. Bank Reference Number (between 'Bank Reference Number' and 'Sender\'s Account Number')
            $bankRefNumber = $extractAndClean(
                '/Bank\s+Reference\s+Number\s*(.+?)\s*Sender\'s\s+Account\s+Number/i', 
                $cleanText,
                [' ' => '', '-' => ''] // Remove spaces and hyphens from the result
            );


            // 2. Beneficiary Name (between 'Beneficiary Name' and 'Beneficiary\'s Account Currency')
            $beneficiaryName = $extractAndClean(
                '/Beneficiary\s+Name\s*(.+?)\s*Beneficiary\'s\s+Account\s+Currency/i', 
                $cleanText,
                ['- ' => ' ', '-' => ''] // Replace hyphens with space or remove them
            );
            
            // 3. Transfer Amount (between 'Transfer Amount' and 'Transfer Currency')
            $transferAmount = $extractAndClean(
                '/Transfer\s+Amount\s*(.+?)\s*Transfer\s+Currency/i', 
                $cleanText,
                [' ' => ''] // Remove spaces from the result (e.g., '1 8,500.00' -> '18,500.00')
            );

            if ($transferAmount !== 'N/A') {
                $numericCandidate = str_replace([','], '', $transferAmount);
                if (is_numeric($numericCandidate)) {
                    $transferAmountValue = (float) $numericCandidate;
                }
            }

            $transferCurrency = $extractAndClean(
                '/Transfer\s+Currency\s*(.+?)\s*Beneficiary\s+Name/i',
                $cleanText
            );

            if ($transferCurrency !== 'N/A') {
                $transferCurrency = strtoupper($transferCurrency);
            }
            
            // 4. Transaction Date/Time (Exact capture, since this part was previously working well)
            if (preg_match('/Transaction\s+Date\/Time\s+([\d\/]+)\s+([\d:]+\s+[AP]M)/i', $cleanText, $matches)) {
                $transactionDateTime = trim($matches[1] . ' ' . $matches[2]);
            }
            
            // 5. Payment Date (Exact capture)
            if (preg_match('/Payment\s+Date\s+([\d\s-]{8,})/i', $cleanText, $matches)) {
                $paymentDate = str_replace(' ', '', $matches[1]);
            }
            // -----------------------------------------------------------
        }

        // 5. Account Number Verification (if bank_id is provided)
        $accountNumberMatch = false;
        $accountNumberStatus = 'N/A';
        
        if ($request->has('bank_id') && $request->bank_id) {
            $bankAccount = BankAccount::find($request->bank_id);
            
            if ($bankAccount && !empty($extractedText)) {
                // Get the decrypted account number
                $accountNumber = $bankAccount->getAccountNumberForSearch();
                
                // Normalize both the OCR text and account number for comparison
                // Remove spaces, hyphens, and convert to lowercase
                $normalizeForSearch = function($text) {
                    return strtolower(preg_replace('/[\s\-]/', '', $text));
                };
                
                $normalizedOcrText = $normalizeForSearch($extractedText);
                $normalizedAccountNumber = $normalizeForSearch($accountNumber);
                
                // Check if account number exists in OCR text
                $accountNumberMatch = strpos($normalizedOcrText, $normalizedAccountNumber) !== false;
                $accountNumberStatus = $accountNumberMatch ? 'Found' : 'Not Found';
            }
        }

        // 6. Respond with the extracted data
        return response()->json([
            'success' => true,
            'message' => 'OCR data processed successfully.',
            'results' => [
                'bank_reference_number' => $bankRefNumber,
                'beneficiary_name'      => $beneficiaryName,
                'transfer_amount'       => $transferAmount,
                'transfer_amount_value' => $transferAmountValue,
                'transfer_currency'     => $transferCurrency,
                
                'transaction_datetime'  => $transactionDateTime,
                'payment_date'          => $paymentDate,
                
                'full_text'             => $extractedText, 
                'stored_path'           => $path,
                'stored_url'            => $storedUrl,
                'processed_at'          => $processedAt,
                
                'account_number_match'  => $accountNumberMatch,
                'account_number_status' => $accountNumberStatus,
            ]
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed.',
            'errors' => $e->errors(),
        ], 422);
    } catch (\GuzzleHttp\Exception\GuzzleException $e) {
        $message = 'Failed to connect to OCR service.';
        if ($e instanceof \GuzzleHttp\Exception\RequestException && $e->hasResponse()) {
            $statusCode = $e->getResponse()->getStatusCode();
            $message = "OCR API returned error code: {$statusCode}";
        }
        
        Log::error('OCR Guzzle Exception: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => $e->getMessage(),
        ], 502);
    } catch (\Exception $e) {
        $message = 'OCR processing failed or an internal error occurred.';
        $status = 500;

        if (strpos($e->getMessage(), 'cURL error 60') !== false || strpos($e->getMessage(), 'SSL') !== false) {
            $message = 'SSL certificate verification failed when contacting the OCR provider.';
            $status = 502;
        }

        Log::error('OCR Processing Error: ' . $e->getMessage(), [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString(),
        ]);

        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => $e->getMessage(),
            'hint' => $status === 502
                ? 'Set OCR_SPACE_VERIFY_SSL=false in your .env file for local development or install the required CA certificates.'
                : null,
        ], $status);
    }
    }
}
