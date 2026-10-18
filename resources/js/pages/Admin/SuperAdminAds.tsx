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
    phone_number?: string | null;
    whatsapp_number?: string | null;
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

const formatWhatsAppNumber = (raw?: string | null): string => {
    if (!raw) return '';
    const digits = raw.replace(/[^0-9]/g, '');
    if (!digits) return '';
    if (digits.startsWith('94') && digits.length >= 11) return digits;
    if (digits.startsWith('0') && digits.length === 10) return '94' + digits.slice(1);
    if (digits.length === 9) return '94' + digits;
    return digits;
};

const buildAdvertiserWhatsAppMessage = (ad: Ad): string => {
    const adUrl = `https://tintinads.com/ad/${ad.advertisement_id}`;
    const priceStr = ad.price ? `Rs. ${Number(ad.price).toLocaleString()}` : 'Negotiable';
    const contactStr = ad.whatsapp_number || ad.phone_number || '';

    return [
        adUrl,
        '',
        '🌟 *ආයුබෝවන්! TinTinAds.com වෙතින් විශේෂ දැනුම්දීමයි.*',
        '',
        `ඔබගේ *"${ad.title}"* දැන්වීම දැන් ශ්‍රී ලංකාවේ වේගයෙන්ම ජනප්‍රිය වන *TinTinAds.com* වෙබ් අඩවියේ *Verified දැන්වීමක් ලෙස නොමිලේම* පළ කර ඇත! 🎉`,
        '',
        `💰 *මිල:* ${priceStr}`,
        `📍 *ස්ථානය:* ${ad.location || 'Sri Lanka'}`,
        contactStr ? `📞 *දුරකථන:* ${contactStr}` : '',
        '',
        '📸 *ඔබගේ දැන්වීමේ ඡායාරූප සහ විස්තර මෙතනින් බලන්න:*',
        `👉 ${adUrl}`,
        '',
        '✅ මෙම දැන්වීමේ ඡායාරූප, මිල ගණන් හෝ විස්තර වල යම් අඩුපාඩුවක් හෝ වෙනස් කරගත යුතු දෙයක් ඇත්නම් කරුණාකර අපට මේ WhatsApp අංකයට දැනුම් දෙන්න. අපි එය වහාම නිවැරදි කර දෙන්නෙමු! 🤝',
    ].filter(Boolean).join('\n');
};

const generateAdPhotoCardBlob = async (ad: Ad): Promise<Blob | null> => {
    return new Promise((resolve) => {
        try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = 800;
                    canvas.height = 900;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        resolve(null);
                        return;
                    }

                    // Background
                    ctx.fillStyle = '#0f172a';
                    ctx.fillRect(0, 0, 800, 900);

                    // Top Brand Header
                    const grad = ctx.createLinearGradient(0, 0, 800, 0);
                    grad.addColorStop(0, '#ec4899');
                    grad.addColorStop(1, '#e11d48');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 800, 76);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 28px sans-serif';
                    ctx.fillText('TinTinAds.com  •  Verified Ad', 28, 48);

                    // Draw Ad Photo (centered cover in 800x600 area)
                    const areaW = 800;
                    const areaH = 600;
                    const scale = Math.max(areaW / img.width, areaH / img.height);
                    const drawW = img.width * scale;
                    const drawH = img.height * scale;
                    const offsetX = (areaW - drawW) / 2;
                    const offsetY = 76 + (areaH - drawH) / 2;

                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(0, 76, areaW, areaH);
                    ctx.clip();
                    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
                    ctx.restore();

                    // Online Today Pill on Photo
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
                    ctx.fillRect(24, 98, 210, 42);
                    ctx.fillStyle = '#10b981';
                    ctx.beginPath();
                    ctx.arc(46, 119, 8, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 20px sans-serif';
                    ctx.fillText('ONLINE TODAY', 66, 126);

                    // Bottom Info Panel
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 676, 800, 224);

                    // Title
                    ctx.fillStyle = '#111827';
                    ctx.font = 'bold 30px sans-serif';
                    const shortTitle = ad.title.length > 42 ? ad.title.slice(0, 42) + '...' : ad.title;
                    ctx.fillText(shortTitle, 28, 728);

                    // Price
                    ctx.fillStyle = '#e11d48';
                    ctx.font = 'bold 36px sans-serif';
                    const priceText = `Rs. ${ad.price ? Number(ad.price).toLocaleString() : '0'}`;
                    ctx.fillText(priceText, 28, 782);

                    // Location & URL
                    ctx.fillStyle = '#4b5563';
                    ctx.font = 'bold 22px sans-serif';
                    ctx.fillText(`📍 ${ad.location || 'Sri Lanka'}   |   🌐 tintinads.com/ad/${ad.advertisement_id}`, 28, 830);

                    ctx.fillStyle = '#059669';
                    ctx.font = 'bold 20px sans-serif';
                    ctx.fillText('🛡️ 100% Real Photo & Active Contact Checked on TinTinAds.com', 28, 872);

                    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95);
                } catch {
                    resolve(null);
                }
            };
            img.onerror = () => resolve(null);
            img.src = ad.imgSrc || '/placeholder-image.jpg';
        } catch {
            resolve(null);
        }
    });
};

const SuperAdminAds: React.FC = () => {
    const [ads, setAds] = useState<Ad[]>([]);
    const [stats, setStats] = useState<Stats>({ totalAds: 0, activeAds: 0, blockedAds: 0, featuredAds: 0 });
    const [pagination, setPagination] = useState<Pagination>({ current_page: 1, total_pages: 1, per_page: 10, total_items: 0, from: 0, to: 0 });
    const [activeTab, setActiveTab] = useState('All Status');
    const [isLoading, setIsLoading] = useState(true);
    const [slipImage, setSlipImage] = useState<string | null>(null);
    const [previewAd, setPreviewAd] = useState<Ad | null>(null);
    const [sentAdIds, setSentAdIds] = useState<number[]>(() => {
        try {
            const raw = localStorage.getItem('tintinads_admin_wa_sent');
            return raw ? JSON.parse(raw) : [];
        } catch {
            return [];
        }
    });
    const [toastNote, setToastNote] = useState<string | null>(null);

    const tabs = ['All Status', 'Active', 'Pending Review', 'Blocked', 'Featured'];

    const markAdAsSent = useCallback((adId?: number) => {
        if (!adId) return;
        setSentAdIds((prev) => {
            const updated = prev.includes(adId) ? prev : [...prev, adId];
            try {
                localStorage.setItem('tintinads_admin_wa_sent', JSON.stringify(updated));
            } catch {
                // ignore
            }
            return updated;
        });
    }, []);

    const handleSendWhatsAppToOwner = useCallback(async (ad: Ad) => {
        const targetPhone = formatWhatsAppNumber(ad.whatsapp_number || ad.phone_number);
        const message = buildAdvertiserWhatsAppMessage(ad);

        // Try to generate & copy the branded Ad Photo Card to clipboard so Admin can also Ctrl+V paste the photo!
        const blob = await generateAdPhotoCardBlob(ad);
        if (blob && navigator.clipboard && typeof ClipboardItem !== 'undefined') {
            try {
                await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
                setToastNote('📸 දැන්වීමේ Photo Card එක Clipboard එකට Copy විය! WhatsApp විවෘත වූ පසු Link Preview එක සමඟ හෝ Ctrl+V ඔබා Photo එකද යැවිය හැක.');
                setTimeout(() => setToastNote(null), 6000);
            } catch {
                // Clipboard image write not supported on some mobile browsers
            }
        }

        markAdAsSent(ad.advertisement_id);

        const waUrl = targetPhone
            ? `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(message)}`
            : `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;

        window.open(waUrl, '_blank', 'noopener,noreferrer');
    }, [markAdAsSent]);

    const handleSharePhotoAndTextMobile = useCallback(async (ad: Ad) => {
        const message = buildAdvertiserWhatsAppMessage(ad);
        const blob = await generateAdPhotoCardBlob(ad);
        markAdAsSent(ad.advertisement_id);

        if (blob && navigator.share) {
            try {
                const file = new File([blob], `tintinads-${ad.advertisement_id}.png`, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: `${ad.title} - TinTinAds.com`,
                        text: message,
                        files: [file],
                    });
                    return;
                }
            } catch {
                // fallback to direct WhatsApp link
            }
        }
        handleSendWhatsAppToOwner(ad);
    }, [handleSendWhatsAppToOwner, markAdAsSent]);

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
            {toastNote && (
                <div className="fixed top-4 right-4 z-[250] max-w-md bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-400/40 flex items-center gap-3 text-xs sm:text-sm font-semibold">
                    <i className="fab fa-whatsapp text-2xl text-emerald-400 shrink-0"></i>
                    <span>{toastNote}</span>
                </div>
            )}

            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-end justify-between gap-4 shrink-0">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                        Ad Approvals & WhatsApp Outreach
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Review advertisements, verify bank slips, and send ad links with photo previews directly to advertisers on WhatsApp.</p>
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
                        {ads.map(ad => {
                            const isWaSent = ad.advertisement_id ? sentAdIds.includes(ad.advertisement_id) : false;
                            const contactNum = ad.whatsapp_number || ad.phone_number;
                            return (
                                <div key={ad.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 hover:shadow-md transition-shadow">
                                    <div className="w-full md:w-44 h-36 shrink-0 rounded-xl overflow-hidden bg-gray-100 relative">
                                        <img src={ad.imgSrc} alt={ad.title} className="w-full h-full object-cover" />
                                        <div className="absolute top-2 left-2"><StatusBadge status={ad.status} /></div>
                                        {isWaSent && (
                                            <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
                                                <i className="fas fa-check-circle"></i> WA Sent
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                                <h3 className="text-base font-bold text-gray-900 leading-tight line-clamp-2">{ad.title}</h3>
                                                <span className="text-sm font-bold text-pink-600 shrink-0">Rs. {ad.price ? ad.price.toLocaleString() : '0'}</span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mb-3">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded-md font-mono">{ad.id}</span>
                                                <span>• {ad.category}</span>
                                                <span>• {ad.location || 'N/A'}</span>
                                                <span>• {ad.datePosted}</span>
                                                {contactNum && (
                                                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
                                                        <i className="fab fa-whatsapp text-emerald-600"></i>
                                                        {contactNum}
                                                    </span>
                                                )}
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
                                                <div className="h-3 w-px bg-gray-200"></div>
                                                <a
                                                    href={`/ad/${ad.advertisement_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-pink-600 font-bold hover:underline flex items-center gap-1"
                                                >
                                                    <i className="fas fa-external-link-alt text-[10px]"></i>
                                                    View Live Ad
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap md:flex-col justify-end gap-2 shrink-0 md:border-l border-gray-100 md:pl-4 pt-3 md:pt-0 border-t md:border-t-0">
                                        {/* Send to Advertiser on WhatsApp Button */}
                                        <button
                                            type="button"
                                            onClick={() => handleSendWhatsAppToOwner(ad)}
                                            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-extrabold rounded-xl transition shadow-sm cursor-pointer ${
                                                isWaSent
                                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                                    : 'bg-[#25D366] hover:bg-green-600 text-white'
                                            }`}
                                            title={contactNum ? `Send WhatsApp to ${contactNum}` : 'Send Ad on WhatsApp'}
                                        >
                                            <i className="fab fa-whatsapp text-sm"></i>
                                            <span>{isWaSent ? 'Sent (නැවත යවන්න)' : 'Send to Owner (WA)'}</span>
                                        </button>

                                        <button onClick={() => setPreviewAd(ad)} className="inline-flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl hover:bg-blue-100 transition cursor-pointer">Preview & Share</button>
                                        {ad.receiptPath ? (
                                            <button onClick={() => setSlipImage(ad.receiptPath!)} className="inline-flex items-center justify-center px-3 py-2 bg-pink-50 text-pink-600 text-xs font-bold rounded-xl hover:bg-pink-100 transition cursor-pointer">View Slip</button>
                                        ) : (
                                            <div className="inline-flex items-center justify-center px-3 py-2 bg-gray-50 text-gray-400 text-xs font-bold rounded-xl border border-gray-100 cursor-not-allowed">No Slip</div>
                                        )}
                                        {ad.status !== 'Active' && ad.status !== 'Featured' && (
                                            <button onClick={() => doAction('activate', ad.advertisement_id!, 'Ad Approved!')} className="inline-flex items-center justify-center px-3 py-2 bg-green-500 text-white text-xs font-bold rounded-xl hover:bg-green-600 transition shadow-sm cursor-pointer">Approve</button>
                                        )}
                                        {ad.status !== 'Blocked' && (
                                            <button onClick={() => doAction('block', ad.advertisement_id!, 'Ad Blocked!')} className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition cursor-pointer">Reject</button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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
                        {slipImage.toLowerCase().endsWith('.pdf') ? (
                            <iframe 
                                src={slipImage} 
                                title="Payment Receipt PDF"
                                className="w-full min-h-[70vh] rounded-xl shadow-2xl bg-white"
                            ></iframe>
                        ) : (
                            <img src={slipImage} alt="Payment Receipt" className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl bg-white" />
                        )}
                    </div>
                </div>
            )}

            {previewAd && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setPreviewAd(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[92vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-purple-50 shrink-0">
                            <h3 className="font-bold text-gray-900 text-base">Ad Preview & WhatsApp Message Card</h3>
                            <button onClick={() => setPreviewAd(null)} className="text-gray-400 hover:text-red-500 transition text-lg cursor-pointer">✕</button>
                        </div>
                        <div className="p-5 overflow-y-auto flex-1">
                            {/* Visual WhatsApp Link Card Preview */}
                            <div className="mb-4 bg-[#e5ddd5] p-3.5 rounded-2xl border border-gray-200">
                                <div className="text-[11px] font-bold text-gray-600 mb-2 flex items-center justify-between">
                                    <span><i className="fab fa-whatsapp text-emerald-600 mr-1"></i> WhatsApp Preview (අයිතිකරුට පෙනෙන ආකාරය):</span>
                                    <span className="text-emerald-700 font-mono">{previewAd.whatsapp_number || previewAd.phone_number || 'No Phone'}</span>
                                </div>
                                <div className="bg-[#dcf8c6] rounded-xl p-2.5 shadow-xs border border-emerald-200">
                                    {/* Top Link Preview Card inside WhatsApp Bubble */}
                                    <div className="bg-white rounded-lg overflow-hidden border border-gray-200 mb-2">
                                        <img src={previewAd.imgSrc} alt="Ad" className="w-full h-44 object-cover bg-gray-100" />
                                        <div className="p-2.5 bg-gray-50 border-t border-gray-100">
                                            <p className="text-xs font-bold text-gray-900 truncate">{previewAd.title} (Rs. {previewAd.price ? previewAd.price.toLocaleString() : '0'}) - TinTinAds</p>
                                            <p className="text-[11px] text-gray-500 truncate mt-0.5">📍 {previewAd.location || 'Sri Lanka'} | 📞 {previewAd.phone_number || previewAd.whatsapp_number || ''}</p>
                                            <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">tintinads.com</p>
                                        </div>
                                    </div>
                                    <pre className="text-xs text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                                        {buildAdvertiserWhatsAppMessage(previewAd)}
                                    </pre>
                                </div>
                            </div>

                            <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600">
                                <span className="font-semibold">Agent:</span> {previewAd.agentName} ({previewAd.agentId}) <span className="mx-2">·</span> <span className="font-semibold">Posted:</span> {previewAd.datePosted}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-wrap justify-end gap-2 shrink-0">
                            <button
                                type="button"
                                onClick={() => handleSendWhatsAppToOwner(previewAd)}
                                className="px-4 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#25D366] hover:bg-green-600 shadow-sm flex items-center gap-1.5 cursor-pointer"
                            >
                                <i className="fab fa-whatsapp text-sm"></i>
                                <span>Send to Owner on WhatsApp (Link + Photo)</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSharePhotoAndTextMobile(previewAd)}
                                className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 cursor-pointer"
                            >
                                <i className="fas fa-image"></i>
                                <span>Share Photo Card (Mobile)</span>
                            </button>
                            {previewAd.receiptPath && (
                                <button onClick={() => { setSlipImage(previewAd.receiptPath!); setPreviewAd(null); }} className="px-4 py-2 rounded-xl text-xs font-bold text-pink-600 bg-pink-50 hover:bg-pink-100 cursor-pointer">View Bank Slip</button>
                            )}
                            <button onClick={() => setPreviewAd(null)} className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer">Close</button>
                            {previewAd.status !== 'Active' && previewAd.status !== 'Featured' && (
                                <button onClick={() => { doAction('activate', previewAd.advertisement_id!, 'Ad Approved!'); setPreviewAd(null); }} className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-green-500 hover:bg-green-600 shadow-sm cursor-pointer">Approve Ad</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminAds;
