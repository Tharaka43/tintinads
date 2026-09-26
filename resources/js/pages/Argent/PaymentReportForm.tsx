import React, { FormEvent, useCallback, useMemo, useState } from 'react';
import axios from 'axios';

// --- Global Constants ---
const PINK_500 = '#EC4899';
const PINK_600 = '#DB2777';
const BLUE_100 = '#DBEAFE';
const BLUE_500 = '#3B82F6';

// --- Types ---
interface PaymentFormState {
    adId: string;
    amount: string;
    paymentDate: string;
    receiptFile: File | null;
    notes: string;
    bankId: string;
    bankAccountNumber: string;
    bankReference: string;
}

interface AdOption {
    id: number;
    code: string | null;
    title: string;
    listing_category_price: string | null;
}

interface PriceOption {
    id: number;
    name: string;
    price: string;
}

interface OcrResults {
    bank_reference_number: string;
    beneficiary_name: string;
    transfer_amount: string;
    transfer_amount_value: number | null;
    transfer_currency: string;
    transaction_datetime: string;
    payment_date: string;
    full_text: string;
    stored_path: string;
    stored_url?: string;
    processed_at?: string;
    account_number_match?: boolean;
    account_number_status?: string;
}

interface BankOption {
    id: number;
    bank_name: string;
    account_number: string;
}

interface PaymentReportFormProps {
    adOptions: AdOption[];
    priceOptions: PriceOption[];
    bankAccounts?: BankOption[];
}

// --- Main Component ---

const createInitialFormState = (): PaymentFormState => ({
    adId: '',
    amount: '',
    paymentDate: '',
    receiptFile: null,
    notes: '',
    bankId: '',
    bankAccountNumber: '',
    bankReference: '',
});

type VerificationStatus = 'idle' | 'verified' | 'failed';

const PaymentReportForm: React.FC<PaymentReportFormProps> = ({ adOptions, priceOptions, bankAccounts = [] }) => {
    const [formData, setFormData] = useState<PaymentFormState>(() => createInitialFormState());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [ocrResults, setOcrResults] = useState<OcrResults | null>(null);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [ocrError, setOcrError] = useState<string | null>(null);
    const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('idle');
    const [accountNumberStatus, setAccountNumberStatus] = useState<VerificationStatus>('idle');
    const [referenceStatus, setReferenceStatus] = useState<VerificationStatus>('idle');
    const [amountStatus, setAmountStatus] = useState<VerificationStatus>('idle');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const runVerification = useCallback(() => {
        if (!ocrResults) {
            setVerificationStatus('idle');
            setAccountNumberStatus('idle');
            setReferenceStatus('idle');
            setAmountStatus('idle');
            return false;
        }

        const trimmedBankReference = formData.bankReference.trim();
        const selectedAmount = formData.amount;

        // If bank is selected, use OCR account number verification (from backend)
        // Otherwise, require manual account number input
        const hasBankSelected = formData.bankId !== '';
        const trimmedAccountNumber = formData.bankAccountNumber.trim();

        if (!hasBankSelected && !trimmedAccountNumber) {
            setVerificationStatus('failed');
            setAccountNumberStatus('failed');
            setReferenceStatus('failed');
            setAmountStatus('failed');
            return false;
        }

        if (!trimmedBankReference || !selectedAmount) {
            setVerificationStatus('failed');
            setAccountNumberStatus('failed');
            setReferenceStatus('failed');
            setAmountStatus('failed');
            return false;
        }

        const sanitize = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();

        const sanitizedText = sanitize(ocrResults.full_text ?? '');

        const sanitizedReference = sanitize(trimmedBankReference);
        const sanitizedOcrReference = sanitize(ocrResults.bank_reference_number ?? '');
        const referenceMatch =
            sanitizedReference !== '' &&
            (sanitizedReference === sanitizedOcrReference || sanitizedText.includes(sanitizedReference));

        // Account number verification: Use OCR result if bank is selected, otherwise use manual input
        let accountNumberMatch = false;
        if (hasBankSelected && ocrResults.account_number_match !== undefined) {
            // Use the OCR verification result from backend (bank's account number was searched)
            accountNumberMatch = ocrResults.account_number_match;
        } else if (!hasBankSelected && trimmedAccountNumber) {
            // Fallback to manual text search when no bank is selected
            const sanitizedAccountNumber = sanitize(trimmedAccountNumber);
            accountNumberMatch =
                sanitizedAccountNumber !== '' &&
                sanitizedText.includes(sanitizedAccountNumber);
        } else {
            // No account number verification possible
            accountNumberMatch = false;
        }

        let amountMatch = false;
        if (selectedAmount) {
            const numericAmount = Number.parseFloat(selectedAmount.replace(/,/g, ''));
            const ocrAmountValue = ocrResults.transfer_amount_value;

            if (Number.isFinite(numericAmount) && ocrAmountValue !== null) {
                amountMatch = Math.abs(numericAmount - ocrAmountValue) < 0.01;
            } else {
                const sanitizedAmount = sanitize(selectedAmount);
                const sanitizedOcrAmount = sanitize(ocrResults.transfer_amount ?? '');
                amountMatch =
                    sanitizedAmount !== '' &&
                    (sanitizedAmount === sanitizedOcrAmount || sanitizedText.includes(sanitizedAmount));
            }
        }

        setAccountNumberStatus(accountNumberMatch ? 'verified' : 'failed');
        setReferenceStatus(referenceMatch ? 'verified' : 'failed');
        setAmountStatus(amountMatch ? 'verified' : 'failed');

        if (referenceMatch && accountNumberMatch && amountMatch) {
            setVerificationStatus('verified');
            return true;
        }
        setVerificationStatus('failed');
        return false;
    }, [formData.amount, formData.bankAccountNumber, formData.bankReference, formData.bankId, ocrResults]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const next = {
                ...prev,
                [name]: value,
            };
            
            // When bank is selected, populate the account number field
            if (name === 'bankId' && value) {
                const selectedBank = bankAccounts.find(bank => String(bank.id) === value);
                if (selectedBank && selectedBank.account_number) {
                    next.bankAccountNumber = selectedBank.account_number;
                }
            } else if (name === 'bankId' && !value) {
                // Clear account number when bank is deselected
                next.bankAccountNumber = '';
            }
            
            // When ad is selected, auto-load the Admin's cut into amount field
            if (name === 'adId' && value) {
                const selectedAd = adOptions.find(ad => String(ad.id) === value);
                if (selectedAd && selectedAd.listing_category_price) {
                    const fullPrice = parseFloat(selectedAd.listing_category_price);
                    let payableToAdmin = fullPrice;
                    
                    // Business Logic: Agent keeps their commission, transfers the rest to Admin
                    if (fullPrice === 300) {
                        payableToAdmin = 200; // Agent keeps 100
                    } else if (fullPrice === 500) {
                        payableToAdmin = 300; // Agent keeps 200
                    } else if (fullPrice === 700) {
                        payableToAdmin = 400; // Agent keeps 300
                    } else if (fullPrice === 1500) {
                        payableToAdmin = 1100; // Agent keeps 400
                    }
                    
                    next.amount = String(payableToAdmin);
                }
            } else if (name === 'adId' && !value) {
                // Clear amount when ad is deselected
                next.amount = '';
            }
            
            return next;
        });
        
        setVerificationStatus('idle');
        setAccountNumberStatus('idle');
        setReferenceStatus('idle');
        setAmountStatus('idle');
    }, [bankAccounts, adOptions]);

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFormData(prev => ({
            ...prev,
            receiptFile: file,
        }));
        setOcrResults(null);
        setOcrError(null);
        setVerificationStatus('idle');
        setAccountNumberStatus('idle');
        setReferenceStatus('idle');
        setAmountStatus('idle');
    }, []);

    const handleOcrScan = useCallback(async () => {
        if (!formData.receiptFile) {
            setOcrError('Please upload a receipt image before scanning.');
            return;
        }

        const bankIdValue = formData.bankId || '';
        if (!bankIdValue || bankIdValue.trim() === '' || bankIdValue === '0') {
            setOcrError('Please select a bank before scanning the receipt.');
            return;
        }

        setOcrLoading(true);
        setOcrError(null);

        const payload = new window.FormData();
        payload.append('receipt_image', formData.receiptFile);
        payload.append('bank_id', formData.bankId); // Always send bank_id when scanning

        try {
            const response = await axios.post('/ocr', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Check if response indicates failure
            if (response.data.success === false) {
                const errorMessage = response.data.message || 'OCR processing failed.';
                const hint = response.data.hint || '';
                setOcrError(hint ? `${errorMessage} ${hint}` : errorMessage);
                setOcrResults(null);
                setVerificationStatus('idle');
                setAccountNumberStatus('idle');
                setReferenceStatus('idle');
                setAmountStatus('idle');
                return;
            }

            if (!response.data.results) {
                setOcrError('OCR processing completed but no results were returned.');
                setOcrResults(null);
                return;
            }

            const results: OcrResults = response.data.results;
            setOcrResults(results);

            setFormData(prev => {
                const next = { ...prev };

                if (results.bank_reference_number && results.bank_reference_number !== 'N/A') {
                    next.bankReference = results.bank_reference_number;
                }

                if (results.transfer_amount_value !== null) {
                    const transferAmountValue = results.transfer_amount_value;
                    const matchedOption = priceOptions.find(option => {
                        const optionValue = parseFloat(option.price);
                        return Number.isFinite(optionValue) && Math.abs(optionValue - transferAmountValue) < 0.01;
                    });

                    if (matchedOption) {
                        next.amount = matchedOption.price;
                    }
                }

                return next;
            });

            runVerification();
        } catch (error: any) {
            console.error('OCR Scan Error:', error);
            
            let errorMessage = 'Failed to scan receipt. Please try again.';
            
            // Extract error message from server response
            if (error?.response?.data) {
                const data = error.response.data;
                if (data.message) {
                    errorMessage = data.message;
                    // Add hint if available
                    if (data.hint) {
                        errorMessage += ` ${data.hint}`;
                    }
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.errors) {
                    // Validation errors
                    const validationErrors = Object.values(data.errors).flat().join(', ');
                    errorMessage = `Validation error: ${validationErrors}`;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }
            
            setOcrError(errorMessage);
            setOcrResults(null);
            setVerificationStatus('idle');
            setAccountNumberStatus('idle');
            setReferenceStatus('idle');
            setAmountStatus('idle');
        } finally {
            setOcrLoading(false);
        }
    }, [formData.receiptFile, formData.bankId, priceOptions, runVerification]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!formData.receiptFile) {
            alert('Please upload the receipt image.');
            return;
        }
        if (!formData.bankId) {
            alert('Please select the Admin Beneficiary Bank.');
            return;
        }
        if (!formData.adId) {
            alert('Please select the Associated Ad.');
            return;
        }
        if (!formData.paymentDate) {
            alert('Please select the Date/Time of Payment.');
            return;
        }
        if (formData.amount === '') {
            alert('Please fill out all required fields.');
            return;
        }



        setIsSubmitting(true);
        setSubmitError(null);

        const payload = new window.FormData();
        payload.append('adId', String(formData.adId));
        payload.append('accountNumber', formData.bankAccountNumber);
        payload.append('bankReference', formData.bankReference);
        payload.append('amount', String(formData.amount));
        payload.append('paymentDate', formData.paymentDate);
        payload.append('notes', formData.notes ?? '');
        if (formData.receiptFile) {
        payload.append('receiptFile', formData.receiptFile);
        }

        try {
            const response = await axios.post('/agent/payments/report', payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
            setShowToast(true);
            setFormData(createInitialFormState());
            setOcrResults(null);
            setVerificationStatus('idle');
            setOcrError(null);
            setAccountNumberStatus('idle');
            setReferenceStatus('idle');
            setAmountStatus('idle');
            setTimeout(() => setShowToast(false), 4000);
            } else {
                setSubmitError(response.data.message || 'Failed to submit payment report. Please try again.');
            }
        } catch (error: any) {
            console.error('Payment submission error:', error);
            const errorMessage = error?.response?.data?.message 
                || error?.response?.data?.error 
                || error?.message 
                || 'Failed to submit payment report. Please try again.';
            
            if (error?.response?.data?.errors) {
                const validationErrors = Object.values(error.response.data.errors).flat().join(', ');
                setSubmitError(`Validation errors: ${validationErrors}`);
            } else {
                setSubmitError(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const hasAdOptions = adOptions.length > 0;
    const hasPriceOptions = priceOptions.length > 0;

    let selectedAdDetails = null;
    if (formData.adId) {
        const selectedAd = adOptions.find(ad => String(ad.id) === formData.adId);
        if (selectedAd && selectedAd.listing_category_price) {
            const fullPrice = parseFloat(selectedAd.listing_category_price);
            let payable = fullPrice;
            let comm = 0;
            if (fullPrice === 300) { payable = 200; comm = 100; }
            else if (fullPrice === 500) { payable = 300; comm = 200; }
            else if (fullPrice === 700) { payable = 400; comm = 300; }
            selectedAdDetails = { fullPrice, payable, comm };
        }
    }

    return (
        <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
            <div
                className={`fixed top-4 right-4 border text-blue-800 px-6 py-4 rounded-lg shadow-lg transition-transform duration-300 ease-in-out z-50 ${showToast ? 'translate-x-0 bg-blue-100 border-blue-200' : 'translate-x-full'}`}
                style={{ backgroundColor: BLUE_100, borderColor: 'rgb(219 234 254)' }}
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                    </svg>
                    <span className="font-medium">Payment proof submitted successfully!</span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Payment Reporting</h1>
                    <p className="text-gray-600 text-sm sm:text-base">Submit commission payment proof for admin review</p>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sm:p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        
                        {/* Admin Bank Details Box */}
                        {(bankAccounts || []).length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                                <h3 className="text-blue-800 font-semibold mb-3 flex items-center">
                                    <i className="fas fa-university mr-2"></i> Admin Bank Details for Deposit
                                </h3>
                                <p className="text-sm text-blue-700 mb-3">Please deposit your payable amount to one of the following accounts before submitting this form:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {bankAccounts?.map(bank => (
                                        <div key={bank.id} className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                                            <div className="font-semibold text-gray-800">{bank.bank_name}</div>
                                            <div className="text-gray-600 font-mono text-sm mt-1">{bank.account_number}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Receipt Image <span className="text-red-500">*</span>
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 sm:p-12 text-center transition-colors cursor-pointer"
                                onClick={() => document.getElementById('receiptUpload')?.click()}
                                style={{ borderColor: formData.receiptFile ? PINK_500 : undefined }}
                            >
                                <div className="flex flex-col items-center">
                                    {formData.receiptFile ? (
                                        <>
                                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-green-500 mb-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm10 2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V7zm-3 7a1 1 0 100 2h6a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
                                            <h3 className="text-lg sm:text-xl font-semibold text-green-600 mb-2">File Selected: {formData.receiptFile.name}</h3>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                            <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">Upload Receipt Image</h3>
                                        </>
                                    )}
                                    <p className="text-gray-500 text-sm sm:text-base mb-2">Click to browse or drag and drop</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                                </div>
                                <input
                                    type="file"
                                    id="receiptUpload"
                                    name="receiptFile"
                                    accept="image/*,.pdf"
                                    required
                                    disabled={isSubmitting}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">This is mandatory proof of payment received</p>
                        </div>

                        {/* Bank Selection - Show before OCR scan */}
                        <div>
                            <label htmlFor="bankId" className="block text-sm font-semibold text-gray-700 mb-2">
                                Beneficiary Bank <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="bankId"
                                name="bankId"
                                value={formData.bankId}
                                onChange={handleChange}
                                required
                                disabled={isSubmitting}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                            >
                                <option value="">Select a bank</option>
                                {bankAccounts.map((bank) => (
                                    <option key={bank.id} value={String(bank.id)}>
                                        {bank.bank_name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Select the bank account for payment verification. The account number will be automatically verified in the OCR text when you scan the receipt.
                            </p>
                        </div>



                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="bankAccountNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Beneficiary Account Number
                                            {!formData.bankId && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="text"
                                            id="bankAccountNumber"
                                            name="bankAccountNumber"
                                            value={formData.bankAccountNumber}
                                            onChange={handleChange}
                                            required={!formData.bankId}
                                            disabled={!!formData.bankId}
                                            placeholder={formData.bankId ? "Account number verified from selected bank" : "Enter account number"}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        {formData.bankId && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                <i className="fas fa-info-circle mr-1"></i>
                                                Account number will be automatically verified from the selected bank.
                                            </p>
                                        )}
                                        {ocrResults?.account_number_status && (
                                            <p className={`text-xs mt-1 font-semibold ${
                                                ocrResults.account_number_match 
                                                    ? 'text-green-600' 
                                                    : 'text-red-600'
                                            }`}>
                                                <i className={`fas ${ocrResults.account_number_match ? 'fa-check-circle' : 'fa-times-circle'} mr-1`}></i>
                                                Account Number: {ocrResults.account_number_status}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="bankReference" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Bank Reference Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="bankReference"
                                            name="bankReference"
                                            value={formData.bankReference}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="adId" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Associated Ad <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        id="adId"
                                        name="adId"
                                        value={formData.adId}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting || !hasAdOptions}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                                    >
                                        <option value="" disabled={!hasAdOptions}>
                                            {hasAdOptions ? 'Select an advertisement' : 'No advertisements available. Publish an ad first.'}
                                        </option>
                                        {adOptions.map(ad => (
                                            <option key={ad.id} value={String(ad.id)}>
                                                {(ad.code ?? `Ad #${ad.id}`)} — {ad.title}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-gray-500 mt-1">
                                        This links the payment to a specific advertisement. Only ads you have posted appear in this list.
                                    </p>

                                    {/* Commission Breakdown Display */}
                                    {selectedAdDetails && (
                                        <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-green-800 mb-2 border-b border-green-200 pb-2">Commission Breakdown</h4>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-600">Ad Package Price:</span>
                                                <span className="text-sm font-medium text-gray-800">Rs. {selectedAdDetails.fullPrice.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-sm text-gray-600">Your Commission:</span>
                                                <span className="text-sm font-semibold text-green-600">Rs. {selectedAdDetails.comm.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-green-200">
                                                <span className="font-semibold text-gray-700">Amount to Transfer to Admin:</span>
                                                <span className="font-bold text-lg text-blue-700">Rs. {selectedAdDetails.payable.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                    <div>
                                        <label htmlFor="amount" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Amount Received <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="amount"
                                            name="amount"
                                            value={formData.amount}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting || !!formData.adId}
                                            placeholder={formData.adId ? "Amount loaded from advertisement" : "Enter amount or select an advertisement"}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                        {formData.adId && (
                                            <p className="text-xs text-blue-600 mt-1">
                                                <i className="fas fa-info-circle mr-1"></i>
                                                Amount automatically loaded (Your commission is already deducted).
                                            </p>
                                        )}
                                        {!formData.adId && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Select an advertisement to automatically load the amount, or enter manually.
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="paymentDate" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Date/Time of Payment <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            id="paymentDate"
                                            name="paymentDate"
                                            value={formData.paymentDate}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors text-sm sm:text-base"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Description/Notes
                                    </label>
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Add any additional context or notes about this payment..."
                                        disabled={isSubmitting}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors resize-none text-sm sm:text-base"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className={`w-full text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${isSubmitting || !hasAdOptions ? 'bg-pink-400 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
                                        style={{ backgroundColor: (isSubmitting || !hasAdOptions) ? '#F472B6' : PINK_500 }}
                                        disabled={isSubmitting || !hasAdOptions}
                                    >
                                        {isSubmitting ? 'Submitting Proof...' : 'Submit Payment Proof'}
                                    </button>
                                </div>
                    </form>
                </div>

                <div className="mt-6 rounded-lg p-4" style={{ backgroundColor: BLUE_100, borderColor: 'rgb(219 234 254)' }}>
                    <div className="flex items-start">
                        <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
                        </svg>
                        <div>
                            <h4 className="text-sm font-semibold mb-1" style={{ color: BLUE_500 }}>Secure Submission</h4>
                            <p className="text-xs" style={{ color: 'rgb(29 78 216)' }}>
                                All payment information is encrypted and securely transmitted. Your submission will be reviewed by our admin team within 24-48 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentReportForm;