import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { router, Head, usePage } from '@inertiajs/react';
import Select from 'react-select';
import Footer from '../Components/Footer';

// NOTE on Logo Path:
// The logo is referenced using the absolute public path: "/assets/sitelogo.png"
// This assumes your build process correctly places sitelogo.png inside the final build/assets directory.

// --- Global Constants ---
const PRIMARY_PINK = '#FF69B4';
const LIGHT_BLUE = '#ADD8E6';
const VIP_PINK = '#FF1493';
const VIP_PINK_LIGHT = '#FFB6C1';
const VIP_PINK_DARK = '#C71585';

// Colorful category colors
const CATEGORY_COLORS = [
    { bg: '#3B82F6', icon: '#1E40AF', name: 'Blue' },      // Blue
    { bg: '#10B981', icon: '#059669', name: 'Green' },     // Green
    { bg: '#F59E0B', icon: '#D97706', name: 'Amber' },    // Amber/Orange
    { bg: '#EF4444', icon: '#DC2626', name: 'Red' },      // Red
    { bg: '#8B5CF6', icon: '#7C3AED', name: 'Purple' },   // Purple
    { bg: '#EC4899', icon: '#DB2777', name: 'Pink' },     // Pink
    { bg: '#06B6D4', icon: '#0891B2', name: 'Cyan' },     // Cyan
    { bg: '#F97316', icon: '#EA580C', name: 'Orange' },   // Orange
];


const locationOptions = [
    { value: 'All Sri Lanka', label: 'All Sri Lanka' },
    { value: 'Colombo', label: 'Colombo' },
    { value: 'Gampaha', label: 'Gampaha' },
    { value: 'Kandy', label: 'Kandy' },
    { value: 'Galle', label: 'Galle' },
    { value: 'Kurunegala', label: 'Kurunegala' },
    { value: 'Kalutara', label: 'Kalutara' },
    { value: 'Matara', label: 'Matara' },
    { value: 'Anuradhapura', label: 'Anuradhapura' },
    { value: 'Ratnapura', label: 'Ratnapura' },
    { value: 'Kegalle', label: 'Kegalle' },
    { value: 'Badulla', label: 'Badulla' },
    { value: 'Puttalam', label: 'Puttalam' },
    { value: 'Ampara', label: 'Ampara' },
    { value: 'Batticaloa', label: 'Batticaloa' },
    { value: 'Hambantota', label: 'Hambantota' },
    { value: 'Jaffna', label: 'Jaffna' },
    { value: 'Matale', label: 'Matale' },
    { value: 'Nuwara Eliya', label: 'Nuwara Eliya' },
    { value: 'Polonnaruwa', label: 'Polonnaruwa' },
    { value: 'Trincomalee', label: 'Trincomalee' },
    { value: 'Monaragala', label: 'Monaragala' },
    { value: 'Vavuniya', label: 'Vavuniya' },
    { value: 'Mannar', label: 'Mannar' },
    { value: 'Kilinochchi', label: 'Kilinochchi' },
    { value: 'Mullaitivu', label: 'Mullaitivu' }
];

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
    views?: number;
    likes?: number;
    isVip: boolean;
    isPremium: boolean;
    isPlatinum?: boolean;
    hasCashBackGuarantee: boolean;
    isSaved?: boolean;
    phone_number?: string | null;
    whatsapp_number?: string | null;
}

interface RecentlyViewedAd {
    id: number;
    title: string;
    price: number;
    location: string;
    imgSrc: string;
    isVip?: boolean;
    isPremium?: boolean;
    isPlatinum?: boolean;
}

interface TopCategory {
    name: string;
    icon: string;
}

interface ClassifiedsPageProps {
    ads: Ad[];
    categories: string[];
    topCategories: TopCategory[];
    pagination: {
        currentPage: number;
        totalItems: number;
        perPage: number;
        totalPages: number;
    };
    selectedCategory: string;
    searchTerm?: string;
    savedAdIds?: number[];
}


// --- Sub-Components ---

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

const AdCard = ({ ad, onSaveToggle, isSaved = false }: { ad: Ad; onSaveToggle?: (adId: number, shouldSave: boolean) => void; isSaved?: boolean }) => {
    const isVip = ad.isVip || false;
    const isPremium = ad.isPremium || false;
    const isPlatinum = ad.isPlatinum || false;
    const displayImages = ad.images && ad.images.length > 0 ? ad.images : [ad.imgSrc || '/placeholder-image.jpg'];

    const handleSaveClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSaveToggle) {
            onSaveToggle(ad.id, !isSaved);
        }
    };

    const handleQuickCall = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const phone = ad.phone_number || '0700000000';
        window.location.href = `tel:${phone}`;
    };

    const handleQuickWhatsApp = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const rawNumber = (ad.whatsapp_number || ad.phone_number || '94700000000').replace(/[^0-9]/g, '');
        const cleanNumber = rawNumber.startsWith('0') ? '94' + rawNumber.slice(1) : rawNumber;
        const text = encodeURIComponent(`Hi, I saw your ad on TinTinAds.com: ${ad.title}`);
        window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank', 'noopener,noreferrer');
    };

    const likes = ad.likes || 0;
    const views = ad.views || 0;

    return (
        <a href={`/ad/${ad.id}`} className="block group">
            <div className={`relative bg-white rounded-xl border ${isPlatinum ? 'border-slate-400 platinum-silver-animated-border p-[2px]' : isVip ? 'border-amber-400 vip-gold-animated-border p-[2px]' : isPremium ? 'border-pink-400 premium-pink-animated-border p-[2px]' : 'border-gray-200'} overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-row h-[162px] sm:h-[188px]`}>
                
                <div className={`flex flex-row w-full h-full bg-white ${isPlatinum ? 'bg-slate-50 rounded-lg' : isVip ? 'bg-amber-50 rounded-lg' : isPremium ? 'bg-pink-50 rounded-lg' : ''}`}>
                    {/* Left: Image */}
                    <div className="relative w-[128px] sm:w-[180px] h-full flex-shrink-0 overflow-hidden">
                        {/* Top Left: Online Today Badge */}
                        <div className="absolute top-1.5 left-1.5 z-20 bg-black/75 backdrop-blur-xs text-white px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold shadow-md flex items-center gap-1 border border-emerald-400/40">
                            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-emerald-500"></span>
                            </span>
                            <span>Online Today</span>
                        </div>

                        {/* Top Right Badges */}
                        <div className="absolute top-1.5 right-1.5 z-20 flex flex-col gap-1">
                            {isPlatinum && (
                                <div className="bg-gradient-to-r from-slate-400 to-slate-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md flex items-center justify-center">
                                    <i className="fas fa-gem text-[8px] mr-1"></i> Plat
                                </div>
                            )}
                            {isVip && !isPlatinum && (
                                <div className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md flex items-center justify-center">
                                    <i className="fas fa-crown text-[8px] mr-1"></i> VIP
                                </div>
                            )}
                            {isPremium && !isVip && !isPlatinum && (
                                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-1.5 py-0.5 rounded text-[10px] font-bold shadow-md flex items-center justify-center">
                                    <i className="fas fa-star text-[8px] mr-1"></i> Prem
                                </div>
                            )}
                        </div>

                        {/* Bottom Left: Photo Counter Badge */}
                        <div className="absolute bottom-1.5 left-1.5 z-20 bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded-md text-[8px] sm:text-[10px] font-bold flex items-center gap-1 shadow-xs border border-white/15">
                            <i className="fas fa-camera text-[8px] sm:text-[9px] text-pink-400"></i>
                            <span>{displayImages.length} {displayImages.length === 1 ? 'Photo' : 'Photos'}</span>
                        </div>

                        {/* Bottom Right: Voice Note Badge */}
                        <div className="absolute bottom-1.5 right-1.5 z-20 bg-emerald-600/95 backdrop-blur-xs text-white px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black flex items-center gap-1 shadow-xs border border-emerald-400/40" title="හඬ පටයක් සහිතයි (Voice Note Available)">
                            <i className="fas fa-microphone-alt text-[8px] sm:text-[9px] text-emerald-200"></i>
                            <span>Voice</span>
                        </div>

                        <AdImageCarousel
                            images={displayImages}
                            title={ad.title}
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            isVipOrPremium={isVip || isPremium || isPlatinum}
                        />
                    </div>

                    {/* Right: Content */}
                    <div className="p-2 sm:p-3 flex-1 flex flex-col justify-between overflow-hidden relative min-w-0">
                        {/* Save Button */}
                        <button
                            onClick={handleSaveClick}
                            className={`absolute top-2 right-2 z-20 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full shadow-sm transition-all border ${isSaved ? 'bg-pink-500 text-white border-pink-600' : 'bg-white text-gray-400 hover:text-pink-500 border-gray-100'}`}
                            title={isSaved ? 'Remove from saved' : 'Save ad'}
                            type="button"
                        >
                            <i className={`${isSaved ? 'fas' : 'far'} fa-heart text-xs sm:text-sm`}></i>
                        </button>

                        <div className="pr-7 sm:pr-8">
                            <h3 className="font-bold text-gray-900 text-xs sm:text-base leading-tight mb-1 line-clamp-2" title={ad.title}>
                                {ad.title} <i className="fas fa-check-circle text-purple-600 ml-1 text-[10px] sm:text-xs" title="Verified"></i>
                            </h3>
                            
                            <p className="text-[11px] sm:text-sm text-gray-600 line-clamp-2 mb-1">
                                {ad.description}
                            </p>
                        </div>

                        <div className="mt-auto">
                            <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 mb-1.5 gap-2">
                                <span className="flex items-center text-gray-700 font-semibold truncate">
                                    <i className="fas fa-map-marker-alt text-pink-500 mr-1 flex-shrink-0"></i>
                                    <span className="truncate">{ad.location}</span>
                                </span>
                                <span className="text-[11px] sm:text-xs font-black text-pink-600 flex-shrink-0">
                                    Rs {Number(ad.price || 0).toLocaleString()}
                                </span>
                            </div>

                            <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 gap-1">
                                <div className="flex items-center space-x-2 text-[10px] sm:text-xs font-bold text-blue-600 flex-shrink-0">
                                    <span className="flex items-center" title="Likes"><i className="far fa-thumbs-up mr-0.5 sm:mr-1 text-blue-500"></i>{likes}</span>
                                    <span className="flex items-center" title="Views"><i className="far fa-eye mr-0.5 sm:mr-1 text-blue-500"></i>{views}</span>
                                </div>

                                {/* Instant Call & WhatsApp Mini Buttons */}
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={handleQuickCall}
                                        className="bg-[#E50914] hover:bg-red-700 active:scale-95 text-white px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[11px] font-extrabold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                        title="Instant Call"
                                    >
                                        <i className="fas fa-phone-alt text-[8px] sm:text-[10px]"></i>
                                        <span>Call</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleQuickWhatsApp}
                                        className="bg-[#25D366] hover:bg-green-600 active:scale-95 text-white px-2.5 sm:px-3 py-1 rounded-lg text-[9px] sm:text-[11px] font-extrabold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                                        title="Instant WhatsApp"
                                    >
                                        <i className="fab fa-whatsapp text-[10px] sm:text-xs"></i>
                                        <span>Chat</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
};

const Pagination = ({ totalItems, currentPage, paginate }: { totalItems: number; currentPage: number; paginate: (page: number) => void }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / 30); // perPage is 30
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    if (totalPages <= 1) return null;

    return (
        <nav className="flex justify-center mt-12 space-x-2">
            <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
                Prev
            </button>
            {pageNumbers.map(number => (
                <button
                    key={number}
                    onClick={() => paginate(number)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${currentPage === number
                            ? 'text-white shadow-md'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    style={{ backgroundColor: currentPage === number ? PRIMARY_PINK : undefined }}
                >
                    {number}
                </button>
            ))}
            <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition-colors"
            >
                Next
            </button>
        </nav>
    );
};

const FilterSidebarContent = ({ selectedCategory, setSelectedCategory, categories, isMobile = false, isAdult = true }: { selectedCategory: string; setSelectedCategory: (category: string) => void; categories: string[]; isMobile?: boolean; isAdult?: boolean | null }) => {
    // Filter out Spa category if user is under 18
    const filteredCategories = isAdult === false
        ? categories.filter(cat => cat !== 'Spa & Wellness Services')
        : categories;
    const allCategories = ['All Categories', ...filteredCategories];

    const categoryIcons: Record<string, string> = {
        'All Categories': 'fas fa-globe',
        'Girls Personal': 'fas fa-female',
        'Boys Personal': 'fas fa-male',
        'Shemale Personal': 'fas fa-transgender',
        'Marriage Proposals': 'fas fa-ring',
        'Live Cam': 'fas fa-video',
        'Spa & Wellness Services': 'fas fa-spa',
        'Rooms': 'fas fa-bed',
        'Rent': 'fas fa-key',
        'Real Estate': 'fas fa-home',
        'Sales': 'fas fa-shopping-bag',
        'Toys & Accessories': 'fas fa-gamepad',
        'Electronics': 'fas fa-laptop',
        'Vehicles': 'fas fa-car',
        'Digital Products': 'fas fa-download',
        'Professional Services': 'fas fa-user-tie',
    };

    return (
        <div className={`${isMobile ? 'p-0' : 'p-4 rounded-xl lg:sticky lg:top-24 bg-white shadow-xl border border-gray-100'}`}>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col space-y-2 mb-6">
                <a href="/agents" className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">Agents</span>
                    <i className="fas fa-user-shield opacity-80"></i>
                </a>
                <a href="/premium" className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center text-gray-900">Premium</span>
                    <i className="fas fa-crown opacity-80 text-gray-900"></i>
                </a>
                <a href="/saved-ads" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">My Saved Ads</span>
                    <i className="far fa-heart opacity-80"></i>
                </a>
                <a href="/blog" className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">Blog</span>
                    <i className="far fa-newspaper opacity-80"></i>
                </a>
                
            </div>

            <div className="flex items-center justify-between mb-4 border-b-2 border-gray-100 pb-2">
                <h3 className="text-xl font-bold text-gray-900 relative">
                    Top Categories
                    <span className="absolute -bottom-2.5 left-0 w-1/2 h-0.5 bg-red-600 rounded-full"></span>
                </h3>
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {allCategories.map((cat) => {
                    const isSelected = selectedCategory === cat;
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`w-full text-left flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                isSelected
                                    ? 'bg-red-50 text-red-600 font-semibold'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-red-600'
                            }`}
                        >
                            <i className={`${categoryIcons[cat] || 'fab fa-envira'} w-6 text-center ${isSelected ? 'text-red-500' : 'text-red-400 group-hover:text-red-500'} transition-colors duration-200`} />
                            <span className="truncate ml-2">{cat}</span>
                        </button>
                    );
                })}
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb { background: #D1D5DB; }
            `}</style>
        </div>
    );
};


// --- Main Component ---

interface ClassifiedsPageProps {
    ads: Ad[];
    categories: string[];
    topCategories: TopCategory[];
    pagination: {
        currentPage: number;
        totalItems: number;
        perPage: number;
        totalPages: number;
    };
    selectedCategory: string;
    searchTerm?: string;
    selectedLocation?: string;
    displayViews?: number;
    savedAdIds?: number[];
}

const ClassifiedsBrowsePage: React.FC<ClassifiedsPageProps> = ({
    ads = [],
    categories = [],
    topCategories = [],
    pagination = {
        currentPage: 1,
        totalItems: 0,
        perPage: 30,
        totalPages: 1,
    },
    selectedCategory: initialCategory = 'All Categories',
    searchTerm: initialSearchTerm = '',
    selectedLocation: initialLocation = 'All Sri Lanka',
    savedAdIds = [],
    displayViews = 5000
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
    const [savedAds, setSavedAds] = useState<number[]>(savedAdIds);
    const [searchInput, setSearchInput] = useState<string>(initialSearchTerm);
    const [locationInput, setLocationInput] = useState<string>(initialLocation || 'All Sri Lanka');
    const [showAgeVerification, setShowAgeVerification] = useState(false);
    const [isAdult, setIsAdult] = useState<boolean | null>(null);
    const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedAd[]>([]);
    const [liveToast, setLiveToast] = useState<{
        id: number;
        title: string;
        location: string;
        imgSrc: string;
        actionText: string;
    } | null>(null);
    const [isSwipeModeOpen, setIsSwipeModeOpen] = useState(false);
    const [swipeAdIndex, setSwipeAdIndex] = useState(0);
    const [swipePhotoIndex, setSwipePhotoIndex] = useState(0);
    const [swipeTouchStart, setSwipeTouchStart] = useState<{ x: number; y: number } | null>(null);

    // Check age verification and load recently viewed ads on mount
    useEffect(() => {
        const ageVerified = localStorage.getItem('ageVerified');
        if (ageVerified === null) {
            setShowAgeVerification(true);
        } else {
            setIsAdult(ageVerified === 'true');
        }

        try {
            const stored = localStorage.getItem('tintinads_recently_viewed');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (Array.isArray(parsed)) {
                    setRecentlyViewed(parsed.slice(0, 8));
                }
            }
        } catch {
            // ignore storage errors
        }
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        try {
            localStorage.removeItem('tintinads_recently_viewed');
        } catch {
            // ignore
        }
        setRecentlyViewed([]);
    }, []);

    // Handle age verification
    const handleAgeVerification = (is18OrOlder: boolean) => {
        setIsAdult(is18OrOlder);
        localStorage.setItem('ageVerified', is18OrOlder.toString());
        setShowAgeVerification(false);
    };

    // Filter ads based on age
    const filteredAds = useMemo(() => {
        if (isAdult === false) {
            return ads.filter(ad => ad.category !== 'Spa' && ad.category !== 'Girls Personal' && ad.category !== 'Boys Personal');
        }
        return ads;
    }, [ads, isAdult]);

    const goToNextSwipeAd = useCallback(() => {
        if (!filteredAds.length) return;
        setSwipePhotoIndex(0);
        setSwipeAdIndex((prev) => (prev + 1) % filteredAds.length);
    }, [filteredAds.length]);

    const goToPrevSwipeAd = useCallback(() => {
        if (!filteredAds.length) return;
        setSwipePhotoIndex(0);
        setSwipeAdIndex((prev) => (prev - 1 + filteredAds.length) % filteredAds.length);
    }, [filteredAds.length]);

    const handleSwipeTouchStart = (e: React.TouchEvent) => {
        setSwipeTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    };

    const handleSwipeTouchEnd = (e: React.TouchEvent, totalPhotos: number) => {
        if (!swipeTouchStart) return;
        const dx = swipeTouchStart.x - e.changedTouches[0].clientX;
        const dy = swipeTouchStart.y - e.changedTouches[0].clientY;

        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 45) {
            if (dy > 0) {
                goToNextSwipeAd();
            } else {
                goToPrevSwipeAd();
            }
        } else if (Math.abs(dx) > 45 && totalPhotos > 1) {
            if (dx > 0) {
                setSwipePhotoIndex((p) => (p + 1) % totalPhotos);
            } else {
                setSwipePhotoIndex((p) => (p - 1 + totalPhotos) % totalPhotos);
            }
        }
        setSwipeTouchStart(null);
    };

    // Periodic Live FOMO Micro-Toast (every 24 seconds, visible for 4.5 seconds)
    useEffect(() => {
        if (!filteredAds || filteredAds.length === 0) return;

        const actions = [
            'දැන්වීමක් මේ දැන් WhatsApp හරහා සම්බන්ධ විය 💬',
            'VIP දැන්වීමක් දැන් පරීක්ෂා කෙරේ 👀',
            'තහවුරු කළ දැන්වීමකට දැන් ඇමතුමක් ලැබුණි 📞',
            'නව දැන්වීමක් මේ දැන් Online විය 🟢',
        ];

        let hideTimer: ReturnType<typeof setTimeout>;

        const triggerToast = () => {
            const randomAd = filteredAds[Math.floor(Math.random() * filteredAds.length)];
            if (!randomAd) return;
            const randomAction = actions[Math.floor(Math.random() * actions.length)];
            const img = (randomAd.images && randomAd.images[0]) || randomAd.imgSrc || '/placeholder-image.jpg';

            setLiveToast({
                id: randomAd.id,
                title: randomAd.title,
                location: randomAd.location || 'Colombo',
                imgSrc: img,
                actionText: randomAction,
            });

            hideTimer = setTimeout(() => {
                setLiveToast(null);
            }, 4500);
        };

        const initialTimer = setTimeout(triggerToast, 7000);
        const intervalTimer = setInterval(triggerToast, 24000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(intervalTimer);
            clearTimeout(hideTimer);
        };
    }, [filteredAds]);

    // Top Categories for the horizontal scroll bar
    const filteredTopCategories = useMemo(() => {
        return [
            { name: 'Agents', icon: 'fas fa-user-tie' },
            { name: 'Girls', icon: 'fas fa-female' },
            { name: 'Boys', icon: 'fas fa-male' },
            { name: 'Live Cam', icon: 'fas fa-video' },
            { name: 'Spa', icon: 'fas fa-spa' },
        ];
    }, []);

    // Sync inputs with prop changes
    useEffect(() => {
        setSearchInput(initialSearchTerm);
        setLocationInput(initialLocation || 'All Sri Lanka');
    }, [initialSearchTerm, initialLocation]);

    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
    const toggleFilters = useCallback(() => setIsFilterOverlayOpen(prev => !prev), []);

    const handleClearSearch = useCallback(() => {
        setSearchInput('');
        setLocationInput('All Sri Lanka');
        router.get('/', {
            category: initialCategory === 'All Categories' ? undefined : initialCategory,
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    }, [initialCategory]);

    const handlePaginate = useCallback((pageNumber: number, category: string, search: string = '', loc: string = 'All Sri Lanka') => {
        router.get('/', {
            category: category === 'All Categories' ? undefined : category,
            page: pageNumber,
            search: search || undefined,
            location: loc === 'All Sri Lanka' ? undefined : loc,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

    const quickCities = useMemo(() => [
        'All Sri Lanka',
        'Colombo',
        'Kandy',
        'Gampaha',
        'Negombo',
        'Nugegoda',
        'Dehiwala',
        'Mount Lavinia',
        'Maharagama',
        'Kurunegala',
        'Galle',
        'Malabe',
    ], []);

    const handleCitySelect = useCallback((city: string) => {
        setLocationInput(city);
        router.get('/', {
            category: initialCategory === 'All Categories' ? undefined : initialCategory,
            page: 1,
            search: searchInput.trim() || undefined,
            location: city === 'All Sri Lanka' ? undefined : city,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    }, [initialCategory, searchInput]);

    const handleCategorySelect = useCallback((category: string) => {
        if (category === 'Agents') {
            router.get('/agents', {
                page: 1,
            }, {
                preserveState: true,
                preserveScroll: false,
            });
        } else {
            // Map short names back to full category names for filtering
            let searchCategory = category;
            if (category === 'Girls') searchCategory = 'Girls Personal';
            if (category === 'Boys') searchCategory = 'Boys Personal';
            if (category === 'Spa') searchCategory = 'Spa & Wellness Services';

            router.get('/', {
                category: searchCategory === 'All Categories' ? undefined : searchCategory,
                page: 1,
                search: searchInput || undefined,
                location: locationInput === 'All Sri Lanka' ? undefined : locationInput,
            }, {
                preserveState: true,
                preserveScroll: false,
            });
        }
    }, [searchInput, locationInput]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', {
            category: initialCategory === 'All Categories' ? undefined : initialCategory,
            page: 1,
            search: searchInput.trim() || undefined,
            location: locationInput === 'All Sri Lanka' ? undefined : locationInput,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    }, [searchInput, initialCategory, locationInput]);

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchInput(e.target.value);
    }, []);

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
                const data = await response.json();
                if (shouldSave) {
                    setSavedAds(prev => [...prev, adId]);
                } else {
                    setSavedAds(prev => prev.filter(id => id !== adId));
                }
                // Update the saved count in shared props (will be updated on next page load)
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Error saving ad:', errorData);
            }
        } catch (error) {
            console.error('Error toggling save:', error);
        }
    }, []);

    // Check if there are any VIP or Premium ads to render the styles once
    const hasVipAds = useMemo(() => {
        return ads.some(ad => ad.isVip);
    }, [ads]);

    const hasPremiumAds = useMemo(() => {
        return ads.some(ad => ad.isPremium);
    }, [ads]);

    const hasPlatinumAds = useMemo(() => {
        return ads.some(ad => ad.isPlatinum);
    }, [ads]);



    return (
        <div className="bg-gray-50 font-sans min-h-screen">
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
            {/* VIP and Premium Border Animation Styles */}
            {(hasVipAds || hasPremiumAds || hasPlatinumAds) && (
                <style>{`
                    @keyframes vipGoldBorderAnimation {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                    @keyframes premiumPinkBorderAnimation {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }

                    @keyframes platinumSilverBorderAnimation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    .platinum-silver-animated-border {
                        position: relative;
                        background: linear-gradient(90deg, #94a3b8, #cbd5e1, #f1f5f9, #cbd5e1, #94a3b8);
                        background-size: 200% 100%;
                        animation: platinumSilverBorderAnimation 3s ease infinite;
                        box-shadow: 0 0 8px rgba(148, 163, 184, 0.4), 0 0 16px rgba(203, 213, 225, 0.3);
                        overflow: hidden;
                    }
                    .platinum-silver-animated-border::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(
                            45deg,
                            transparent 40%,
                            rgba(255, 255, 255, 0.9) 50%,
                            transparent 60%
                        );
                        background-size: 300% 300%;
                        animation: shine 2.5s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 1;
                        border-radius: inherit;
                    }
                    @keyframes shine {
                        0% {
                            transform: translateX(-100%) translateY(-100%) rotate(45deg);
                        }
                        100% {
                            transform: translateX(100%) translateY(100%) rotate(45deg);
                        }
                    }
                    .vip-gold-animated-border {
                        position: relative;
                        background: linear-gradient(90deg, #fbbf24, #f59e0b, #d97706, #fbbf24);
                        background-size: 200% 100%;
                        animation: vipGoldBorderAnimation 3s ease infinite;
                        box-shadow: 0 0 8px rgba(251, 191, 36, 0.3), 0 0 16px rgba(245, 158, 11, 0.2);
                        overflow: hidden;
                    }
                    .vip-gold-animated-border::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(
                            45deg,
                            transparent 40%,
                            rgba(255, 255, 255, 0.9) 50%,
                            transparent 60%
                        );
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
                        box-shadow: 0 0 8px rgba(244, 114, 182, 0.3), 0 0 16px rgba(236, 72, 153, 0.2);
                        overflow: hidden;
                    }
                    .premium-pink-animated-border::before {
                        content: '';
                        position: absolute;
                        top: -2px;
                        left: -2px;
                        right: -2px;
                        bottom: -2px;
                        background: linear-gradient(
                            45deg,
                            transparent 40%,
                            rgba(255, 255, 255, 0.95) 50%,
                            transparent 60%
                        );
                        background-size: 300% 300%;
                        animation: shine 2.5s ease-in-out infinite;
                        pointer-events: none;
                        z-index: 1;
                        border-radius: inherit;
                    }
                `}</style>
            )}
            
            {/* Visitors Counter Strip & VIP Contacts */}
            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 text-white text-center py-2 px-3 sm:px-4 shadow-md text-xs sm:text-sm font-bold flex flex-wrap items-center justify-center gap-2 sm:gap-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-white opacity-10 animate-pulse pointer-events-none"></div>
                <div className="flex items-center gap-2 z-10">
                    <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-white"></span>
                    </span>
                    <span className="tracking-wide">
                        🔥 දිනපතා දහස් ගණනක් පැමිණෙන ශ්‍රී ලංකාවේ අංක 1 වෙබ් අඩවිය - <span className="text-yellow-300 font-extrabold ml-1 text-[13px] sm:text-[15px]">Total Visits: {displayViews.toLocaleString()}+</span>
                    </span>
                </div>

                {/* Shanika Direct WhatsApp Contact */}
                <a
                    href="https://wa.me/94706161617?text=Hi%20Shanika,%20TinTinAds%20%E0%B6%91%E0%B6%9A%E0%B7%8A%E0%B6%B1%E0%B7%8A%20%E0%B6%9A%E0%B6%AD%E0%B7%8F%20%E0%B6%9A%E0%B6%BB%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%8A%E0%B6%B1%E0%B7%8A"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="z-10 inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-white px-3 py-1 rounded-full text-xs font-black shadow-md border border-white/30 transition-transform hover:scale-105"
                >
                    <i className="fa-brands fa-whatsapp text-sm text-white"></i>
                    <span>Shanika: 070 616 1617</span>
                </a>

                {/* Official Telegram Channel */}
                <a
                    href="https://t.me/tintinadsvip"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="z-10 inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-400 text-white px-3 py-1 rounded-full text-xs font-black shadow-md border border-white/30 transition-transform hover:scale-105"
                >
                    <i className="fa-brands fa-telegram text-sm text-white"></i>
                    <span>Telegram VIP</span>
                </a>
            </div>
            
            {/* Sticky Header */}
            <header className="sticky overflow-hidden top-0 z-50 bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* 1. Logo (Using the absolute public path) */}
                        <div className="flex items-center">
                            <img
                                src="/assets/siteicon.png" // ABSOLUTE PUBLIC PATH
                                alt="ClassifiedHub Logo"
                                className="h-15 mr-3"
                            />

                            <img
                                src="/assets/sitetxt.png" // ABSOLUTE PUBLIC PATH
                                alt="ClassifiedHub Logo"
                                className="h-8 mr-3"
                            />
                            {/* <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">ClassifiedHub</h1> */}
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center space-x-8">
                            <a href="/" className="text-gray-700 hover:text-primary-pink transition-colors" style={{ color: PRIMARY_PINK }}>Browse</a>
                            <a href="/blog" className="text-gray-700 hover:text-primary-pink transition-colors font-medium">Blog</a>
                            <a href="/saved-ads" className="text-gray-700 hover:text-primary-pink transition-colors relative">
                                Saved Ads
                                {savedAds.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {savedAds.length}
                                    </span>
                                )}
                            </a>
                            <a href="/packages" className="text-gray-700 hover:text-primary-pink transition-colors font-medium text-pink-600">
                                Packages & Pricing
                            </a>
                            <a href="/terms-and-conditions" className="text-gray-700 hover:text-primary-pink transition-colors">
                                Terms & Conditions
                            </a>
                        </nav>
                        <button className="md:hidden p-2" onClick={toggleMobileMenu}><i className="fas fa-bars text-gray-700"></i></button>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-200">
                        <div className="px-4 py-2 space-y-2">
                            <a href="/" className="block py-2 text-gray-700 hover:text-pink-600">
                                <i className="fas fa-search w-6 text-center text-gray-400 mr-2"></i> Browse
                            </a>
                            <a href="/agents" className="block py-2 text-gray-700 hover:text-pink-600">
                                <i className="fas fa-user-shield w-6 text-center text-pink-500 mr-2"></i> Agents
                            </a>
                            <a href="/premium" className="block py-2 text-gray-700 hover:text-amber-500">
                                <i className="fas fa-crown w-6 text-center text-amber-500 mr-2"></i> Premium
                            </a>
                            <a href="/saved-ads" className="block py-2 text-gray-700 hover:text-red-600 relative">
                                <i className="far fa-heart w-6 text-center text-red-500 mr-2"></i> Saved Ads
                                {savedAds.length > 0 && (
                                    <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                                        {savedAds.length}
                                    </span>
                                )}
                            </a>
                            <a href="/blog" className="block py-2 text-gray-700 hover:text-cyan-600">
                                <i className="far fa-newspaper w-6 text-center text-cyan-500 mr-2"></i> Blog
                            </a>
                            <a href="/packages" className="block py-2 text-pink-600 hover:text-pink-700 font-medium">
                                <i className="fas fa-tags w-6 text-center text-pink-500 mr-2"></i> Packages & Pricing
                            </a>
                            <a href="/terms-and-conditions" className="block py-2 text-gray-700 hover:text-gray-900">
                                <i className="fas fa-file-contract w-6 text-center text-gray-400 mr-2"></i> Terms & Conditions
                            </a>
                            <div className="border-t border-gray-100 my-2 pt-2"></div>
                            
                        </div>
                    </div>
                )}
            </header>

            {/* Search Section (Kept the same) */}
            <section className="bg-white py-8 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search Bar & Location Dropdown */}
                    <form onSubmit={handleSearch} className="mb-6 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <i className="fas fa-search text-gray-400"></i>
                            </div>
                            <input
                                type="text"
                                placeholder="What are you looking for? (e.g. Massage, Girls)"
                                value={searchInput}
                                onChange={handleSearchChange}
                                className="w-full pl-12 pr-10 py-4 text-base border-2 border-gray-200 rounded-xl focus:outline-none transition-colors focus:border-pink-500 bg-gray-50 focus:bg-white"
                            />
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={() => setSearchInput('')}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Clear search"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                        </div>
                        <div className="relative md:w-64 flex-shrink-0" style={{ zIndex: 50 }}>
                            <Select
                                options={locationOptions}
                                value={locationOptions.find(o => o.value === locationInput) || locationOptions[0]}
                                onChange={(option) => setLocationInput(option?.value || 'All Sri Lanka')}
                                isSearchable={true}
                                styles={{
                                    control: (base, state) => ({
                                        ...base,
                                        padding: '0.4rem 0.5rem',
                                        paddingLeft: '2rem',
                                        borderRadius: '0.75rem',
                                        borderColor: state.isFocused ? '#ec4899' : '#e5e7eb',
                                        backgroundColor: state.isFocused ? '#ffffff' : '#f9fafb',
                                        boxShadow: state.isFocused ? '0 0 0 1px #ec4899' : 'none',
                                        '&:hover': {
                                            borderColor: '#ec4899'
                                        }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        zIndex: 100
                                    }),
                                    option: (base, state) => ({
                                        ...base,
                                        backgroundColor: state.isSelected ? '#ec4899' : state.isFocused ? '#fce7f3' : 'transparent',
                                        color: state.isSelected ? 'white' : '#374151',
                                        '&:active': {
                                            backgroundColor: '#ec4899',
                                            color: 'white'
                                        }
                                    })
                                }}
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <i className="fas fa-map-marker-alt text-gray-400 z-10"></i>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="text-white px-8 py-4 rounded-xl transition-colors hover:bg-pink-600 font-bold flex items-center justify-center gap-2 flex-shrink-0 shadow-md"
                            style={{ backgroundColor: '#ec4899' }}
                        >
                            <i className="fas fa-search"></i>
                            <span className="md:hidden">Search</span>
                        </button>
                    </form>
                    {/* Top Categories - Static */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        {filteredTopCategories.map((cat, index) => {
                            const colorIndex = index % CATEGORY_COLORS.length;
                            const colors = CATEGORY_COLORS[colorIndex];
                            return (
                                <div key={cat.name} onClick={() => handleCategorySelect(cat.name)} className="flex flex-col items-center cursor-pointer group">
                                    <div
                                        className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                                        style={{
                                            backgroundColor: colors.bg + '20',
                                            border: `2px solid ${colors.bg}`,
                                        }}
                                    >
                                        <i className={`${cat.icon} text-2xl transition-transform duration-300 group-hover:scale-110`} style={{ color: colors.icon }}></i>
                                    </div>
                                    <span className="text-sm mt-2 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{cat.name}</span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Quick City Filter Pills */}
                    <div className="mt-6 pt-5 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                            <i className="fas fa-map-marker-alt text-pink-500"></i>
                            <span>Quick City Filter (නගරය අනුව ඉක්මනින් තෝරන්න)</span>
                        </div>
                        <div className="flex items-center justify-start sm:justify-center sm:flex-wrap gap-2 overflow-x-auto pb-2 px-1">
                            {quickCities.map((city) => {
                                const isSelected = (locationInput || 'All Sri Lanka').toLowerCase() === city.toLowerCase();
                                return (
                                    <button
                                        key={city}
                                        type="button"
                                        onClick={() => handleCitySelect(city)}
                                        className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 border cursor-pointer ${
                                            isSelected
                                                ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-pink-600 shadow-md scale-105'
                                                : 'bg-gray-50 hover:bg-pink-50 text-gray-700 hover:text-pink-600 border-gray-200 hover:border-pink-300 shadow-2xs'
                                        }`}
                                    >
                                        <i className={`fas ${city === 'All Sri Lanka' ? 'fa-globe-asia' : 'fa-map-pin'} text-[10px] ${isSelected ? 'text-white' : 'text-pink-500'}`}></i>
                                        <span>{city}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex gap-8">
                    {/* 2. Filter Sidebar (Updated - Only category remains) */}
                    <aside className="hidden lg:block w-80 flex-shrink-0">
                        <FilterSidebarContent
                            selectedCategory={initialCategory}
                            setSelectedCategory={handleCategorySelect}
                            categories={categories}
                            isAdult={isAdult}
                        />
                    </aside>

                    {/* Mobile Filter Button */}
                    <div className="lg:hidden fixed bottom-4 left-4 z-40">
                        <button onClick={toggleFilters} className="text-white p-3 rounded-full shadow-lg transition-colors hover:bg-pink-500" style={{ backgroundColor: PRIMARY_PINK }}>
                            <i className="fas fa-filter"></i>
                        </button>
                    </div>

                    {/* Ad Grid */}
                    <main className="flex-1 min-w-0">
                        {/* Recently Viewed Ads Strip */}
                        {recentlyViewed.length > 0 && (
                            <div className="mb-6 bg-gradient-to-r from-pink-50/70 via-white to-rose-50/70 border border-pink-100 rounded-2xl p-3 sm:p-4 shadow-xs">
                                <div className="flex items-center justify-between mb-2.5">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-100 text-pink-600 text-xs">
                                            <i className="fas fa-history"></i>
                                        </span>
                                        <h3 className="text-xs sm:text-sm font-extrabold text-gray-800">
                                            👀 ඔබ මෑතකදී බැලූ දැන්වීම් <span className="text-gray-500 font-medium">(Recently Viewed)</span>
                                        </h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearRecentlyViewed}
                                        className="text-[11px] text-gray-400 hover:text-pink-600 font-semibold transition-colors cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1.5">
                                    {recentlyViewed.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`/ad/${item.id}`}
                                            className="w-[130px] sm:w-[155px] flex-shrink-0 bg-white rounded-xl border border-gray-200 hover:border-pink-400 overflow-hidden shadow-2xs hover:shadow-md transition-all group"
                                        >
                                            <div className="relative h-20 sm:h-24 w-full bg-gray-100 overflow-hidden">
                                                <img
                                                    src={item.imgSrc || '/placeholder-image.jpg'}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    onError={(e) => {
                                                        e.currentTarget.src = '/placeholder-image.jpg';
                                                    }}
                                                />
                                                <span className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
                                                {(item.isVip || item.isPlatinum || item.isPremium) && (
                                                    <span className="absolute top-1 right-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                                                        VIP
                                                    </span>
                                                )}
                                            </div>
                                            <div className="p-2">
                                                <p className="text-[11px] sm:text-xs font-bold text-gray-800 truncate group-hover:text-pink-600 transition-colors">
                                                    {item.title}
                                                </p>
                                                <div className="flex items-center justify-between mt-0.5">
                                                    <span className="text-[10px] sm:text-[11px] font-extrabold text-pink-600">
                                                        Rs {Number(item.price || 0).toLocaleString()}
                                                    </span>
                                                    <span className="text-[9px] text-gray-400 truncate max-w-[55px]">
                                                        {item.location}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 flex flex-wrap items-center gap-2">
                                <span>Latest Ads in {initialCategory}</span>
                                {locationInput && locationInput !== 'All Sri Lanka' && (
                                    <span className="inline-flex items-center gap-1.5 bg-pink-50 text-pink-600 border border-pink-200 px-3 py-1 rounded-full text-xs sm:text-sm font-bold">
                                        <i className="fas fa-map-marker-alt text-xs"></i>
                                        {locationInput}
                                        <button
                                            type="button"
                                            onClick={() => handleCitySelect('All Sri Lanka')}
                                            className="ml-1 text-pink-400 hover:text-pink-700"
                                            title="Clear city filter"
                                        >
                                            <i className="fas fa-times-circle"></i>
                                        </button>
                                    </span>
                                )}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto w-full sm:w-auto justify-between sm:justify-end">
                                {filteredAds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSwipeAdIndex(0);
                                            setSwipePhotoIndex(0);
                                            setIsSwipeModeOpen(true);
                                        }}
                                        className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 hover:from-pink-700 hover:to-amber-600 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
                                    >
                                        <i className="fas fa-fire-alt text-yellow-200 animate-pulse"></i>
                                        <span>Quick Swipe Mode</span>
                                    </button>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{pagination.totalItems} results</span>
                                    <select className="px-2.5 py-2 border border-gray-300 rounded-lg focus:outline-none text-xs sm:text-sm focus:border-light-blue" style={{ borderColor: LIGHT_BLUE }}>
                                        <option>Sort by: Latest</option>
                                        <option>Price: Low to High</option>
                                        <option>Price: High to Low</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                            {filteredAds.length > 0 ? (
                                filteredAds.map((ad) => (
                                    <AdCard
                                        key={ad.id}
                                        ad={ad}
                                        isSaved={savedAds.includes(ad.id)}
                                        onSaveToggle={handleSaveToggle}
                                    />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500 text-lg">No ads found in this category.</p>
                                </div>
                            )}
                        </div>

                        {/* 3. Pagination */}
                        <Pagination
                            totalItems={pagination.totalItems}
                            currentPage={pagination.currentPage}
                            paginate={(page) => handlePaginate(page, initialCategory, searchInput, locationInput)}
                        />
                    </main>
                </div>
            </div>

            {/* Mobile Floating Quick Swipe Mode Button */}
            {filteredAds.length > 0 && !isSwipeModeOpen && (
                <div className="lg:hidden fixed bottom-4 right-4 z-40">
                    <button
                        type="button"
                        onClick={() => {
                            setSwipeAdIndex(0);
                            setSwipePhotoIndex(0);
                            setIsSwipeModeOpen(true);
                        }}
                        className="bg-gradient-to-r from-pink-600 via-rose-600 to-amber-500 text-white px-4 py-3 rounded-full shadow-2xl border border-white/30 text-xs font-extrabold flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
                    >
                        <i className="fas fa-fire-alt text-yellow-200 animate-pulse text-sm"></i>
                        <span>Swipe Ads</span>
                    </button>
                </div>
            )}

            {/* Full-Screen TikTok / Reels Style Quick Swipe Mode Modal */}
            {isSwipeModeOpen && filteredAds.length > 0 && (() => {
                const currentSwipeAd = filteredAds[swipeAdIndex] || filteredAds[0];
                const swipePhotos = currentSwipeAd.images && currentSwipeAd.images.length > 0
                    ? currentSwipeAd.images
                    : [currentSwipeAd.imgSrc || '/placeholder-image.jpg'];
                const safePhotoIdx = swipePhotoIndex % swipePhotos.length;
                const rawWa = (currentSwipeAd.whatsapp_number || currentSwipeAd.phone_number || '94700000000').replace(/[^0-9]/g, '');
                const cleanWa = rawWa.startsWith('0') ? '94' + rawWa.slice(1) : rawWa;
                const phoneHref = `tel:${currentSwipeAd.phone_number || '0700000000'}`;

                const quickSwipeChips = [
                    {
                        label: '👋 Available ද?',
                        msg: `Hi! 👋 මම ඔබගේ "${currentSwipeAd.title}" දැන්වීම TinTinAds.com එකෙන් දැක්කේ. දැන් Available ද?\nhttps://tintinads.com/ad/${currentSwipeAd.id}`,
                    },
                    {
                        label: '📍 Location?',
                        msg: `Hi! 📍 මම ඔබගේ "${currentSwipeAd.title}" දැන්වීම TinTinAds.com එකෙන් දැක්කේ. Location එක සහ විස්තර එවන්න පුළුවන්ද?\nhttps://tintinads.com/ad/${currentSwipeAd.id}`,
                    },
                    {
                        label: '💰 ගාස්තු?',
                        msg: `Hi! 💰 මම ඔබගේ "${currentSwipeAd.title}" දැන්වීම TinTinAds.com එකෙන් දැක්කේ. පැකේජ සහ ගාස්තු විස්තර එවන්න.\nhttps://tintinads.com/ad/${currentSwipeAd.id}`,
                    },
                ];

                return (
                    <div
                        className="fixed inset-0 z-[130] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
                        onTouchStart={handleSwipeTouchStart}
                        onTouchEnd={(e) => handleSwipeTouchEnd(e, swipePhotos.length)}
                    >
                        {/* Top Bar */}
                        <div className="p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent z-20">
                            <div className="flex items-center gap-2">
                                <span className="bg-gradient-to-r from-pink-600 to-amber-500 text-white px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-md">
                                    <i className="fas fa-fire-alt text-yellow-200"></i>
                                    <span>Swipe Mode ({swipeAdIndex + 1}/{filteredAds.length})</span>
                                </span>
                                <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-bold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                    Online • ⚡ 5m Reply
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsSwipeModeOpen(false)}
                                className="w-9 h-9 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center text-lg font-bold cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Center Image & Navigation Controls */}
                        <div className="relative flex-1 flex items-center justify-center overflow-hidden px-2">
                            <img
                                src={swipePhotos[safePhotoIdx] || '/placeholder-image.jpg'}
                                alt={currentSwipeAd.title}
                                className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-image.jpg';
                                }}
                            />

                            {/* Photo Switcher if multiple photos */}
                            {swipePhotos.length > 1 && (
                                <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-white/20">
                                    <button
                                        type="button"
                                        onClick={() => setSwipePhotoIndex((p) => (p - 1 + swipePhotos.length) % swipePhotos.length)}
                                        className="px-1 text-pink-400 hover:text-white cursor-pointer"
                                    >
                                        ◀
                                    </button>
                                    <span><i className="fas fa-camera text-pink-400 mr-1"></i>{safePhotoIdx + 1} / {swipePhotos.length}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSwipePhotoIndex((p) => (p + 1) % swipePhotos.length)}
                                        className="px-1 text-pink-400 hover:text-white cursor-pointer"
                                    >
                                        ▶
                                    </button>
                                </div>
                            )}

                            {/* Right Side Floating Next/Prev Ad Controls (TikTok Style) */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                                <button
                                    type="button"
                                    onClick={goToPrevSwipeAd}
                                    className="w-11 h-11 rounded-full bg-white/15 hover:bg-pink-600 backdrop-blur-md text-white flex flex-col items-center justify-center border border-white/25 shadow-lg transition cursor-pointer active:scale-90"
                                    title="කලින් දැන්වීම (Previous Ad)"
                                >
                                    <i className="fas fa-chevron-up text-sm"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={goToNextSwipeAd}
                                    className="w-11 h-11 rounded-full bg-gradient-to-b from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white flex flex-col items-center justify-center border border-white/40 shadow-xl transition cursor-pointer active:scale-90 animate-bounce"
                                    title="ඊළඟ දැන්වීම (Next Ad)"
                                >
                                    <i className="fas fa-chevron-down text-sm"></i>
                                </button>
                                <a
                                    href={`/ad/${currentSwipeAd.id}`}
                                    className="w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md text-white flex flex-col items-center justify-center border border-white/25 shadow-lg text-[10px] font-bold"
                                    title="View Full Ad"
                                >
                                    <i className="fas fa-external-link-alt text-xs"></i>
                                </a>
                            </div>
                        </div>

                        {/* Bottom Details & Instant Conversion Panel */}
                        <div className="p-3.5 sm:p-5 bg-gradient-to-t from-black via-black/95 to-transparent z-20 max-w-xl w-full mx-auto">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                                <span className="bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Online Today
                                </span>
                                <span className="bg-amber-500/20 border border-amber-400/50 text-amber-300 px-2 py-0.5 rounded-full text-[10px] font-extrabold">
                                    ⚡ 5m Fast Reply
                                </span>
                                {(currentSwipeAd.isVip || currentSwipeAd.isPlatinum || currentSwipeAd.isPremium) && (
                                    <span className="bg-gradient-to-r from-amber-400 to-yellow-600 text-black px-2 py-0.5 rounded-full text-[10px] font-black">
                                        👑 VIP VERIFIED
                                    </span>
                                )}
                                <span className="text-xs text-pink-400 font-bold ml-auto">
                                    <i className="fas fa-map-marker-alt mr-1"></i>{currentSwipeAd.location || 'Sri Lanka'}
                                </span>
                            </div>

                            <div className="flex items-baseline justify-between gap-2 mb-1">
                                <a href={`/ad/${currentSwipeAd.id}`} className="text-base sm:text-lg font-extrabold text-white truncate hover:underline">
                                    {currentSwipeAd.title}
                                </a>
                                <span className="text-lg sm:text-xl font-black text-pink-400 shrink-0">
                                    Rs {Number(currentSwipeAd.price || 0).toLocaleString()}
                                </span>
                            </div>

                            {/* One-Tap Quick WhatsApp Chips in Swipe Mode */}
                            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2">
                                {quickSwipeChips.map((chip, idx) => (
                                    <a
                                        key={idx}
                                        href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(chip.msg)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="bg-white/10 hover:bg-emerald-600 text-white border border-emerald-400/40 px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap flex items-center gap-1 transition shrink-0"
                                    >
                                        <span>{chip.label}</span>
                                    </a>
                                ))}
                            </div>

                            {/* Call, WhatsApp & Next Ad Action Row */}
                            <div className="grid grid-cols-3 gap-2">
                                <a
                                    href={phoneHref}
                                    className="bg-[#E50914] hover:bg-red-700 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
                                >
                                    <i className="fas fa-phone-alt"></i>
                                    <span>CALL NOW</span>
                                </a>
                                <a
                                    href={`https://wa.me/${cleanWa}?text=${encodeURIComponent(`Hi, I saw your ad on TinTinAds.com: ${currentSwipeAd.title}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-[#25D366] hover:bg-green-600 text-white font-extrabold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
                                >
                                    <i className="fab fa-whatsapp text-base"></i>
                                    <span>WHATSAPP</span>
                                </a>
                                <button
                                    type="button"
                                    onClick={goToNextSwipeAd}
                                    className="bg-white/15 hover:bg-white/25 text-white border border-white/25 font-extrabold text-xs sm:text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
                                >
                                    <span>Next Ad</span>
                                    <i className="fas fa-arrow-down text-pink-400"></i>
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-400 text-center mt-2">
                                🔒 100% Private & Direct Contact  •  ⬆️⬇️ උඩට/පහළට Swipe කර තවත් දැන්වීම් බලන්න
                            </p>
                        </div>
                    </div>
                );
            })()}

            {/* Live Activity FOMO Micro-Toast */}
            {liveToast && !isSwipeModeOpen && (
                <div className="fixed bottom-16 sm:bottom-5 right-3 left-3 sm:left-auto sm:w-80 z-40 animate-bounce-once">
                    <div className="bg-gray-900/95 backdrop-blur-md text-white rounded-2xl p-2.5 sm:p-3 shadow-2xl border border-pink-500/40 flex items-center gap-3">
                        <a href={`/ad/${liveToast.id}`} className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-white/20">
                            <img
                                src={liveToast.imgSrc}
                                alt={liveToast.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = '/placeholder-image.jpg';
                                }}
                            />
                            <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-gray-900"></span>
                        </a>
                        <a href={`/ad/${liveToast.id}`} className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-pink-400 uppercase tracking-wide">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                <span>{liveToast.location} • Just Now</span>
                            </div>
                            <p className="text-xs font-bold text-white truncate mt-0.5">
                                {liveToast.actionText}
                            </p>
                            <p className="text-[10px] text-gray-300 truncate">
                                {liveToast.title}
                            </p>
                        </a>
                        <button
                            type="button"
                            onClick={() => setLiveToast(null)}
                            className="text-gray-400 hover:text-white p-1 flex-shrink-0 cursor-pointer"
                            aria-label="Close notification"
                        >
                            <i className="fas fa-times text-xs"></i>
                        </button>
                    </div>
                </div>
            )}

            <Footer />

            {/* Mobile Filter Overlay */}
            {isFilterOverlayOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-[60] lg:hidden animate-fadeIn"
                        onClick={(e) => {
                            if (e.target === e.currentTarget) {
                                toggleFilters();
                            }
                        }}
                    />
                    {/* Filter Panel */}
                    <div className={`fixed right-0 top-0 h-full w-full sm:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[70] lg:hidden ${isFilterOverlayOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="h-full flex flex-col">
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-white flex-shrink-0">
                                <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Browse Categories</h3>
                                <button
                                    onClick={toggleFilters}
                                    className="text-gray-500 hover:text-gray-700 p-2 transition-colors rounded-full hover:bg-gray-100"
                                    aria-label="Close filters"
                                >
                                    <i className="fas fa-times text-lg"></i>
                                </button>
                            </div>
                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                                <div className="mb-4">
                                    <button
                                        className="w-full text-left text-gray-500 hover:text-primary-pink text-sm font-medium transition-colors px-3 py-2 mb-3"
                                        onClick={() => {
                                            handleCategorySelect('All Categories');
                                            toggleFilters();
                                        }}
                                    >
                                        <i className="fas fa-times-circle mr-2"></i>Clear All
                                    </button>
                                </div>
                                {/* Category List */}
                                <FilterSidebarContent
                                    selectedCategory={initialCategory}
                                    setSelectedCategory={(cat) => {
                                        handleCategorySelect(cat);
                                        toggleFilters();
                                    }}
                                    categories={categories}
                                    isMobile={true}
                                    isAdult={isAdult}
                                />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ClassifiedsBrowsePage;
