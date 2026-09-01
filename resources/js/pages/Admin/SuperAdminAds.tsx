import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';

type AdStatus = 'Active' | 'Blocked' | 'Featured' | 'Pending Review' | 'Expired';
type PaymentStatus = 'paid' | 'unpaid';

interface Ad {
    id: string;
    title: string;
    description?: string;
    price?: number;
    location?: string;
    category: string;
    agentName: string;
    agentId: string;
    status: AdStatus;
    paymentStatus: PaymentStatus;
    datePosted: string;
    imgSrc: string;
    isFeatured: boolean;
    isSelected: boolean;
    advertisement_id?: number;
    receiptPath?: string | null;
}

interface Stats {
    totalAds: number;
    activeAds: number;
    blockedAds: number;
    featuredAds: number;
}

interface Pagination {
    current_page: number;
    total_pages: number;
    per_page: number;
    total_items: number;
    from: number;
    to: number;
}

const StatusBadge: React.FC<{ status: AdStatus }> = ({ status }) => {
    const classes = useMemo(() => {
        switch (status) {
            case 'Active': return 'bg-green-100 text-green-700 border-green-200';
            case 'Featured': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'Blocked': return 'bg-red-100 text-red-700 border-red-200';
            case 'Pending Review': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Expired': return 'bg-gray-100 text-gray-500 border-gray-200';
            default: return 'bg-gray-100 text-gray-500 border-gray-200';
        }
    }, [status]);
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${classes}`}>
            {status}
        </span>
    );
};

const PaymentBadge: React.FC<{ status: PaymentStatus }> = ({ status }) => {
    const classes = status === 'paid'
        ? 'bg-green-100 text-green-700 border-green-200'
        : 'bg-red-100 text-red-700 border-red-200';
    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${classes}`}>
            {status}
        </span>
    );
};

const SuperAdminAds: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [stats, setStats] = useState<Stats>({ totalAds: 0, activeAds: 0, blockedAds: 0, featuredAds: 0 });
    const [pagination, setPagination] = useState<Pagination>({ current_page: 1, total_pages: 1, per_page: 10, total_items: 0, from: 0, to: 0 });
    const [activeTab, setActiveTab] = useState('All Status');
    const [isLoading, setIsLoading] = useState(true);
    const [slipImage, setSlipImage] = useState<string | null>(null);
    const [previewAd, setPreviewAd] = useState<Ad | null>(null);

    const tabs = ['All Status', 'Active', 'Pending Review', 'Blocked', 'Featured'];

    const loadAds = useCallback(async (page: number = 1) => {
        setIsLoading(true);
        try {
            const res = await axios.get('/admin/api/advertisements', {
                params: { page, status: activeTab, per_page: 10 }
            });
            if (res.data.success) {
                setAds(res.data.ads || []);
                setStats(res.data.stats || { totalAds: 0, activeAds: 0, blockedAds: 0, featuredAds: 0 });
                if (res.data.pagination) {
                    setPagination({
                        current_page: res.data.pagination.current_page || 1,
                        total_pages: res.data.pagination.total_pages || 1,
                        per_page: res.data.pagination.per_page || 10,
                        total_items: res.data.pagination.total_items || 0,
                        from: res.data.pagination.from ?? 0,
                        to: res.data.pagination.to ?? 0,
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load ads', e);
        } finally {
            setIsLoading(false);
        }
    }, [activeTab]);

    useEffect(() => { loadAds(1); }, [loadAds]);

    const doAction = async (endpoint: string, adId: number, msg: string) => {
        try {
            const res = await axios.post(`/admin/api/advertisements/${endpoint}`, { ad_ids: [adId] });
            if (res.data.success) { alert(msg); loadAds(pagination.current_page); }
        } catch (e: any) {
            alert(e?.response?.data?.message || 'Action failed.');
        }
    };

    const togglePayment = async (adId: number, newStatus: PaymentStatus) => {
        try {
            const res = await axios.post('/admin/api/advertisements/update-payment-status', {
                ad_ids: [adId], payment_status: newStatus,
            });
            if (res.data.success) loadAds(pagination.current_page);
        } catch {
            alert('Failed to update payment status.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Ad Approvals
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Review new advertisements and verify bank slips before approving.</p>
                </div>
                <div className="flex gap-3">
                    <div className="bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 text-center min-w-[80px]">
                        <div className="text-xs text-gray-500 font-medium">Total</div>
                        <div className="text-xl font-bold text-gray-900">{stats.totalAds}</div>
                    </div>
                    <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center min-w-[80px]">
                        <div className="text-xs text-green-600 font-medium">Active</div>
                        <div className="text-xl font-bold text-green-700">{stats.activeAds}</div>
                    </div>
                    <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-center min-w-[80px]">
                        <div className="text-xs text-amber-600 font-medium">Pending</div>
                        <div className="text-xl font-bold text-amber-700">{Math.max(0, stats.totalAds - stats.activeAds - stats.blockedAds)}</div>
                    </div>
                    <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100 text-center min-w-[80px]">
                        <div className="text-xs text-red-600 font-medium">Blocked</div>
                        <div className="text-xl font-bold text-red-700">{stats.blockedAds}</div>
                    </div>
                </div>
            </div>

            <div className="px-6 border-b border-gray-100 overflow-x-auto shrink-0">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeTab === tab
                                    ? 'border-pink-500 text-pink-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
                    </div>
                ) : ads.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="text-5xl mb-3">📭</div>
                        <h3 className="text-lg font-semibold text-gray-900">No ads found</h3>
                        <p className="text-gray-500 mt-1 text-sm">No advertisements matching this status.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {ads.map(ad => (
                            <div key={ad.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 hover:shadow-md transition-shadow">
                                <div className="w-full md:w-44 h-32 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                                    <img src={ad.imgSrc} alt={ad.title} className="w-full h-full object-cover" />
                                    <div className="absolute top-2 left-2"><StatusBadge status={ad.status} /></div>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">{ad.title}</h3>
                                            <span className="text-sm font-bold text-pink-600 shrink-0">Rs. {ad.price ? ad.price.toLocaleString() : '0'}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                                            <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono">{ad.id}</span>
                                            <span>• {ad.category}</span>
                                            <span>• {ad.location || 'N/A'}</span>
                                            <span>• {ad.datePosted}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3 p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white font-bold text-[10px] shrink-0">
                                                    {(ad.agentName || 'A').charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-gray-800">{ad.agentName}</span>
                                                <span className="text-gray-400">({ad.agentId})</span>
                                            </div>
                                            <div className="h-3 w-px bg-gray-200"></div>
                                            <PaymentBadge status={ad.paymentStatus} />
                                            {ad.paymentStatus === 'unpaid' ? (
                                                <button onClick={() => togglePayment(ad.advertisement_id!, 'paid')} className="text-green-600 font-semibold hover:underline">Mark Paid</button>
                                            ) : (
                                                <button onClick={() => togglePayment(ad.advertisement_id!, 'unpaid')} className="text-red-500 font-semibold hover:underline">Mark Unpaid</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-row md:flex-col justify-end gap-2 shrink-0 md:border-l border-gray-100 md:pl-4 pt-3 md:pt-0 border-t md:border-t-0">
                                    <button onClick={() => setPreviewAd(ad)} className="inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition">Preview</button>
                                    {ad.receiptPath ? (
                                        <button onClick={() => setSlipImage(ad.receiptPath!)} className="inline-flex items-center justify-center px-3 py-2 bg-pink-50 text-pink-600 text-xs font-bold rounded-xl hover:bg-pink-100 transition">View Slip</button>
                                    ) : (
                                        <div className="inline-flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl border border-gray-100 cursor-not-allowed">No Slip</div>
                                    )}
                                    {ad.status !== 'Active' && ad.status !== 'Featured' && (
                                        <button onClick={() => doAction('activate', ad.advertisement_id!, 'Ad Approved!')} className="inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition shadow-sm">Approve</button>
                                    )}
                                    {ad.status !== 'Blocked' && (
                                        <button onClick={() => doAction('block', ad.advertisement_id!, 'Ad Blocked!')} className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition">Reject</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {!isLoading && pagination.total_pages > 1 && (
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between shrink-0">
                    <span className="text-sm text-gray-500">Showing {pagination.from}–{pagination.to} of {pagination.total_items}</span>
                    <div className="flex gap-2">
                        <button onClick={() => loadAds(pagination.current_page - 1)} disabled={pagination.current_page === 1} className="px-4 py-1.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Previous</button>
                        <span className="px-3 py-1.5 text-sm text-gray-600 font-medium">{pagination.current_page} / {pagination.total_pages}</span>
                        <button onClick={() => loadAds(pagination.current_page + 1)} disabled={pagination.current_page === pagination.total_pages} className="px-4 py-1.5 border border-gray-200 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition">Next</button>
                    </div>
                </div>
            )}

            {slipImage && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSlipImage(null)}>
                    <div className="relative max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                        <button className="absolute -top-10 right-0 text-white font-semibold text-sm px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg transition" onClick={() => setSlipImage(null)}>Close</button>
                        <img src={slipImage} alt="Payment Receipt" className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl bg-white" />
                    </div>
                </div>
            )}

            {previewAd && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewAd(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 shrink-0">
                            <h3 className="font-bold text-gray-900 text-base">Ad Preview</h3>
                            <button onClick={() => setPreviewAd(null)} className="text-gray-400 hover:text-red-500 transition text-lg">x</button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            <img src={previewAd.imgSrc} alt="Ad" className="w-full h-52 object-cover rounded-xl mb-5 bg-gray-100" />
                            <div className="flex justify-between items-start gap-3 mb-3">
                                <h2 className="text-xl font-bold text-gray-900">{previewAd.title}</h2>
                                <span className="text-lg font-bold text-pink-600 shrink-0">Rs. {previewAd.price ? previewAd.price.toLocaleString() : '0'}</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <StatusBadge status={previewAd.status} />
                                <PaymentBadge status={previewAd.paymentStatus} />
                                <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">{previewAd.category}</span>
                                {previewAd.location && <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">{previewAd.location}</span>}
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Description</h4>
                                <div className="text-gray-600 text-sm whitespace-pre-wrap leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
                                    {previewAd.description || 'No description provided.'}
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
                                <span className="font-semibold">Agent:</span> {previewAd.agentName} ({previewAd.agentId}) <span className="mx-2">·</span> <span className="font-semibold">Posted:</span> {previewAd.datePosted}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 shrink-0">
                            {previewAd.receiptPath && (
                                <button onClick={() => { setSlipImage(previewAd.receiptPath!); setPreviewAd(null); }} className="px-4 py-2 rounded-xl text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100">View Bank Slip</button>
                            )}
                            <button onClick={() => setPreviewAd(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50">Close</button>
                            {previewAd.status !== 'Active' && previewAd.status !== 'Featured' && (
                                <button onClick={() => { doAction('activate', previewAd.advertisement_id!, 'Ad Approved!'); setPreviewAd(null); }} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-500 hover:bg-green-600 shadow-sm">Approve Ad</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminAds;
