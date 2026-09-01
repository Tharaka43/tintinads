import React from 'react';
import { Link, router } from '@inertiajs/react';

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/320x240?text=No+Image';

interface ServerAd {
    id: number;
    title: string;
    description: string;
    price: string;
    location: string;
    post_date?: string | null;
    common_category?: string | null;
    listing_category?: string | null;
    sub_category?: string | null;
    image_url?: string | null;
    code?: string | null;
    status?: string | null;
}

interface MyAdsPageProps {
    ads: ServerAd[];
}

const formatDate = (value?: string | null) => {
    if (!value) return 'Not available';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString();
};

const formatPrice = (value: string) => {
    const amount = Number(value);
    if (Number.isNaN(amount)) return value;
    return new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

const getStatusConfig = (status?: string | null) => {
    switch (status) {
        case 'active':
            return { label: 'Active', className: 'bg-green-100 text-green-700 border border-green-200' };
        case 'pending':
        case 'under_review':
            return { label: 'Under Review', className: 'bg-amber-100 text-amber-700 border border-amber-200' };
        case 'rejected':
            return { label: 'Rejected', className: 'bg-red-100 text-red-700 border border-red-200' };
        case 'paused':
            return { label: 'Paused', className: 'bg-gray-100 text-gray-700 border border-gray-200' };
        default:
            return { label: 'Inactive', className: 'bg-gray-100 text-gray-500 border border-gray-200' };
    }
};

const MyAdsPage: React.FC<MyAdsPageProps> = ({ ads }) => {
    const handleCopy = (code?: string | null) => {
        if (!code) return;
        navigator.clipboard.writeText(code)
            .then(() => alert('Code copied to clipboard!'))
            .catch(() => alert('Failed to copy code.'));
    };

    const handleToggleStatus = (id: number, currentStatus: string | null | undefined) => {
        if(currentStatus === 'pending' || currentStatus === 'under_review' || currentStatus === 'rejected') {
            alert('Cannot pause or activate an ad that is under review or rejected.');
            return;
        }
        if (confirm(`Are you sure you want to ${currentStatus === 'active' ? 'pause' : 'activate'} this ad?`)) {
            router.post(`/agent/ads/${id}/toggle`);
        }
    };

    const handleBumpAd = (id: number, currentStatus: string | null | undefined) => {
        if(currentStatus !== 'active') {
            alert('You can only bump active ads.');
            return;
        }
        if (confirm('Are you sure you want to bump this ad to the top?')) {
            router.post(`/agent/ads/${id}/bump`);
        }
    };

    const handleDeleteAd = (id: number) => {
        if (confirm('Are you sure you want to permanently delete this ad? This action cannot be undone.')) {
            router.delete(`/agent/ads/${id}/delete`);
        }
    };

    return (
        <div className="bg-gray-50 min-h-full">
            <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Advertisements</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage, pause, or bump your published ads</p>
                </div>
                <Link
                    href="/agent/post"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-md transition-all hover:from-pink-600 hover:to-purple-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
                >
                    <i className="fas fa-plus" />
                    Post New Ad
                </Link>
            </div>

            {ads.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-pink-200 bg-white p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-pink-500 mb-6">
                        <i className="fas fa-ad text-3xl" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">You haven't posted any ads yet</h2>
                    <p className="mt-2 text-gray-500 max-w-md mx-auto">
                        Ready to get started? Publish your first advertisement to reach thousands of potential clients.
                    </p>
                    <Link
                        href="/agent/post"
                        className="mt-8 inline-flex items-center gap-2 rounded-xl bg-pink-50 px-6 py-3 text-sm font-bold text-pink-600 transition-colors hover:bg-pink-100"
                    >
                        <i className="fas fa-rocket" />
                        Publish Now
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {ads.map((ad) => (
                        <article
                            key={ad.id}
                            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md flex flex-col md:flex-row"
                        >
                            <div className="md:w-64 relative shrink-0">
                                <img
                                    src={ad.image_url || PLACEHOLDER_IMAGE}
                                    alt={ad.title}
                                    className={`h-48 md:h-full w-full ${ad.image_url?.includes('/build/assets/') || !ad.image_url
                                        ? 'object-contain bg-gray-50 p-4'
                                        : 'object-cover'
                                    }`}
                                />
                                <div className="absolute top-3 left-3 md:hidden">
                                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold shadow-sm ${getStatusConfig(ad.status).className}`}>
                                        <i className="fas fa-circle text-[6px]" />
                                        {getStatusConfig(ad.status).label}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 p-5 sm:p-6 flex flex-col">
                                <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-1">{ad.title}</h3>
                                            <span className={`hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${getStatusConfig(ad.status).className}`}>
                                                <i className="fas fa-circle text-[8px]" />
                                                {getStatusConfig(ad.status).label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 flex items-center gap-2">
                                            <i className="far fa-clock"></i>
                                            {formatDate(ad.post_date)}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className="text-xl font-extrabold text-gray-900">{formatPrice(ad.price)}</div>
                                        {ad.listing_category && (
                                            <span className="mt-1 inline-block rounded-lg bg-purple-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 border border-purple-100">
                                                {ad.listing_category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mb-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1 font-medium">
                                        <i className="fas fa-hashtag text-gray-400" />
                                        {ad.code ?? '—'}
                                        <button
                                            type="button"
                                            onClick={() => handleCopy(ad.code)}
                                            className="ml-1 text-pink-500 hover:text-pink-600 transition"
                                            title="Copy Code"
                                        >
                                            <i className="far fa-copy" />
                                        </button>
                                    </span>
                                    {ad.common_category && (
                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 font-medium text-blue-700">
                                            <i className="fas fa-layer-group opacity-70" />
                                            {ad.common_category}
                                        </span>
                                    )}
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 font-medium text-gray-600">
                                        <i className="fas fa-map-marker-alt opacity-70" />
                                        {ad.location}
                                    </span>
                                </div>

                                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2 sm:gap-3">
                                    <Link
                                        href={`/agent/ads/${ad.id}/edit`}
                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 rounded-xl bg-pink-50 px-4 py-2 text-sm font-bold text-pink-600 transition hover:bg-pink-100"
                                    >
                                        <i className="fas fa-pen text-xs" />
                                        Edit
                                    </Link>
                                    
                                    <button
                                        onClick={() => handleToggleStatus(ad.id, ad.status)}
                                        className="flex-1 sm:flex-none inline-flex justify-center items-center gap-2 rounded-xl bg-gray-50 px-4 py-2 text-sm font-bold text-gray-700 transition hover:bg-gray-200 border border-gray-200"
                                    >
                                        <i className={`fas ${ad.status === 'active' ? 'fa-pause' : 'fa-play'} text-xs`} />
                                        {ad.status === 'active' ? 'Pause' : 'Activate'}
                                    </button>

                                    <button
                                        onClick={() => handleBumpAd(ad.id, ad.status)}
                                        disabled={ad.status !== 'active'}
                                        className={`flex-1 sm:flex-none inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition border ${ad.status === 'active' ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100' : 'bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed'}`}
                                    >
                                        <i className="fas fa-level-up-alt text-xs" />
                                        Bump
                                    </button>

                                    <div className="w-full sm:w-auto sm:ml-auto">
                                        <button
                                            onClick={() => handleDeleteAd(ad.id)}
                                            className="w-full inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            <i className="fas fa-trash-alt text-xs" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyAdsPage;