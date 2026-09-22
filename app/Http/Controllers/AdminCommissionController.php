<?php

namespace App\Http\Controllers;

use App\Models\AdTransaction;
use App\Models\Agent;
use App\Models\Advertisement;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminCommissionController extends Controller
{
    /**
     * Get all commission reports with statistics
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $transactions = AdTransaction::with(['agent', 'advertisement.listingCategory'])
                ->latest('payment_datetime')
                ->get()
                ->map(function (AdTransaction $transaction) {
                    $agent = $transaction->agent;
                    $ad = $transaction->advertisement;
                    
                    // Get agent avatar
                    $avatar = 'https://ui-avatars.com/api/?name=' . urlencode($agent->name ?? 'Agent') . '&background=ec4899&color=fff';
                    if ($agent && $agent->profile_picture) {
                        if (Storage::disk('public')->exists($agent->profile_picture)) {
                            $avatar = Storage::url($agent->profile_picture);
                        }
                    }
                    
                    // Calculate commission rate
                    $commissionRate = $transaction->amount > 0 
                        ? ($transaction->commission / $transaction->amount) 
                        : 0;
                    
                    // Format payment date and time
                    $paymentDate = $transaction->payment_datetime 
                        ? $transaction->payment_datetime->format('F d, Y') 
                        : '';
                    $paymentTime = $transaction->payment_datetime 
                        ? $transaction->payment_datetime->format('g:i A') 
                        : '';
                    
                    // Get receipt image URL
                    $proofImg = 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=800&fit=crop';
                    if ($transaction->receipt_path) {
                        if (Storage::disk('public')->exists($transaction->receipt_path)) {
                            $proofImg = Storage::url($transaction->receipt_path);
                        }
                    }
                    
                    // Get listing category name for ad type
                    $adType = 'Standard Listing';
                    if ($ad && $ad->listingCategory) {
                        $adType = $ad->listingCategory->name;
                    }
                    
                    return [
                        'id' => (string) $transaction->id,
                        'agent' => [
                            'name' => $agent->name ?? 'Unknown Agent',
                            'id' => 'AG' . str_pad((string) ($agent->id ?? 0), 3, '0', STR_PAD_LEFT),
                            'avatar' => $avatar,
                            'email' => $agent->email ?? '',
                        ],
                        'ad' => [
                            'id' => $ad->code ?? '#AD-' . $transaction->advertisement_id,
                            'type' => $adType,
                            'client' => $ad->title ?? 'Unknown Client',
                            'duration' => '30 days', // You can calculate this based on your business logic
                        ],
                        'payment' => [
                            'amount' => (float) $transaction->amount,
                            'commissionRate' => $commissionRate,
                            'commission' => (float) $transaction->commission,
                            'date' => $paymentDate,
                            'time' => $paymentTime,
                            'method' => 'Bank Transfer', // You can add payment method field if needed
                        ],
                        'description' => $transaction->notes ?? 'No description provided.',
                        'status' => $transaction->status ?? 'Pending Review',
                        'proofImg' => $proofImg,
                    ];
                })
                ->values();
            
            // Calculate statistics
            $pendingCount = $transactions->where('status', 'Pending Review')->count();
            $confirmedToday = $transactions
                ->where('status', 'Confirmed')
                ->filter(function ($transaction) {
                    // Check if confirmed today (you might want to add a confirmed_at timestamp)
                    return true; // For now, we'll count all confirmed
                })
                ->count();
            $rejectedToday = $transactions
                ->where('status', 'Rejected')
                ->count();
            $totalAmount = $transactions->sum(function ($transaction) {
                return $transaction['payment']['amount'];
            });
            
            return response()->json([
                'success' => true,
                'reports' => $transactions,
                'stats' => [
                    'pendingReview' => $pendingCount,
                    'confirmedToday' => $confirmedToday,
                    'rejectedToday' => $rejectedToday,
                    'totalAmount' => number_format($totalAmount, 2),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch commission reports', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch commission reports.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Confirm a commission report
     */
    public function confirm(Request $request, $id): JsonResponse
    {
        try {
            $transaction = AdTransaction::findOrFail($id);
            
            $transaction->update([
                'status' => 'Confirmed',
            ]);

            // Activate the advertisement now that payment is confirmed
            $ad = \App\Models\Advertisement::find($transaction->advertisement_id);
            if ($ad) {
                $ad->update([
                    'status' => 'activated',
                    'payment_status' => 'paid',
                ]);
            }
            
            Log::info('Commission confirmed by admin', [
                'transaction_id' => $transaction->id,
                'agent_id' => $transaction->agent_id,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Commission confirmed successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to confirm commission', [
                'transaction_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to confirm commission.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Reject a commission report
     */
    public function reject(Request $request, $id): JsonResponse
    {
        try {
            $transaction = AdTransaction::findOrFail($id);
            
            $transaction->update([
                'status' => 'Rejected',
            ]);
            
            Log::info('Commission rejected by admin', [
                'transaction_id' => $transaction->id,
                'agent_id' => $transaction->agent_id,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Commission rejected and agent flagged.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to reject commission', [
                'transaction_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject commission.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
