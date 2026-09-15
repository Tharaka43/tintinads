import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { router, Head, usePage } from '@inertiajs/react';

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
            {/* Ensure gradient overlay stays on top if needed, but in the parent component logic it's a sibling. 
                 However, the original img had className="w-full h-48..."
                 Here we use absolute to stack them easily for crossfade.
                 The parent container needs strictly defined height.
             */}
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

const Pagination = ({ totalItems, currentPage, paginate }: { totalItems: number; currentPage: number; paginate: (page: number) => void }) => {
    const pageNumbers = [];
    const totalPages = Math.ceil(totalItems / 9); // perPage is 9
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
                <a href="/fake-ads" className="w-full bg-gradient-to-r from-gray-800 to-gray-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">Fake Ads</span>
                    <i className="fas fa-bug opacity-80"></i>
                </a>
                <a href="/saved" className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">My Saved Ads</span>
                    <i className="far fa-heart opacity-80"></i>
                </a>
                <a href="/blog" className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">Blog</span>
                    <i className="far fa-newspaper opacity-80"></i>
                </a>
                <a href="/login" className="w-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-between hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                    <span className="flex-1 text-center">Login</span>
                    <i className="fas fa-lock opacity-80"></i>
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

const ClassifiedsBrowsePage: React.FC<ClassifiedsPageProps> = ({
    ads = [],
    categories = [],
    topCategories = [],
    pagination = {
        currentPage: 1,
        totalItems: 0,
        perPage: 9,
        totalPages: 1,
    },
    selectedCategory: initialCategory = 'All Categories',
    searchTerm: initialSearchTerm = '',
    savedAdIds = []
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFilterOverlayOpen, setIsFilterOverlayOpen] = useState(false);
    const [savedAds, setSavedAds] = useState<number[]>(savedAdIds);
    const [searchInput, setSearchInput] = useState<string>(initialSearchTerm);
    const [showAgeVerification, setShowAgeVerification] = useState(false);
    const [isAdult, setIsAdult] = useState<boolean | null>(null);

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
    };

    // Filter ads based on age
    const filteredAds = useMemo(() => {
        if (isAdult === false) {
            return ads.filter(ad => ad.category !== 'Spa' && ad.category !== 'Girls Personal' && ad.category !== 'Boys Personal');
        }
        return ads;
    }, [ads, isAdult]);

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

    // Sync search input with prop changes
    useEffect(() => {
        setSearchInput(initialSearchTerm);
    }, [initialSearchTerm]);

    const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen(prev => !prev), []);
    const toggleFilters = useCallback(() => setIsFilterOverlayOpen(prev => !prev), []);

    const handleClearSearch = useCallback(() => {
        setSearchInput('');
        router.get('/', {
            category: initialCategory === 'All Categories' ? undefined : initialCategory,
            page: 1,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    }, [initialCategory]);

    const handlePaginate = useCallback((pageNumber: number, category: string, search: string = '') => {
        router.get('/', {
            category: category === 'All Categories' ? undefined : category,
            page: pageNumber,
            search: search || undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, []);

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
            }, {
                preserveState: true,
                preserveScroll: false,
            });
        }
    }, [searchInput]);

    const handleSearch = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', {
            category: initialCategory === 'All Categories' ? undefined : initialCategory,
            page: 1,
            search: searchInput.trim() || undefined,
        }, {
            preserveState: true,
            preserveScroll: false,
        });
    }, [searchInput, initialCategory]);

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
            {(hasVipAds || hasPremiumAds) && (
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
                            <a href="/saved-ads" className="text-gray-700 hover:text-primary-pink transition-colors relative">
                                Saved Ads
                                {savedAds.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {savedAds.length}
                                    </span>
                                )}
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
                            <a href="/" className="block py-2 text-gray-700">Browse</a>
                            <a href="/saved-ads" className="block py-2 text-gray-700 relative">
                                Saved Ads
                                {savedAds.length > 0 && (
                                    <span className="ml-2 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5">
                                        {savedAds.length}
                                    </span>
                                )}
                            </a>
                            <a href="/terms-and-conditions" className="block py-2 text-gray-700">Terms & Conditions</a>
                        </div>
                    </div>
                )}
            </header>

            {/* Search Section (Kept the same) */}
            <section className="bg-white py-8 shadow-sm">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="relative mb-6">
                        <input
                            type="text"
                            placeholder="Search for anything..."
                            value={searchInput}
                            onChange={handleSearchChange}
                            className="w-full px-6 py-4 pr-24 text-lg border-2 border-gray-300 rounded-xl focus:outline-none transition-colors focus:border-pink-500"
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                            {searchInput && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Clear search"
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            )}
                            <button
                                type="submit"
                                className="text-white px-6 py-2 rounded-lg transition-colors hover:bg-pink-500"
                                style={{ backgroundColor: PRIMARY_PINK }}
                            >
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
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
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900">Latest Ads in {initialCategory}</h2>
                            <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-600">{filteredAds.length} results</span>
                                <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-sm focus:border-light-blue" style={{ borderColor: LIGHT_BLUE }}>
                                    <option>Sort by: Latest</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                </select>
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
                            totalItems={filteredAds.length}
                            currentPage={pagination.currentPage}
                            paginate={(page) => handlePaginate(page, initialCategory, searchInput)}
                        />
                    </main>
                </div>
            </div>

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
