import React, { useState, useMemo, useEffect } from 'react';
import axios from 'axios';

type Status = 'Pending Review' | 'Confirmed' | 'Rejected';

interface Transaction {
    id: string;
    agent: { name: string; id: string; email: string };
    ad: { code: string; title: string };
    payment: { amount: number; commission: number; date: string; method: string; ref: string };
    status: Status;
    proofImg: string | null;
}

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
    const classes = useMemo(() => {
        switch (status) {
            case 'Confirmed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending Review': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }, [status]);

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${classes}`}>
            {status}
        </span>
    );
};

const CommissionReview: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [statusFilter, setStatusFilter] = useState<string>('All Status');
    const [isLoading, setIsLoading] = useState(true);
    const [slipImage, setSlipImage] = useState<string | null>(null);

    const loadCommissions = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get('/admin/api/commissions');
            if (response.data.success) {
                // Map backend format to component format if needed. 
                // Assuming it's already properly formatted or adapting here:
                const mapped = response.data.transactions.map((t: any) => ({
                    id: t.id,
                    agent: { name: t.agent?.name || 'Unknown', id: t.agent?.id, email: t.agent?.email },
                    ad: { code: t.advertisement?.code || 'N/A', title: t.advertisement?.title || 'Unknown Ad' },
                    payment: { 
                        amount: parseFloat(t.amount) || 0, 
                        commission: parseFloat(t.commission) || 0, 
                        date: new Date(t.payment_datetime).toLocaleDateString(), 
                        method: 'Bank Transfer',
                        ref: t.bank_reference_number
                    },
                    status: t.status || 'Pending Review',
                    proofImg: t.receipt_path ? `/storage/${t.receipt_path}` : null
                }));
                setTransactions(mapped);
            }
        } catch (err) {
            console.error('Failed to load commissions', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { loadCommissions(); }, []);

    const doAction = async (endpoint: string, id: string, msg: string) => {
        try {
            const res = await axios.post(`/admin/api/commissions/${id}/${endpoint}`);
            if (res.data.success) { 
                loadCommissions(); 
            }
        } catch (e: any) {
            alert(e?.response?.data?.message || 'Action failed.');
        }
    };

    const filteredTransactions = useMemo(() => {
        if (statusFilter === 'All Status') return transactions;
        return transactions.filter(t => t.status === statusFilter);
    }, [transactions, statusFilter]);

    const stats = useMemo(() => {
        const totalAmount = transactions.reduce((sum, t) => sum + t.payment.amount, 0);
        const totalCommission = transactions.reduce((sum, t) => sum + t.payment.commission, 0);
        const pendingCount = transactions.filter(t => t.status === 'Pending Review').length;
        return { totalAmount, totalCommission, pendingCount };
    }, [transactions]);

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Commission Review
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Review agent payouts, verify bank deposits and approve transactions.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 min-w-[120px]">
                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Net Deposits</div>
                        <div className="text-xl font-bold text-gray-900">Rs. {stats.totalAmount.toLocaleString()}</div>
                    </div>
                    <div className="bg-pink-50 px-4 py-2 rounded-xl border border-pink-100 min-w-[120px]">
                        <div className="text-xs text-pink-600 font-medium uppercase tracking-wider mb-1">Agent Commissions</div>
                        <div className="text-xl font-bold text-pink-700">Rs. {stats.totalCommission.toLocaleString()}</div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 min-w-[90px] text-center">
                        <div className="text-xs text-amber-600 font-medium uppercase tracking-wider mb-1">Pending</div>
                        <div className="text-xl font-bold text-amber-700">{stats.pendingCount}</div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 border-b border-gray-100 overflow-x-auto shrink-0 bg-gray-50/50">
                <nav className="-mb-px flex space-x-6">
                    {['All Status', 'Pending Review', 'Confirmed', 'Rejected'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setStatusFilter(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                statusFilter === tab
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                ) : filteredTransactions.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-3">🧾</div>
                        <h3 className="text-lg font-semibold text-gray-900">No transactions found</h3>
                        <p className="text-gray-500 mt-1 text-sm">No payment records matching this status.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredTransactions.map(t => (
                            <div key={t.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-5 hover:shadow-md transition-shadow items-start lg:items-center">
                                
                                <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                                    {/* Agent Info */}
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Agent</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                                                {t.agent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900">{t.agent.name}</p>
                                                <p className="text-xs text-gray-500">{t.agent.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Ad Info */}
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Advertisement</p>
                                        <p className="font-bold text-sm text-gray-900 truncate">{t.ad.title}</p>
                                        <p className="text-xs text-gray-500 font-mono bg-gray-100 inline-block px-1.5 py-0.5 rounded mt-0.5">{t.ad.code}</p>
                                    </div>

                                    {/* Payment Info */}
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Deposit Details</p>
                                        <p className="font-bold text-sm text-gray-900">Net: Rs. {t.payment.amount.toLocaleString()}</p>
                                        <p className="text-xs text-pink-600 font-bold">Comm: Rs. {t.payment.commission.toLocaleString()}</p>
                                    </div>

                                    {/* Meta Info */}
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Status & Meta</p>
                                        <div className="mb-1"><StatusBadge status={t.status} /></div>
                                        <p className="text-xs text-gray-500">{t.payment.date} • Ref: {t.payment.ref}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row flex-wrap justify-end gap-2 shrink-0 lg:border-l border-gray-100 lg:pl-5 pt-4 lg:pt-0 border-t lg:border-t-0 w-full lg:w-auto">
                                    {t.proofImg ? (
                                        <button
                                            onClick={() => setSlipImage(t.proofImg!)}
                                            className="inline-flex items-center justify-center px-3 py-2 bg-pink-50 text-pink-600 text-xs font-bold rounded-xl hover:bg-pink-100 transition"
                                        >
                                            🧾 View Slip
                                        </button>
                                    ) : (
                                        <div className="inline-flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl border border-gray-100 cursor-not-allowed">
                                            No Slip
                                        </div>
                                    )}

                                    {t.status === 'Pending Review' && (
                                        <>
                                            <button
                                                onClick={() => doAction('confirm', t.id, 'Transaction Confirmed!')}
                                                className="inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition shadow-sm"
                                            >
                                                ✓ Confirm
                                            </button>
                                            <button
                                                onClick={() => doAction('reject', t.id, 'Transaction Rejected!')}
                                                className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition"
                                            >
                                                ✕ Reject
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* View Slip Modal */}
            {slipImage && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={() => setSlipImage(null)}
                >
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <button
                            className="absolute -top-10 right-0 text-white font-semibold text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition"
                            onClick={() => setSlipImage(null)}
                        >
                            Close
                        </button>
                        {slipImage.toLowerCase().endsWith('.pdf') ? (
                            <iframe 
                                src={slipImage} 
                                title="Payment Receipt PDF"
                                className="w-full min-h-[70vh] rounded-xl shadow-2xl bg-white"
                            ></iframe>
                        ) : (
                            <img
                                src={slipImage}
                                alt="Payment Receipt"
                                className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl bg-white"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommissionReview;
