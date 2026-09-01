import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { router } from '@inertiajs/react';

// --- Global Constants ---
const PRIMARY_PINK = '#FF69B4';
const LIGHT_BLUE = '#ADD8E6';
const VIP_PINK = '#FF1493';

// --- Types ---
interface Ad {
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
    isSaved?: boolean;
}

interface SavedAdsPageProps {
    ads: Ad[];
    pagination: {
        currentPage: number;
        totalItems: number;
        perPage: number;
        totalPages: number;
    };
}

// --- AdCard Component (Reused from ClassifiedsPage) ---
// Helper function to truncate text
const truncateText = (text: string, maxLength: number = 50): string => {
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
    const isLogo = currentImage.includes('/build/assets/sitelogo.png');

    return (
        <div className="absolute inset-0 w-full h-full">
            {images.map((img, index) => {
                const isImgLogo = img.includes('/build/assets/sitelogo.png');
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

const AdCard = ({ ad, onSaveToggle, isSaved = false }: { ad: Ad; onSaveToggle?: (adId: number, shouldSave: boolean) => void; isSaved?: boolean }) => {
    const isVip = ad.isVip || false;
    const isPremium = ad.isPremium || false;
    const displayImages = ad.images && ad.images.length > 0 ? ad.images : [ad.imgSrc || '/placeholder-image.jpg'];

    const handleSaveClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSaveToggle) {
            onSaveToggle(ad.id, !isSaved);
        }
    };

    const likes = (ad.id * 7) % 15 + 1;
    const views = ((ad.id * 13) % 50 + 10) / 10;

    return (
        <a href={`/ad/${ad.id}`} className="block">
            <div className={`relative bg-white rounded-xl border ${isVip ? 'border-amber-400 vip-gold-animated-border p-[2px]' : isPremium ? 'border-pink-400 premium-pink-animated-border p-[2px]' : 'border-gray-200'} overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer flex flex-row h-[150px] sm:h-[180px]`}>
                
                <div className={`flex flex-row w-full h-full bg-white ${isVip ? 'bg-amber-50 rounded-lg' : isPremium ? 'bg-pink-50 rounded-lg' : ''}`}>
                    {/* Left: Image */}
                    <div className="relative w-[130px] sm:w-[180px] h-full flex-shrink-0">
                        {/* Fake Ad Badge */}
                        <div className="absolute top-0 left-0 z-20 bg-red-600 text-white px-2 py-0.5 text-[10px] sm:text-xs font-bold rounded-br-lg shadow-sm flex items-center">
                            Fake Ad
                        </div>

                        {/* Top Right Badges */}
                        <div className="absolute top-1 right-1 z-20 flex flex-col gap-1">
                            {isVip && (
                                <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md flex items-center justify-center">
                                    <i className="fas fa-crown text-[8px] mr-1"></i> VIP
                                </div>
                            )}
                            {isPremium && !isVip && (
                                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md flex items-center justify-center">
                                    <i className="fas fa-star text-[8px] mr-1"></i> Prem
                                </div>
                            )}
                        </div>

                        <AdImageCarousel
                            images={displayImages}
                            title={ad.title}
                            className="object-cover"
                            isVipOrPremium={isVip || isPremium}
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between overflow-hidden relative">
                        {/* Save Button */}
                        <button
                            onClick={handleSaveClick}
                            className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-sm transition-all border ${isSaved ? 'bg-pink-500 text-white border-pink-600' : 'bg-white text-gray-400 hover:text-pink-500 border-gray-100'}`}
                            title={isSaved ? 'Remove from saved' : 'Save ad'}
                            type="button"
                        >
                            <i className={`${isSaved ? 'fas' : 'far'} fa-heart text-sm`}></i>
                        </button>

                        <div className="pr-8">
                            <h3 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1 line-clamp-2" title={ad.title}>
                                {ad.title} <i className="fas fa-check-circle text-purple-600 ml-1 text-[10px] sm:text-xs" title="Verified"></i>
                            </h3>
                            
                            <p className="text-[11px] sm:text-sm text-gray-600 line-clamp-2 mb-1">
                                {ad.description}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mb-1.5">
                                <span className="flex items-center truncate"><i className="fas fa-map-marker-alt text-pink-500 mr-1"></i>{ad.location}</span>
                            </div>

                            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center space-x-3 text-[10px] sm:text-xs font-semibold text-blue-600">
                                    <span className="flex items-center"><i className="far fa-thumbs-up mr-1 text-blue-500"></i>{likes} Likes</span>
                                    <span className="flex items-center"><i className="far fa-eye mr-1 text-blue-500"></i>{views}K Views</span>
                                </div>
                                <span className="text-[9px] sm:text-[11px] text-gray-400 whitespace-nowrap ml-2">{ad.time || '1d ago'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};


const SavedAdsPage: React.FC<SavedAdsPageProps> = ({ 
    ads = [], 
    pagination = {
        currentPage: 1,
        totalItems: 0,
        perPage: 12,
        totalPages: 1,
    }
}) => {
    // State to keep track of saved ads in the UI immediately without waiting for server reload
    const [savedAdsList, setSavedAdsList] = useState<Ad[]>(ads);

    const handleSaveToggle = useCallback(async (adId: number, shouldSave: boolean) => {
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            if (!csrfToken) return;

            const endpoint = shouldSave ? /ads/ + adId + /save : /ads/ + adId + /unsave;
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (response.ok) {
                // If unsaving on the saved ads page, remove it from the list immediately for snappiness
                if (!shouldSave) {
                    setSavedAdsList(prev => prev.filter(ad => ad.id !== adId));
                }
            }
        } catch (error) {
            console.error('Error toggling save status:', error);
        }
    }, []);

    const handlePaginate = useCallback((pageNumber: number) => {
        router.get('/saved-ads', {
            page: pageNumber,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    return (
        <div className="bg-[#f8f9fc] min-h-screen font-sans flex flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 sm:h-20">
                        {/* Logo */}
                        <a href="/" className="flex items-center">
                            <img src="/build/assets/siteicon.png" alt="Logo" className="h-10 sm:h-12 mr-2" />
                            <img src="/build/assets/sitetxt.png" alt="Text" className="h-6 sm:h-8 hidden sm:block" />
                        </a>
                        
                        {/* Navigation */}
                        <nav className="flex items-center space-x-6">
                            <a href="/" className="text-gray-600 hover:text-pink-600 font-semibold transition-colors flex items-center gap-2">
                                <i className="fas fa-home hidden sm:inline-block"></i> Home
                            </a>
                            <a href="/saved-ads" className="text-pink-600 font-bold border-b-2 border-pink-600 pb-1 flex items-center gap-2">
                                <i className="fas fa-heart hidden sm:inline-block"></i> Saved Ads
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <i className="fas fa-heart text-pink-500"></i> My Saved Ads
                        </h1>
                        <p className="text-gray-600 text-sm mt-1">You have {savedAdsList.length} saved advertisements</p>
                    </div>
                </div>

                {/* Ads List */}
                <div className="flex flex-col gap-4">
                    {savedAdsList.length > 0 ? (
                        savedAdsList.map(ad => (
                            <AdCard 
                                key={ad.id} 
                                ad={ad} 
                                isSaved={true} 
                                onSaveToggle={handleSaveToggle} 
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center mt-4">
                            <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <i className="far fa-heart text-3xl text-pink-300"></i>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No saved ads yet</h3>
                            <p className="text-gray-500 mb-6">Click the heart icon on any ad to save it for later.</p>
                            <a href="/" className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-colors">
                                Browse Ads
                            </a>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <nav className="flex space-x-2">
                            <button
                                onClick={() => handlePaginate(pagination.currentPage - 1)}
                                disabled={pagination.currentPage === 1}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="px-4 py-2 bg-pink-500 text-white rounded-lg font-semibold shadow-sm">
                                {pagination.currentPage}
                            </span>
                            <button
                                onClick={() => handlePaginate(pagination.currentPage + 1)}
                                disabled={pagination.currentPage === pagination.totalPages}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </nav>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SavedAdsPage;

