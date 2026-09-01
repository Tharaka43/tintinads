// resources/js/components/OcrUploader.jsx

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

type OcrResults = {
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
};

function OcrUploader() {
    const [file, setFile] = useState<File | null>(null);
    const [results, setResults] = useState<OcrResults | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [accountNumberQuery, setAccountNumberQuery] = useState('');
    const [accountMatchStatus, setAccountMatchStatus] = useState<'idle' | 'success' | 'fail' | 'input-required'>('idle');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] ?? null;
        setFile(selectedFile);
        setResults(null);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('receipt_image', file);

        try {
            // Laravel Backend Route එකට POST request එක යවමු
            const response = await axios.post('/ocr', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setResults(response.data.results);
        } catch (err) {
            console.error(err);
            setError('Failed to process receipt. Check console for details.');
            setResults(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setAccountNumberQuery('');
        setAccountMatchStatus('idle');
    }, [results]);

    const handleAccountNumberSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!results) {
            return;
        }

        const trimmed = accountNumberQuery.trim();
        if (trimmed.length === 0) {
            setAccountMatchStatus('input-required');
            return;
        }

        const normalizeForSearch = (value: string) => value.replace(/\s+/g, '').toLowerCase();

        const haystack = normalizeForSearch(results.full_text);
        const needle = normalizeForSearch(trimmed);

        if (haystack.includes(needle)) {
            setAccountMatchStatus('success');
        } else {
            setAccountMatchStatus('fail');
        }
    };

    const processedAtDisplay = useMemo(() => {
        if (!results?.processed_at) {
            return null;
        }

        const date = new Date(results.processed_at);
        if (Number.isNaN(date.getTime())) {
            return results.processed_at;
        }

        return date.toLocaleString();
    }, [results?.processed_at]);

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2>🧾 OCR Receipt Uploader (Laravel + React + OCR.space)</h2>

            <form onSubmit={handleSubmit} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '5px' }}>
                <input
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit" disabled={loading || !file} style={{ marginLeft: '10px' }}>
                    {loading ? 'Processing...' : 'Extract Data'}
                </button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>Error: {error}</p>}

            {results && (
                <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '15px' }}>
                    <h3>✅ Extracted Data:</h3>
                    <p><strong>Bank Reference Number:</strong> {results.bank_reference_number}</p>
                    <p><strong>Beneficiary Name:</strong> {results.beneficiary_name}</p>
                    <p><strong>Transfer Amount:</strong> {results.transfer_amount}</p>
                    {results.transfer_amount_value !== null && (
                        <p><strong>Transfer Amount (numeric):</strong> {results.transfer_amount_value.toLocaleString()}</p>
                    )}
                    <p><strong>Transfer Currency:</strong> {results.transfer_currency}</p>
                    <p><strong>Transaction Date/Time:</strong> {results.transaction_datetime}</p>
                    <p><strong>Payment Date:</strong> {results.payment_date}</p>
                    {processedAtDisplay && (
                        <p><strong>Processed At:</strong> {processedAtDisplay}</p>
                    )}
                    <p><strong>Stored Path:</strong> {results.stored_path}</p>
                    {results.stored_url && (
                        <p>
                            <strong>Stored URL:</strong>{' '}
                            <a href={results.stored_url} target="_blank" rel="noopener noreferrer">
                                View uploaded file
                            </a>
                        </p>
                    )}

                    <p style={{ marginTop: '12px' }}>---</p>
                    <h4>Full OCR Text:</h4>
                    <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
                        {results.full_text}
                    </pre>
                </div>
            )}

            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '6px' }}>
                <h4>Beneficiary Account Verification</h4>
                <form onSubmit={handleAccountNumberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label>
                        Enter Beneficiary Account Number:
                        <input
                            type="text"
                            value={accountNumberQuery}
                            onChange={(event) => setAccountNumberQuery(event.target.value)}
                            placeholder="e.g. 8010055683"
                            style={{ marginTop: '6px', padding: '6px 8px' }}
                        />
                    </label>
                    <button type="submit" style={{ alignSelf: 'flex-start' }} disabled={!results || loading}>
                        Check in OCR Text
                    </button>
                </form>

                {!results && (
                    <p style={{ color: '#555', marginTop: '10px' }}>
                        Upload a receipt and extract the data before checking for a match.
                    </p>
                )}

                {results && accountMatchStatus === 'success' && (
                    <p style={{ color: 'green', marginTop: '10px' }}>Success! The account number appears in the OCR text.</p>
                )}
                {results && accountMatchStatus === 'fail' && (
                    <p style={{ color: 'red', marginTop: '10px' }}>No match found in the OCR text.</p>
                )}
                {accountMatchStatus === 'input-required' && (
                    <p style={{ color: '#cc8800', marginTop: '10px' }}>Please enter an account number before checking.</p>
                )}
            </div>
        </div>
    );
}

export default OcrUploader;