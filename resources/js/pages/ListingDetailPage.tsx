import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { router } from '@inertiajs/react';

// --- Global Constants ---
const PRIMARY_PINK = '#FF69B4';
const LIGHT_BLUE = '#ADD8E6';
const VIP_PINK = '#FF1493';
const YELLOW_STAR = '#FACC15';

// --- Types ---
interface AdImage {
    id: number;
    path: string;
}

interface Ad {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    location: string;
    time: string;
    images: string[];
    isVip: boolean;
    isPremium: boolean;
    hasCashBackGuarantee: boolean;
    isSaved: boolean;
    phone_number: string | null;
    whatsapp_number: string | null;
    telegram_number: string | null;
}

interface RelatedAd {
    id: number;
    title: string;
    price: number;
    description: string;
    category: string;
    location: string;
    time: string;
    imgSrc: string | null;
    images?: string[];
    isVip: boolean;
    isPremium: boolean;
    hasCashBackGuarantee: boolean;
}

interface ListingDetailPageProps {
    ad: Ad;
    relatedAds: RelatedAd[];
}

// --- AdCard Component for Related Ads ---
// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 40): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
};

const AdImageCarousel = ({ images, title, className, isVipOrPremium }: { images: string[]; title: string; className: string; isVipOrPremium: boolean }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [images.length]);

    const currentImage = images[currentIndex] || '/placeholder-image.jpg';

    // Check if the current image is the site logo for special styling
    const isLogo = currentImage.includes('/assets/sitelogo.png');

    return (
        <div className="absolute inset-0 w-full h-full">
            {images.map((img, index) => {
                const isImgLogo = img.includes('/assets/sitelogo.png');
                return (
                    <img
                        key={index}
                        src={img}
                        alt={`${title} - Image ${index + 1}`}
                        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out ${className} ${isImgLogo
                            ? 'object-contain bg-gray-100'
                            : 'object-cover'
                            } ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                        onError={(e) => {
                            e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                    />
                );
            })}
        </div>
    );
};

const RelatedAdCard = ({ ad }: { ad: RelatedAd }) => {
    const isVip = ad.isVip || false;
    const isPremium = ad.isPremium || false;
    const hasCashBackGuarantee = ad.hasCashBackGuarantee || false;

    // Use images array if available and not empty, otherwise fallback to imgSrc wrapped in array
    const displayImages = ad.images && ad.images.length > 0 ? ad.images : [ad.imgSrc || '/placeholder-image.jpg'];

    return (
        <a href={`/ad/${ad.id}`} className="block">
            {isVip ? (
                <div className="relative rounded-xl p-[2px] vip-gold-animated-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative rounded-xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 overflow-hidden h-full" style={{ zIndex: 10 }}>
                        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <i className="fas fa-crown text-xs"></i>
                            <span>VIP</span>
                        </div>
                        {hasCashBackGuarantee && (
                            <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                <i className="fas fa-shield-alt text-xs"></i>
                            </div>
                        )}
                        <div className="relative h-32 w-full">
                            <AdImageCarousel
                                images={displayImages}
                                title={ad.title}
                                className=""
                                isVipOrPremium={true}
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2" title={ad.title}>
                                {truncateText(ad.title, 40)}
                            </h3>
                            <p className="text-lg font-bold text-amber-600">Rs {ad.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ) : isPremium ? (
                <div className="relative rounded-xl p-[2px] premium-pink-animated-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative rounded-xl bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 overflow-hidden h-full" style={{ zIndex: 10 }}>
                        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <i className="fas fa-star text-xs"></i>
                            <span>Premium</span>
                        </div>
                        {hasCashBackGuarantee && (
                            <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                                <i className="fas fa-shield-alt text-xs"></i>
                            </div>
                        )}
                        <div className="relative h-32 w-full">
                            <AdImageCarousel
                                images={displayImages}
                                title={ad.title}
                                className=""
                                isVipOrPremium={true}
                            />
                        </div>
                        <div className="p-3">
                            <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2" title={ad.title}>
                                {truncateText(ad.title, 40)}
                            </h3>
                            <p className="text-lg font-bold" style={{ color: VIP_PINK }}>Rs {ad.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    {hasCashBackGuarantee && (
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <i className="fas fa-shield-alt text-xs"></i>
                        </div>
                    )}
                    <div className="relative h-32 w-full">
                        <AdImageCarousel
                            images={displayImages}
                            title={ad.title}
                            className="object-cover"
                            isVipOrPremium={false}
                        />
                    </div>
                    <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{ad.title}</h3>
                        <p className="text-lg font-bold" style={{ color: PRIMARY_PINK }}>Rs {ad.price.toLocaleString()}</p>
                    </div>
                </div>
            )}
        </a>
    );
};

const ListingDetailPage: React.FC<ListingDetailPageProps> = ({ ad, relatedAds = [] }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSaved, setIsSaved] = useState(ad.isSaved || false);
    const [isLiked, setIsLiked] = useState(() => {
        const likedAds = JSON.parse(localStorage.getItem('liked_ads') || '[]');
        return likedAds.includes(ad.id);
    });
    const [likesCount, setLikesCount] = useState(ad.likes || 0);
    const [savedAds, setSavedAds] = useState<number[]>(isSaved ? [ad.id] : []);
    const [isDisclaimerExpanded, setIsDisclaimerExpanded] = useState(false);
    const [showAgeVerification, setShowAgeVerification] = useState(false);
    const [isAdult, setIsAdult] = useState<boolean | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Check age verification on mount
    useEffect(() => {
        const ageVerified = localStorage.getItem('ageVerified');
        if (ageVerified === null) {
            setShowAgeVerification(true);
        } else {
            setIsAdult(ageVerified === 'true');
        }
    }, []);

    // Handle age verification
    const handleAgeVerification = (is18OrOlder: boolean) => {
        setIsAdult(is18OrOlder);
        localStorage.setItem('ageVerified', is18OrOlder.toString());
        setShowAgeVerification(false);

        // If user is under 18 and viewing a Spa ad, redirect
        if (!is18OrOlder && ad.category === 'Spa') {
            router.visit('/');
        }
    };

    // Filter related ads based on age
    const filteredRelatedAds = useMemo(() => {
        if (isAdult === false) {
            return relatedAds.filter(relatedAd => relatedAd.category !== 'Spa');
        }
        return relatedAds;
    }, [relatedAds, isAdult]);

    // Redirect if user is under 18 and viewing Spa ad
    useEffect(() => {
        if (isAdult === false && ad.category === 'Spa') {
            router.visit('/');
        }
    }, [isAdult, ad.category]);

    const totalImages = ad.images.length;
    const hasVipAds = ad.isVip;
    const hasPremiumAds = ad.isPremium;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    const selectThumbnail = (index: number) => {
        setCurrentImageIndex(index);
    };

    const handleLike = async () => {
        if (isLiked) return; // Prevent multiple likes

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) return;

            const response = await fetch(`/ads/${ad.id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            const data = await response.json();
            if (data.success) {
                setIsLiked(true);
                setLikesCount(data.likes);
                const likedAds = JSON.parse(localStorage.getItem('liked_ads') || '[]');
                localStorage.setItem('liked_ads', JSON.stringify([...likedAds, ad.id]));
            }
        } catch (error) {
            console.error('Error liking ad:', error);
        }
    };

    const handleSaveToggle = useCallback(async (adId: number, shouldSave: boolean) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) {
                console.error('CSRF token not found');
                return;
            }

            const endpoint = shouldSave ? `/ads/${adId}/save` : `/ads/${adId}/unsave`;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });

            if (response.ok) {
                setIsSaved(shouldSave);
                if (shouldSave) {
                    setSavedAds(prev => [...prev, adId]);
                } else {
                    setSavedAds(prev => prev.filter(id => id !== adId));
                }
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error saving ad:', errorData);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    }, []);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: ad.title,
                text: ad.description,
                url: window.location.href,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* Age Verification Modal */}
            {showAgeVerification && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
                        <div className="mb-6">
                            <i className="fas fa-shield-alt text-6xl text-yellow-500 mb-4"></i>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Verification</h2>
                            <p className="text-gray-600">Are you 18 years or older?</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => handleAgeVerification(true)}
                                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                Yes, I'm 18+
                            </button>
                            <button
                                onClick={() => handleAgeVerification(false)}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                            >
                                No, I'm under 18
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            You must be 18 or older to view certain content.
                        </p>
                    </div>
                </div>
            )}

            {/* Full Screen Image Viewer */}
            {isFullScreen && (
                <div className="fixed inset-0 z-[100] bg-black bg-opacity-95 flex items-center justify-center p-4">
                    <button
                        onClick={() => setIsFullScreen(false)}
                        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition-colors z-[110]"
                    >
                        <i className="fas fa-times text-3xl"></i>
                    </button>

                    {totalImages > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-white p-4 hover:bg-white/10 rounded-full transition-colors z-[110]"
                            >
                                <i className="fas fa-chevron-left text-4xl"></i>
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white p-4 hover:bg-white/10 rounded-full transition-colors z-[110]"
                            >
                                <i className="fas fa-chevron-right text-4xl"></i>
                            </button>
                        </>
                    )}

                    <img
                        src={ad.images[currentImageIndex] || '/placeholder-image.jpg'}
                        className="max-h-full max-w-full object-contain"
                        alt={ad.title}
                    />

                    <div className="absolute bottom-4 text-white bg-black/50 px-4 py-2 rounded-full">
                        {currentImageIndex + 1} / {totalImages}
                    </div>
                </div>
            )}

            {/* VIP and Premium Border Animation Styles */}
            {(hasVipAds || hasPremiumAds) && (
                <style>{`
                    @keyframes vipGoldBorderAnimation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes premiumPinkBorderAnimation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    @keyframes shine {
                        0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
                        100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
                    }
                    .vip-gold-animated-border {
                        position: relative;
                        background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
                        background-size: 200% 100%;
                        animation: vipGoldBorderAnimation 3s ease infinite;
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.6), 0 0 40px rgba(245, 158, 11, 0.4);
                        overflow: hidden;
                    }
                    .vip-gold-animated-border::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.9) 50%, transparent 60%);
                        background-size: 300% 300%;
                        animation: shine 2.5s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 1;
                        border-radius: inherit;
                    }
                    .premium-pink-animated-border {
                        position: relative;
                        background: linear-gradient(90deg, #f472b6, #ec4899, #d946ef, #f472b6);
                        background-size: 200% 100%;
                        animation: premiumPinkBorderAnimation 3s ease infinite;
                        box-shadow: 0 0 20px rgba(244, 114, 182, 0.6), 0 0 40px rgba(236, 72, 153, 0.4);
                        overflow: hidden;
                    }
                    .premium-pink-animated-border::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(45deg, transparent 40%, rgba(255, 255, 255, 0.95) 50%, transparent 60%);
                        background-size: 300% 300%;
                        animation: shine 2.5s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 1;
                        border-radius: inherit;
                    }
                `}</style>
            )}

            {/* Header */}
            <header className="bg-white shadow-sm border-b sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.visit('/')}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                            >
                                <i className="fas fa-arrow-left"></i>
                            </button>
                            <h1 className="ml-3 text-lg font-semibold text-gray-900">Back to Listings</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => handleSaveToggle(ad.id, !isSaved)}
                                className={`p-2 rounded-md transition-colors ${isSaved
                                    ? 'text-pink-500 hover:text-pink-600'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                title={isSaved ? 'Remove from saved' : 'Save ad'}
                            >
                                <i className={`${isSaved ? 'fas' : 'far'} fa-heart text-xl`}></i>
                            </button>
                            <button
                                onClick={handleShare}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                title="Share"
                            >
                                <i className="fas fa-share-alt text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Image Gallery & Details */}
                    <div className="lg:col-span-2">
                        {/* VIP/Premium Badge */}
                        {(ad.isVip || ad.isPremium) && (
                            <div className={`mb-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${ad.isVip
                                ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white'
                                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white'
                                }`}>
                                <i className={`fas ${ad.isVip ? 'fa-crown' : 'fa-star'} mr-2`}></i>
                                <span>{ad.isVip ? 'VIP' : 'Premium'}</span>
                            </div>
                        )}

                        {/* Image Carousel */}
                        <div className={`relative bg-white rounded-lg shadow-sm overflow-hidden mb-6 ${ad.isVip ? 'p-[4px] vip-gold-animated-border' :
                            ad.isPremium ? 'p-[4px] premium-pink-animated-border' : ''
                            }`}>
                            <div className={`${ad.isVip || ad.isPremium ? 'rounded-lg overflow-hidden' : ''}`}>
                                <img
                                    src={ad.images[currentImageIndex] || '/placeholder-image.jpg'}
                                    alt={ad.title}
                                    onClick={() => setIsFullScreen(true)}
                                    className={`w-full h-[500px] cursor-pointer ${ad.images[currentImageIndex]?.includes('/assets/sitelogo.png') || !ad.images[currentImageIndex]
                                        ? 'object-contain bg-gray-100'
                                        : 'object-cover'
                                        }`}
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder-image.jpg';
                                    }}
                                />
                            </div>
                            {totalImages > 1 && (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                                        <button
                                            onClick={prevImage}
                                            className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors pointer-events-auto"
                                        >
                                            <i className="fas fa-chevron-left text-gray-800"></i>
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors pointer-events-auto"
                                        >
                                            <i className="fas fa-chevron-right text-gray-800"></i>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                        <div className="flex space-x-2">
                                            {ad.images.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                        }`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {totalImages}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {totalImages > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                                {ad.images.map((src, index) => (
                                    <div
                                        key={index}
                                        onClick={() => selectThumbnail(index)}
                                        className={`aspect-w-4 aspect-h-3 bg-white rounded-lg overflow-hidden shadow-sm border-2 cursor-pointer transition-colors ${index === currentImageIndex
                                            ? 'border-pink-500'
                                            : 'border-transparent hover:border-gray-300'
                                            }`}
                                    >
                                        <img
                                            src={src || '/placeholder-image.jpg'}
                                            alt={`${ad.title} ${index + 1}`}
                                            className={`w-full h-[80px] ${src?.includes('/assets/sitelogo.png') || !src
                                                ? 'object-contain bg-gray-100'
                                                : 'object-cover'
                                                }`}
                                            onError={(e) => {
                                                e.currentTarget.src = '/placeholder-image.jpg';
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Bar */}
                        <div className="bg-gray-900 text-white flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 rounded-b-lg mb-6 shadow-md gap-3 sm:gap-0">
                            <div className="flex items-center justify-around w-full sm:w-auto sm:justify-start sm:space-x-6 px-2 sm:px-4 border-b border-gray-700 sm:border-0 pb-3 sm:pb-0">
                                <button onClick={handleLike} className={`flex items-center space-x-1.5 sm:space-x-2 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-400'}`}>
                                    <i className={`${isLiked ? 'fas' : 'far'} fa-thumbs-up text-base sm:text-lg`}></i>
                                    <span className="font-semibold text-xs sm:text-sm">{isLiked ? 'Liked' : 'Like'}</span>
                                </button>
                                <button onClick={() => handleSaveToggle(ad.id, !isSaved)} className={`flex items-center space-x-1.5 sm:space-x-2 transition-colors ${isSaved ? 'text-pink-500' : 'hover:text-pink-400'}`}>
                                    <i className={`${isSaved ? 'fas' : 'far'} fa-heart text-base sm:text-lg`}></i>
                                    <span className="font-semibold text-xs sm:text-sm">{isSaved ? 'Saved' : 'Save'}</span>
                                </button>
                                <button onClick={handleShare} className="flex items-center space-x-1.5 sm:space-x-2 hover:text-pink-400 transition-colors">
                                    <i className="fas fa-share-alt text-base sm:text-lg"></i>
                                    <span className="font-semibold text-xs sm:text-sm">Share</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-center space-x-4 sm:pr-4 text-[11px] sm:text-sm text-gray-300 w-full sm:w-auto">
                                <span className="flex items-center"><i className="far fa-eye mr-1.5"></i> {ad.views || 0} Views</span>
                                <span className="flex items-center"><i className="far fa-thumbs-up mr-1.5"></i> {likesCount} Likes</span>
                            </div>
                        </div>

                        {/* Ad Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                {ad.description || 'No description available.'}
                            </div>

                            {/* Specifications */}
                            <div className="mt-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Details</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-sm text-gray-500 mb-1">Category</div>
                                        <div className="font-semibold text-gray-900">{ad.category}</div>
                                    </div>
                                    {ad.isVip && (
                                        <div className="bg-amber-50 p-4 rounded-lg">
                                            <div className="text-sm text-amber-600 mb-1">Type</div>
                                            <div className="font-semibold text-amber-700">VIP</div>
                                        </div>
                                    )}
                                    {ad.isPremium && (
                                        <div className="bg-pink-50 p-4 rounded-lg">
                                            <div className="text-sm text-pink-600 mb-1">Type</div>
                                            <div className="font-semibold text-pink-700">Premium</div>
                                        </div>
                                    )}
                                    {ad.hasCashBackGuarantee && (
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-sm text-green-600 mb-1">Guarantee</div>
                                            <div className="font-semibold text-green-700">Cash Back</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Location</h3>
                            <div className="bg-gray-200 rounded-lg h-[300px] flex items-center justify-center">
                                <div className="text-center">
                                    <i className="fas fa-map-marker-alt text-4xl text-gray-400 mb-2"></i>
                                    <p className="text-gray-600 font-semibold">{ad.location}</p>
                                    <p className="text-sm text-gray-500 mt-1">Approximate location for privacy</p>
                                </div>
                            </div>
                        </div>

                        {/* Related Ads */}
                        {filteredRelatedAds.length > 0 && (
                            <div className="mt-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Ads</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {filteredRelatedAds.map((relatedAd) => (
                                        <RelatedAdCard key={relatedAd.id} ad={relatedAd} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Details & Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {/* Title & Price */}
                            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{ad.title}</h1>
                                    <div className="text-purple-600 text-sm mt-1" title="Verified Ad">
                                        <i className="fas fa-check-circle"></i>
                                    </div>
                                </div>
                                
                                <div className="flex items-center text-xs font-medium text-gray-500 mb-4 space-x-4">
                                    <span className="flex items-center text-blue-600"><i className="far fa-thumbs-up mr-1 text-blue-500"></i> {likesCount} Likes</span>
                                    <span><i className="far fa-clock mr-1"></i> {ad.time}</span>
                                </div>

                                <div className="text-3xl sm:text-4xl font-black mb-6 text-pink-600 tracking-tight">
                                    Rs {ad.price.toLocaleString()}
                                </div>

                                {/* Main Action Buttons */}
                                <div className="space-y-3">
                                    {ad.phone_number ? (
                                        <a href={`tel:${ad.phone_number}`} className="w-full bg-[#E50914] hover:bg-red-700 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md">
                                            <i className="fas fa-phone-alt"></i>
                                            CALL NOW
                                        </a>
                                    ) : (
                                        <a href="tel:0700000000" className="w-full bg-[#E50914] hover:bg-red-700 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md">
                                            <i className="fas fa-phone-alt"></i>
                                            CALL NOW
                                        </a>
                                    )}

                                    {ad.whatsapp_number ? (
                                        <a href={`https://wa.me/${ad.whatsapp_number.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-green-600 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md">
                                            <i className="fab fa-whatsapp text-xl"></i>
                                            WHATSAPP
                                        </a>
                                    ) : (
                                        <a href="https://wa.me/94700000000" target="_blank" rel="noopener noreferrer" className="w-full bg-[#25D366] hover:bg-green-600 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md">
                                            <i className="fab fa-whatsapp text-xl"></i>
                                            WHATSAPP
                                        </a>
                                    )}
                                </div>
                            </div>
                            
                            {/* Safety Tips Sidebar Card */}
                            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 shadow-sm mb-6">
                                <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                    <i className="fas fa-shield-alt text-blue-600"></i> Safety Tips
                                </h4>
                                <ul className="text-sm text-blue-800 space-y-2">
                                    <li className="flex items-start gap-2"><i className="fas fa-check text-green-600 mt-1"></i> Meet in a safe, public location.</li>
                                    <li className="flex items-start gap-2"><i className="fas fa-check text-green-600 mt-1"></i> Never pay in advance.</li>
                                    <li className="flex items-start gap-2"><i className="fas fa-check text-green-600 mt-1"></i> Verify the service/item before paying.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer Note Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
                <div className="bg-blue-50 border-l-4 border-blue-400 rounded-lg shadow-sm overflow-hidden">
                    {/* Collapsible Header */}
                    <button
                        onClick={() => setIsDisclaimerExpanded(!isDisclaimerExpanded)}
                        className="w-full flex items-center justify-between p-6 sm:p-8 hover:bg-blue-100 transition-colors text-left"
                    >
                        <div className="flex items-center">
                            <i className="fas fa-info-circle text-blue-600 text-2xl mr-3 flex-shrink-0"></i>
                            <h3 className="text-xl font-bold text-gray-900">Important Notice / වැදගත් දැනුම්දීම</h3>
                        </div>
                        <i
                            className={`fas fa-chevron-down text-blue-600 text-xl transition-transform duration-300 ${isDisclaimerExpanded ? 'transform rotate-180' : ''
                                }`}
                        ></i>
                    </button>

                    {/* Collapsible Content */}
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isDisclaimerExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}>
                        <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                            {/* Report Fake Ads Note - Sinhala */}
                            <div className="bg-red-50 border-l-4 border-red-400 rounded-lg p-4 mb-6">
                                <div className="flex items-start">
                                    <i className="fas fa-exclamation-triangle text-red-600 text-xl mr-3 flex-shrink-0 mt-0.5"></i>
                                    <div>
                                        <h4 className="text-lg font-semibold text-red-800 mb-2">ව්‍යාජ දැන්වීම් වාර්තා කරන්න</h4>
                                        <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            සැක සහිත හෝ ව්‍යාජ දැන්වීම් හමු වුවහොත්, කරුණාකර WhatsApp හරහා අපට දැනුම් දෙන්න. අපි ව්‍යාජ දැන්වීම් ගැන බැරෑරුමින් සලකන අතර වහාම පරීක්ෂා කරන්නෙමු.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sinhala Section */}
                            <div className="mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">සිංහල (Sinhala)</h4>
                                <div className="space-y-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                                    <p>
                                        <strong>Tin Tin ads</strong> යනු නිදහස් දැන්වීම් පළ කිරීම සඳහා වූ වේදිකාවක් පමණි. අපි දැන්වීම් පළ කරන්නාට සහ සේවා ලබා ගන්නා පාර්ශවයට හමුවීමට මෙන්ම තොරතුරු හුවමාරු කර ගැනීමට ඉඩ සලසන මාධ්‍යයක් ලෙස පමණක් ක්‍රියා කරන්නෙමු.
                                    </p>

                                    <p>
                                        <strong>වගකීම් සීමාව:</strong> Tin Tin ads වෙබ් අඩවියේ පළ කරන ලද කිසිදු දැන්වීමක අන්තර්ගතය, සත්‍යතාව, හෝ ගුණාත්මකභාවය පිළිබඳව අප වග කියනු නොලැබේ.
                                    </p>

                                    <p>
                                        <strong>ගනුදෙනු:</strong> දැන්වීම් පළ කරන්නන් සමඟ ඔබ විසින් සිදු කරනු ලබන ඕනෑම ගනුදෙනුවක්, මුදල් හුවමාරුවක්, හෝ සේවා ලබා ගැනීමක් පිළිබඳව Tin Tin ads කිසිදු වගකීමක් නොදරයි. ඔබගේ ගනුදෙනු සම්පූර්ණයෙන්ම ඔබගේ පෞද්ගලික අවදානම මත සිදු කළ යුතුය.
                                    </p>

                                    <p>
                                        <strong>මුදල් ගෙවීම:</strong> ඔබ යම් සේවාවක් ලබා ගැනීමට අපේක්ෂා කරන්නේ නම්, කිසිවිටෙකත් සේවා සපයන්නා හමු වීමට පෙර මුදල් ගෙවීමෙන් වළකින්න. සේවාව ලබා ගත් හෝ සපයන්නා හමු වූ පසුව පමණක් ගෙවීම් කරන්න.
                                    </p>

                                    <p>
                                        <strong>සත්‍යාපිත දැන්වීම් (Verified Ads):</strong> "සත්‍යාපිත" (Verified) ලෙස ලේබල් කර ඇති දැන්වීම් යනු අපගේ නියෝජිතයන් විසින් සේවා සපයන්නාගේ අනන්‍යතාවය හෝ සේවාවේ යම් කොටසක් තහවුරු කිරීමට උත්සාහ කර ඇති ඒවා විය හැකිය. කෙසේ වෙතත්, මෙම සත්‍යාපනය පවා එම සේවාවේ සම්පූර්ණ ගුණාත්මකභාවය හෝ ආරක්ෂාව සහතික නොකරයි. ඕනෑම ගනුදෙනුවක් සිදු කිරීමට පෙර ඔබගේම විමර්ශන කටයුතු (Due Diligence) සිදු කිරීම අත්‍යවශ්‍ය වේ.
                                    </p>

                                    <p className="font-semibold text-gray-900">
                                        ඔබ ගනුදෙනු කිරීමේදී සැලකිලිමත් වන්න. වංචනික ක්‍රියා හෝ නීති විරෝධී ක්‍රියාකාරකම් පිළිබඳව සැකයක් ඇත්නම්, වහාම අපට හෝ අදාළ නීති බලධාරීන්ට දැනුම් දෙන්න.
                                    </p>
                                </div>
                            </div>

                            {/* English Section */}
                            <div className="border-t border-blue-300 pt-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-3">English (ඉංග්‍රීසි)</h4>
                                <div className="space-y-3 text-sm sm:text-base text-gray-700 leading-relaxed">
                                    <p>
                                        <strong>Tin Tin ads</strong> is strictly an online platform for publishing free classified advertisements. We act only as a medium that allows the advertiser and the service seeker to meet and exchange information.
                                    </p>

                                    <p>
                                        <strong>Limitation of Liability:</strong> We are not responsible for the content, authenticity, or quality of any advertisement published on the Tin Tin ads website.
                                    </p>

                                    <p>
                                        <strong>Transactions:</strong> Tin Tin ads holds no responsibility for any transaction, monetary exchange, or service received that you engage in with advertisers. All your transactions are conducted entirely at your own risk.
                                    </p>

                                    <p>
                                        <strong>Payment Advice:</strong> If you intend to obtain a service, NEVER deposit or transfer money before meeting the service provider. Make payments only after you have met the provider or received the service.
                                    </p>

                                    <p>
                                        <strong>Verified Ads:</strong> Advertisements labeled as "Verified" may indicate that our agents have attempted to confirm the service provider's identity or certain aspects of their service. However, this verification does not guarantee the complete quality or safety of that service. It is essential to perform your own due diligence before proceeding with any transaction.
                                    </p>

                                    <p className="font-semibold text-gray-900">
                                        Please exercise caution when transacting. If you suspect any fraudulent or illegal activity, report it immediately to us or the relevant legal authorities.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer className="bg-white border-t border-gray-200 mt-12 py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                        {/* WhatsApp Contact */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 text-white">
                                <i className="fab fa-whatsapp text-lg sm:text-xl"></i>
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Report Fake Ads</p>
                                <a
                                    href="https://wa.me/94716161613"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm sm:text-base font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
                                >
                                    +94 71 616 1613
                                    <i className="fas fa-external-link-alt text-xs"></i>
                                </a>
                            </div>
                        </div>

                        {/* Note about Fake Ads */}
                        <div className="flex items-start gap-2 sm:gap-3 bg-blue-50 border border-yellow-200 rounded-lg p-3 sm:p-4 max-w-md">
                            <i className="fas fa-exclamation-triangle text-blue-600 text-lg sm:text-xl flex-shrink-0 mt-0.5"></i>
                            <p className="text-xs sm:text-sm text-gray-700">
                                <span className="font-semibold text-gray-900">Report Fake Ads:</span> If you encounter any suspicious or fake advertisements, please contact us via WhatsApp. We take fake ads seriously and will investigate promptly.
                            </p>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                        <p className="text-xs sm:text-sm text-gray-500">
                            © {new Date().getFullYear()} ClassifiedHub. All rights reserved. |
                            <span className="ml-1">Stay safe and verify before you buy.</span>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default ListingDetailPage;

