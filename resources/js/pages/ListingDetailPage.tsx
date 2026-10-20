import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { router, Head } from '@inertiajs/react';
import VoiceNotePlayer from '../components/VoiceNotePlayer';

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
    isPlatinum?: boolean;
    hasCashBackGuarantee: boolean;
    isSaved: boolean;
    phone_number: string | null;
    whatsapp_number: string | null;
    telegram_number: string | null;
    voice_note_url?: string | null;
    voice_note_text?: string | null;
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
    isPlatinum?: boolean;
    hasCashBackGuarantee: boolean;
    voice_note_url?: string | null;
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
    const isPlatinum = ad.isPlatinum || false;
    const hasCashBackGuarantee = ad.hasCashBackGuarantee || false;

    // Use images array if available and not empty, otherwise fallback to imgSrc wrapped in array
    const displayImages = ad.images && ad.images.length > 0 ? ad.images : [ad.imgSrc || '/placeholder-image.jpg'];

    return (
        <a href={`/ad/${ad.id}`} className="block">
            {isVip ? (
                <div className="relative rounded-xl p-[2px] vip-gold-animated-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative rounded-xl bg-gradient-to-br from-amber-50 via-yellow-50 to-amber-100 overflow-hidden h-full" style={{ zIndex: 10 }}>
                        <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 border border-emerald-400/40">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Online Today</span>
                        </div>
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                            <i className="fas fa-crown text-[9px]"></i>
                            <span>VIP</span>
                        </div>
                        <div className="relative h-32 w-full">
                            <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                                <i className="fas fa-camera text-[8px] text-pink-400"></i>
                                <span>{displayImages.length}</span>
                            </div>
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
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-base sm:text-lg font-bold text-amber-600">Rs {ad.price.toLocaleString()}</p>
                                <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    <i className="fas fa-star text-amber-500 text-[8px]"></i> Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : isPremium ? (
                <div className="relative rounded-xl p-[2px] premium-pink-animated-border hover:shadow-lg transition-all duration-300 cursor-pointer">
                    <div className="relative rounded-xl bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 overflow-hidden h-full" style={{ zIndex: 10 }}>
                        <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 border border-emerald-400/40">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span>Online Today</span>
                        </div>
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1">
                            <i className="fas fa-star text-[9px]"></i>
                            <span>Premium</span>
                        </div>
                        <div className="relative h-32 w-full">
                            <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                                <i className="fas fa-camera text-[8px] text-pink-400"></i>
                                <span>{displayImages.length}</span>
                            </div>
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
                            <div className="flex items-center justify-between mt-1">
                                <p className="text-base sm:text-lg font-bold" style={{ color: VIP_PINK }}>Rs {ad.price.toLocaleString()}</p>
                                <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                    <i className="fas fa-star text-amber-500 text-[8px]"></i> Verified
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="relative bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                    <div className="absolute top-2 left-2 z-10 bg-black/75 backdrop-blur-xs text-white px-2 py-0.5 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 border border-emerald-400/40">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span>Online Today</span>
                    </div>
                    {hasCashBackGuarantee && (
                        <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                            <i className="fas fa-shield-alt text-xs"></i>
                        </div>
                    )}
                    <div className="relative h-32 w-full">
                        <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/70 backdrop-blur-xs text-white px-1.5 py-0.5 rounded text-[9px] font-bold flex items-center gap-1">
                            <i className="fas fa-camera text-[8px] text-pink-400"></i>
                            <span>{displayImages.length}</span>
                        </div>
                        <AdImageCarousel
                            images={displayImages}
                            title={ad.title}
                            className="object-cover"
                            isVipOrPremium={false}
                        />
                    </div>
                    <div className="p-3">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">{ad.title}</h3>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-base sm:text-lg font-bold" style={{ color: PRIMARY_PINK }}>Rs {ad.price.toLocaleString()}</p>
                            <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-800 border border-amber-300 px-1.5 py-0.5 rounded-full text-[9px] font-bold">
                                <i className="fas fa-star text-amber-500 text-[8px]"></i> Verified
                            </span>
                        </div>
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
    const [isZoomed, setIsZoomed] = useState(false);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [liveViewers, setLiveViewers] = useState<number>(() => 9 + (ad.id % 11));
    const activeMinsAgo = useMemo(() => (ad.id % 6) + 2, [ad.id]);
    const [contactedTodayCount, setContactedTodayCount] = useState<number>(() => {
        const base = 11 + (ad.id % 14);
        try {
            const raw = localStorage.getItem('tintinads_contact_clicks');
            const parsed = raw ? JSON.parse(raw) : {};
            return base + (Number(parsed[ad.id]) || 0);
        } catch {
            return base;
        }
    });

    const incrementContactCount = useCallback(() => {
        setContactedTodayCount((prev) => prev + 1);
        try {
            const raw = localStorage.getItem('tintinads_contact_clicks');
            const parsed = raw ? JSON.parse(raw) : {};
            parsed[ad.id] = (Number(parsed[ad.id]) || 0) + 1;
            localStorage.setItem('tintinads_contact_clicks', JSON.stringify(parsed));
        } catch {
            // ignore
        }
    }, [ad.id]);

    // Check age verification and save to recently viewed on mount
    useEffect(() => {
        const ageVerified = localStorage.getItem('ageVerified');
        if (ageVerified === null) {
            setShowAgeVerification(true);
        } else {
            setIsAdult(ageVerified === 'true');
        }

        // Save current ad to recently viewed in localStorage
        try {
            const raw = localStorage.getItem('tintinads_recently_viewed');
            const existing = raw ? JSON.parse(raw) : [];
            const currentEntry = {
                id: ad.id,
                title: ad.title,
                price: ad.price,
                location: ad.location || 'Sri Lanka',
                imgSrc: (ad.images && ad.images[0]) || '/placeholder-image.jpg',
                isVip: ad.isVip,
                isPremium: ad.isPremium,
                isPlatinum: ad.isPlatinum,
            };
            const filtered = Array.isArray(existing)
                ? existing.filter((item: { id: number }) => item && item.id !== ad.id)
                : [];
            const updated = [currentEntry, ...filtered].slice(0, 8);
            localStorage.setItem('tintinads_recently_viewed', JSON.stringify(updated));
        } catch {
            // ignore storage errors
        }
    }, [ad.id, ad.title, ad.price, ad.location, ad.images, ad.isVip, ad.isPremium, ad.isPlatinum]);

    // Fluctuate live viewers count gently every 5 seconds for real-time FOMO feel
    useEffect(() => {
        const timer = setInterval(() => {
            setLiveViewers((prev) => {
                const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
                return Math.min(26, Math.max(7, prev + delta));
            });
        }, 5000);
        return () => clearInterval(timer);
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
        setIsZoomed(false);
        setCurrentImageIndex((prev) => (prev + 1) % totalImages);
    };

    const prevImage = () => {
        setIsZoomed(false);
        setCurrentImageIndex((prev) => (prev - 1 + totalImages) % totalImages);
    };

    const selectThumbnail = (index: number) => {
        setIsZoomed(false);
        setCurrentImageIndex(index);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isZoomed) return;
        setTouchStartX(e.touches[0].clientX);
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (isZoomed || touchStartX === null || totalImages <= 1) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 40) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
        setTouchStartX(null);
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
        const adUrl = typeof window !== 'undefined' ? window.location.href : `https://tintinads.com/ad/${ad.id}`;
        const shareText = `🌟 *${ad.title}*\n💰 *මිල:* Rs ${ad.price.toLocaleString()}\n📍 *ස්ථානය:* ${ad.location || 'Sri Lanka'}\n📞 *අමතන්න:* ${ad.phone_number || ''}\n\n👉 *සම්පූර්ණ ඡායාරූප සහ විස්තර බලන්න:* \n${adUrl}\n\n🔥 *TinTin VIP Telegram:*\nhttps://tintinads.com/vip`;
        if (navigator.share) {
            navigator.share({
                title: `${ad.title} - TinTinAds`,
                text: shareText,
                url: adUrl,
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(shareText);
            alert('දැන්වීමේ සවිස්තරාත්මක Link එක Copied! ඔබට දැන් WhatsApp හෝ Facebook හි Paste කළ හැක.');
        }
    };

    const renderContactCard = () => {
        const cleanWaDigits = (ad.whatsapp_number || ad.phone_number || '94700000000').replace(/[^0-9]/g, '');
        const formattedWaDigits = cleanWaDigits.startsWith('0') ? '94' + cleanWaDigits.slice(1) : cleanWaDigits;

        const whatsappText = encodeURIComponent(`Hi, I saw your ad on TinTinAds.com: ${ad.title} (https://tintinads.com/ad/${ad.id})`);
        const waUrl = `https://wa.me/${formattedWaDigits}?text=${whatsappText}`;

        const quickIcebreakers = [
            {
                label: '👋 "Hi, දැන් Available ද?"',
                msg: `Hi! 👋 මම ඔබගේ "${ad.title}" දැන්වීම TinTinAds.com එකෙන් දැක්කේ. දැන් Available ද?\nhttps://tintinads.com/ad/${ad.id}`,
            },
            {
                label: '📍 "Location එක සහ විස්තර එවන්න"',
                msg: `Hi! 📍 මම ඔබගේ "${ad.title}" දැන්වීම TinTinAds.com එකෙන් දැක්කේ. කරුණාකර Location එක සහ විස්තර එවන්න පුළුවන්ද?\nhttps://tintinads.com/ad/${ad.id}`,
            },
            {
                label: '💰 "පැකේජ සහ ගාස්තු විස්තර එවන්න"',
                msg: `Hi! 💰 මම ඔබගේ "${ad.title}" දැන්වීම TinTinAds.com එකෙන් දැක්කේ. පැකේජ සහ ගාස්තු විස්තර දැනගන්න පුළුවන්ද?\nhttps://tintinads.com/ad/${ad.id}`,
            },
        ];

        const shareAdWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`🌟 *${ad.title}*\n💰 *මිල:* Rs ${ad.price.toLocaleString()}\n📍 *ස්ථානය:* ${ad.location || 'Sri Lanka'}\n📞 *අමතන්න:* ${ad.phone_number || ''}\n\n👉 *සම්පූර්ණ ඡායාරූප සහ විස්තර බලන්න:* \nhttps://tintinads.com/ad/${ad.id}\n\n🔥 *TinTin VIP Telegram:*\nhttps://tintinads.com/vip`)}`;

        return (
            <div className="bg-white rounded-xl shadow-sm p-5 sm:p-6 mb-6 border border-gray-100">
                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2.5">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-2xs">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        Online Today
                    </span>
                    <span className="inline-flex items-center gap-1 bg-gradient-to-r from-amber-50 to-yellow-100 text-amber-800 border border-amber-300 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-2xs">
                        <i className="fas fa-star text-amber-500 text-[10px]"></i>
                        Verified Ad
                    </span>
                    <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200 px-2.5 py-1 rounded-full text-[11px] font-extrabold shadow-2xs">
                        <i className="fas fa-bolt text-amber-500 text-[10px]"></i>
                        Active {activeMinsAgo}m ago
                    </span>
                </div>

                {/* Fast Responder Indicator */}
                <div className="mb-3 bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-3 py-1.5 flex items-center gap-2 text-[11px] sm:text-xs font-bold text-emerald-900">
                    <i className="fas fa-bolt text-amber-500 text-xs flex-shrink-0"></i>
                    <span>⚡ Fast Responder — සාමාන්‍යයෙන් විනාඩි 5ක් ඇතුළත පිළිතුරු ලබා දෙයි</span>
                </div>

                <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">{ad.title}</h1>
                    <div className="text-purple-600 text-sm mt-1" title="Verified Ad">
                        <i className="fas fa-check-circle"></i>
                    </div>
                </div>
                
                <div className="flex items-center text-xs font-medium text-gray-500 mb-3 space-x-4">
                    <span className="flex items-center text-blue-600"><i className="far fa-thumbs-up mr-1 text-blue-500"></i> {likesCount} Likes</span>
                    <span><i className="far fa-clock mr-1"></i> {ad.time}</span>
                </div>

                <div className="text-3xl sm:text-4xl font-black mb-4 text-pink-600 tracking-tight">
                    Rs {ad.price.toLocaleString()}
                </div>

                {/* Live Viewers FOMO Indicator */}
                <div className="mb-2.5 bg-gradient-to-r from-red-50 via-rose-50 to-orange-50 border border-red-200/90 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xs">
                    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                    </span>
                    <p className="text-xs sm:text-[13px] font-bold text-red-900 leading-snug">
                        🔥 මේ මොහොතේ <span className="text-[#E50914] font-black underline">{liveViewers} දෙනෙක්</span> මෙම දැන්වීම නරඹමින් සිටී
                        <span className="block text-[10px] sm:text-[11px] font-semibold text-red-600/80">
                            ({liveViewers} people viewing right now)
                        </span>
                    </p>
                </div>

                {/* Today's Contact Social Proof Counter */}
                <div className="mb-4 bg-amber-50/90 border border-amber-200 rounded-xl px-3.5 py-2 flex items-center gap-2 text-xs font-extrabold text-amber-900 shadow-2xs">
                    <i className="fas fa-phone-volume text-amber-600 animate-pulse flex-shrink-0"></i>
                    <span>
                        📞 අද දින පුද්ගලයන් <span className="text-[#E50914] font-black underline">{contactedTodayCount} දෙනෙක්</span> මෙම අංකයට සම්බන්ධ වී ඇත!
                    </span>
                </div>

                {/* Authentic Sinhala AI Voice Note Player */}
                <VoiceNotePlayer
                    audioUrl={ad.voice_note_url}
                    spokenText={ad.voice_note_text}
                    category={ad.category}
                    title={ad.title}
                />

                {/* Main Action Buttons */}
                <div className="space-y-3">
                    {ad.phone_number ? (
                        <a
                            href={`tel:${ad.phone_number}`}
                            onClick={incrementContactCount}
                            className="w-full bg-[#E50914] hover:bg-red-700 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
                        >
                            <i className="fas fa-phone-alt"></i>
                            CALL NOW
                        </a>
                    ) : (
                        <a
                            href="tel:0700000000"
                            onClick={incrementContactCount}
                            className="w-full bg-[#E50914] hover:bg-red-700 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
                        >
                            <i className="fas fa-phone-alt"></i>
                            CALL NOW
                        </a>
                    )}

                    <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={incrementContactCount}
                        className="w-full bg-[#25D366] hover:bg-green-600 text-white text-lg font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all shadow-sm hover:shadow-md"
                    >
                        <i className="fab fa-whatsapp text-xl"></i>
                        WHATSAPP
                    </a>

                    {/* One-Tap WhatsApp Icebreaker Quick Message Chips */}
                    <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3">
                        <div className="text-[11px] sm:text-xs font-extrabold text-emerald-900 mb-2 flex items-center gap-1.5">
                            <i className="fab fa-whatsapp text-emerald-600 text-sm"></i>
                            <span>ටයිප් නොකර එක ක්ලික් එකකින් WhatsApp යවන්න:</span>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            {quickIcebreakers.map((chip, idx) => (
                                <a
                                    key={idx}
                                    href={`https://wa.me/${formattedWaDigits}?text=${encodeURIComponent(chip.msg)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={incrementContactCount}
                                    className="w-full bg-white hover:bg-emerald-600 text-emerald-900 hover:text-white border border-emerald-300 hover:border-emerald-600 rounded-lg px-3 py-2 text-xs font-extrabold flex items-center justify-between transition-all shadow-2xs group"
                                >
                                    <span>{chip.label}</span>
                                    <i className="fas fa-paper-plane text-[10px] text-emerald-500 group-hover:text-white transition-colors"></i>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* 100% Private & Direct Contact Reassurance Badge */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 flex items-start gap-2.5">
                        <i className="fas fa-lock text-emerald-600 text-sm mt-0.5 flex-shrink-0"></i>
                        <p className="text-[11px] sm:text-xs text-slate-700 font-semibold leading-snug">
                            <strong className="text-slate-900">🔒 100% පෞද්ගලික සහ රහසිගතයි (Private & Direct):</strong> ඔබ කෙලින්ම සම්බන්ධ වන්නේ දැන්වීම් හිමිකරු සමඟ පමණි. ඔබගේ තොරතුරු කිසිවක් සටහන් නොවේ.
                        </p>
                    </div>

                    {/* Multi-Platform Social Media Share Hub */}
                    <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-purple-50/70 border-2 border-indigo-200 rounded-2xl p-4 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs sm:text-sm font-extrabold text-gray-900 flex items-center gap-2">
                                <i className="fas fa-share-nodes text-indigo-600 text-base"></i>
                                <span>මෙම දැන්වීම Social Media වල Share කරන්න:</span>
                            </span>
                            <span className="text-[10px] bg-indigo-100 text-indigo-800 font-extrabold px-2 py-0.5 rounded-full">1-Click Share</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {/* Facebook Share */}
                            <button 
                                type="button"
                                onClick={() => {
                                    const adUrl = typeof window !== 'undefined' ? window.location.href : `https://tintinads.com/ad/${ad.id}`;
                                    const shareText = `🌟 *${ad.title}*\n💰 *මිල:* Rs ${ad.price.toLocaleString()}\n📍 *ස්ථානය:* ${ad.location || 'Sri Lanka'}\n📞 *අමතන්න:* ${ad.phone_number || ''}\n\n👉 *සම්පූර්ණ ඡායාරූප සහ විස්තර බලන්න:* \n${adUrl}\n\n🔥 *TinTin VIP Telegram:*\nhttps://tintinads.com/vip`;
                                    navigator.clipboard.writeText(shareText);
                                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(adUrl)}`, '_blank', 'noopener,noreferrer,width=600,height=550');
                                }}
                                className="bg-[#1877F2] hover:bg-blue-700 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-black shadow-xs transition transform hover:scale-102 active:scale-95 cursor-pointer"
                                title="Share on Facebook"
                            >
                                <i className="fab fa-facebook text-base"></i>
                                <span>Facebook</span>
                            </button>

                            {/* Messenger Share */}
                            <button
                                type="button"
                                onClick={() => {
                                    const adUrl = `https://tintinads.com/ad/${ad.id}`;
                                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                                    if (isMobile) {
                                        window.location.href = `fb-messenger://share/?link=${encodeURIComponent(adUrl)}`;
                                    } else {
                                        window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(adUrl)}&app_id=291494419107518&redirect_uri=${encodeURIComponent(adUrl)}`, '_blank');
                                    }
                                }}
                                className="bg-gradient-to-r from-[#00B2FF] to-[#006AFF] hover:opacity-90 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-black shadow-xs transition transform hover:scale-102 active:scale-95 cursor-pointer"
                                title="Send on Messenger"
                            >
                                <i className="fab fa-facebook-messenger text-base"></i>
                                <span>Messenger</span>
                            </button>

                            {/* WhatsApp Share */}
                            <a 
                                href={shareAdWaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] hover:bg-green-600 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-black shadow-xs transition transform hover:scale-102 active:scale-95"
                                title="Share on WhatsApp"
                            >
                                <i className="fab fa-whatsapp text-base"></i>
                                <span>WhatsApp</span>
                            </a>

                            {/* Telegram Share */}
                            <a 
                                href={`https://t.me/share/url?url=${encodeURIComponent(`https://tintinads.com/ad/${ad.id}`)}&text=${encodeURIComponent(`🔥 ${ad.title} (Rs ${ad.price.toLocaleString()} | ${ad.location || 'Sri Lanka'})\n👉 විස්තර බලන්න:`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#229ED9] hover:bg-sky-600 text-white rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-black shadow-xs transition transform hover:scale-102 active:scale-95"
                                title="Share on Telegram"
                            >
                                <i className="fab fa-telegram-plane text-base"></i>
                                <span>Telegram</span>
                            </a>
                        </div>

                        {/* Facebook Paste Tip Banner */}
                        <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 flex items-start gap-2 text-left">
                            <i className="fab fa-facebook text-blue-600 text-sm mt-0.5 flex-shrink-0"></i>
                            <p className="text-[11px] text-blue-900 leading-snug">
                                <strong>Facebook Share උපදෙස:</strong> Facebook එකට Share කරන විට විස්තරය ස්වයංක්‍රීයව Copy වන අතර, Facebook හි Post එක තුළ <span className="bg-blue-100 text-blue-800 font-black px-1 rounded">Paste</span> කරන්න. ඡායාරූප කාඩ්පත ස්වයංක්‍රීයව දිස්වේ!
                            </p>
                        </div>

                        {/* Copy Link & Any App Native Share */}
                        <div className="flex gap-2 pt-1">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="flex-1 bg-white hover:bg-gray-100 text-gray-800 border border-gray-300 rounded-xl py-2.5 px-3 flex items-center justify-center gap-2 text-xs font-bold shadow-2xs transition cursor-pointer"
                            >
                                <i className="fas fa-copy text-indigo-600"></i>
                                <span>විස්තරය & Link එක Copy කරගන්න</span>
                            </button>
                            <button
                                type="button"
                                onClick={handleShare}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition cursor-pointer"
                                title="Share to any App"
                            >
                                <i className="fas fa-share-alt"></i>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* TinTinAds Mention Callout */}
                <div className="mt-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300/80 rounded-xl p-3.5 text-center shadow-xs">
                    <div className="flex items-center justify-center gap-1.5 text-amber-900 font-bold text-xs sm:text-sm mb-1">
                        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs">
                            <i className="fas fa-bullhorn text-[10px]"></i>
                        </span>
                        <span>කරුණාකර අමතන විට පවසන්න:</span>
                    </div>
                    <div className="bg-white border border-amber-300 py-1.5 px-3 rounded-lg inline-block shadow-xs my-1">
                        <span className="text-gray-900 font-extrabold text-xs sm:text-sm">
                            "මම මේ දැන්වීම දැක්කේ <span className="text-[#E50914] font-black underline decoration-red-400">TinTinAds.com</span> එකෙන්"
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1 font-medium">
                        (Please mention you saw this ad on <strong className="text-gray-700">TinTinAds.com</strong> when calling)
                    </p>
                </div>
            </div>
        );
    };

    const renderSafetyTips = () => (
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
    );

    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            <Head>
                <title>{`${ad.title} - TinTinAds`}</title>
                <meta name="description" content={ad.description ? ad.description.slice(0, 160).replace(/\s+/g, ' ') : `${ad.title} in ${ad.location}.`} />
                <meta property="og:title" content={`${ad.title} - TinTinAds`} />
                <meta property="og:description" content={ad.description ? ad.description.slice(0, 160).replace(/\s+/g, ' ') : ad.title} />
            </Head>

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

            {/* Full Screen Image Viewer with Interactive Zoom & Touch Swipe */}
            {isFullScreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-2 sm:p-4 select-none"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-[110]">
                        <button
                            type="button"
                            onClick={() => setIsZoomed((z) => !z)}
                            className="text-white bg-white/15 hover:bg-white/25 backdrop-blur-xs px-3 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                            <i className={`fas ${isZoomed ? 'fa-search-minus' : 'fa-search-plus'}`}></i>
                            <span>{isZoomed ? '1x Reset' : '2x Zoom'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsZoomed(false);
                                setIsFullScreen(false);
                            }}
                            className="text-white bg-white/15 hover:bg-white/25 w-10 h-10 flex items-center justify-center rounded-full transition-colors cursor-pointer"
                        >
                            <i className="fas fa-times text-xl"></i>
                        </button>
                    </div>

                    {totalImages > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-white/20 p-3 sm:p-4 rounded-full transition-colors z-[110] cursor-pointer"
                            >
                                <i className="fas fa-chevron-left text-2xl sm:text-3xl"></i>
                            </button>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-white/20 p-3 sm:p-4 rounded-full transition-colors z-[110] cursor-pointer"
                            >
                                <i className="fas fa-chevron-right text-2xl sm:text-3xl"></i>
                            </button>
                        </>
                    )}

                    <div className="w-full h-full flex items-center justify-center overflow-auto">
                        <img
                            src={ad.images[currentImageIndex] || '/placeholder-image.jpg'}
                            onClick={() => setIsZoomed((z) => !z)}
                            className={`max-h-full max-w-full object-contain transition-transform duration-300 cursor-zoom-in ${
                                isZoomed ? 'scale-150 sm:scale-200 cursor-zoom-out' : 'scale-100'
                            }`}
                            alt={ad.title}
                        />
                    </div>

                    <div className="absolute bottom-5 flex items-center gap-3 bg-black/70 backdrop-blur-xs text-white px-4 py-2 rounded-full text-xs sm:text-sm font-bold border border-white/15">
                        <span><i className="fas fa-camera text-pink-400 mr-1.5"></i>{currentImageIndex + 1} / {totalImages}</span>
                        <span className="text-emerald-400 flex items-center gap-1 border-l border-white/20 pl-3">
                            <i className="fas fa-shield-alt"></i> 100% Real Photo Checked
                        </span>
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
                        {(ad.isPlatinum || ad.isVip || ad.isPremium) && (
                            <div className={`mb-4 inline-flex items-center px-4 py-2 rounded-full text-sm font-bold shadow-lg ${ad.isPlatinum
                                ? 'bg-gradient-to-r from-slate-500 to-slate-700 text-white'
                                : ad.isVip
                                ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 text-white'
                                : 'bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500 text-white'
                                }`}>
                                <i className={`fas ${ad.isPlatinum ? 'fa-gem' : ad.isVip ? 'fa-crown' : 'fa-star'} mr-2`}></i>
                                <span>{ad.isPlatinum ? 'Platinum' : ad.isVip ? 'VIP' : 'Premium'}</span>
                            </div>
                        )}

                        {/* Image Carousel */}
                        <div
                            className={`relative bg-white rounded-xl shadow-sm overflow-hidden mb-3 select-none ${ad.isPlatinum ? 'p-[4px] platinum-silver-animated-border' : ad.isVip ? 'p-[4px] vip-gold-animated-border' :
                                ad.isPremium ? 'p-[4px] premium-pink-animated-border' : ''
                                }`}
                            onTouchStart={handleTouchStart}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className={`relative ${ad.isPlatinum || ad.isVip || ad.isPremium ? 'rounded-lg overflow-hidden' : ''}`}>
                                <img
                                    src={ad.images[currentImageIndex] || '/placeholder-image.jpg'}
                                    alt={ad.title}
                                    onClick={() => setIsFullScreen(true)}
                                    className="w-full h-[350px] sm:h-[500px] cursor-zoom-in object-contain bg-gray-50 transition-transform duration-300"
                                    onError={(e) => {
                                        e.currentTarget.src = '/placeholder-image.jpg';
                                    }}
                                />

                                {/* Top Left: Tap to Zoom Badge */}
                                <button
                                    type="button"
                                    onClick={() => setIsFullScreen(true)}
                                    className="absolute top-3 left-3 bg-black/70 hover:bg-black/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
                                >
                                    <i className="fas fa-search-plus text-pink-400"></i>
                                    <span>Tap to Zoom</span>
                                </button>

                                {/* Top Right: Photo Counter */}
                                <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md">
                                    <i className="fas fa-camera text-pink-400 text-xs"></i>
                                    <span>{currentImageIndex + 1} / {totalImages}</span>
                                </div>
                            </div>
                            {totalImages > 1 && (
                                <>
                                    <div className="absolute inset-0 flex items-center justify-between p-3 sm:p-4 pointer-events-none">
                                        <button
                                            type="button"
                                            onClick={prevImage}
                                            className="bg-white/85 hover:bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-colors pointer-events-auto cursor-pointer"
                                        >
                                            <i className="fas fa-chevron-left text-gray-800"></i>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextImage}
                                            className="bg-white/85 hover:bg-white rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shadow-lg transition-colors pointer-events-auto cursor-pointer"
                                        >
                                            <i className="fas fa-chevron-right text-gray-800"></i>
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                                        <div className="flex space-x-2 bg-black/40 px-2.5 py-1 rounded-full">
                                            {ad.images.map((_, index) => (
                                                <div
                                                    key={index}
                                                    className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-pink-400 scale-125' : 'bg-white/60'
                                                        }`}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {totalImages > 1 && (
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-3">
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
                                            className={`w-full h-[70px] sm:h-[80px] ${src?.includes('/assets/sitelogo.png') || !src
                                                ? 'object-contain bg-gray-50'
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

                        {/* 100% Real Photos Checked Trust Banner */}
                        <div className="mb-3 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-xl p-3 sm:p-3.5 flex items-center justify-between gap-3 shadow-2xs">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                                    <i className="fas fa-shield-alt text-sm sm:text-base"></i>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs sm:text-sm font-extrabold text-emerald-900 leading-tight">
                                        🛡️ TinTinAds Photo Checked — ආරක්ෂිත සහ තහවුරු කළ දැන්වීමකි
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-emerald-700 font-medium mt-0.5">
                                        💯 100% Real Photos & Active Number Checked by TinTinAds Team
                                    </p>
                                </div>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-1 bg-white text-emerald-700 border border-emerald-300 px-2.5 py-1 rounded-full text-xs font-extrabold flex-shrink-0">
                                <i className="fas fa-check-circle text-emerald-500"></i> 100% Checked
                            </span>
                        </div>

                        {/* Action Bar */}
                        <div className="bg-white text-gray-700 flex flex-col sm:flex-row items-center justify-between p-3 sm:p-4 rounded-b-lg mb-6 shadow-sm border border-gray-100 border-t-0 gap-3 sm:gap-0">
                            <div className="flex items-center justify-around w-full sm:w-auto sm:justify-start sm:space-x-6 px-2 sm:px-4 border-b border-gray-100 sm:border-0 pb-3 sm:pb-0">
                                <button onClick={handleLike} className={`flex items-center space-x-1.5 sm:space-x-2 transition-colors ${isLiked ? 'text-pink-500' : 'hover:text-pink-500 text-gray-500'}`}>
                                    <i className={`${isLiked ? 'fas' : 'far'} fa-thumbs-up text-base sm:text-lg`}></i>
                                    <span className="font-semibold text-xs sm:text-sm">{isLiked ? 'Liked' : 'Like'}</span>
                                </button>
                                <button onClick={() => handleSaveToggle(ad.id, !isSaved)} className={`flex items-center space-x-1.5 sm:space-x-2 transition-colors ${isSaved ? 'text-pink-500' : 'hover:text-pink-500 text-gray-500'}`}>
                                    <i className={`${isSaved ? 'fas' : 'far'} fa-heart text-base sm:text-lg`}></i>
                                    <span className="font-semibold text-xs sm:text-sm">{isSaved ? 'Saved' : 'Save'}</span>
                                </button>
                                <button onClick={handleShare} className="flex items-center space-x-1.5 sm:space-x-2 hover:text-pink-500 text-gray-500 transition-colors">
                                    <i className="fas fa-share-alt text-base sm:text-lg"></i>
                                    <span className="font-semibold text-xs sm:text-sm">Share</span>
                                </button>
                            </div>
                            <div className="flex items-center justify-center space-x-4 sm:pr-4 text-[11px] sm:text-sm text-gray-500 w-full sm:w-auto">
                                <span className="flex items-center"><i className="far fa-eye mr-1.5"></i> {ad.views || 0} Views</span>
                                <span className="flex items-center"><i className="far fa-thumbs-up mr-1.5"></i> {likesCount} Likes</span>
                            </div>
                        </div>

                        {/* Mobile Only: Contact Card directly under image and action bar */}
                        <div className="block lg:hidden my-6">
                            {renderContactCard()}
                        </div>

                        {/* Ad Details */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
                                {ad.description || 'No description available.'}
                            </div>

                            {/* Polite Reminder */}
                            <div className="mt-5 pt-3.5 border-t border-gray-200 flex items-center gap-2 text-xs text-gray-500">
                                <i className="fas fa-info-circle text-amber-500 text-sm flex-shrink-0"></i>
                                <span>කරුණාකර අමතන විට හෝ පණිවිඩ යැවීමේදී <strong className="text-gray-700">TinTinAds.com</strong> හරහා සම්බන්ධ වූ බව පවසන්න.</span>
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

                        {/* Mobile Only: Safety Tips */}
                        <div className="block lg:hidden mt-6">
                            {renderSafetyTips()}
                        </div>
                    </div>

                    {/* Right Column - Desktop Only Details & Contact */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="sticky top-24">
                            {renderContactCard()}
                            {renderSafetyTips()}
                        </div>
                    </div>
                </div>

                {/* Related Ads - Positioned full-width at the bottom */}
                {filteredRelatedAds.length > 0 && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Ads</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {filteredRelatedAds.map((relatedAd) => (
                                <RelatedAdCard key={relatedAd.id} ad={relatedAd} />
                            ))}
                        </div>
                    </div>
                )}
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
            <footer className="bg-white border-t border-gray-200 mt-12 py-6 sm:py-8 pb-28 lg:pb-8">
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

            {/* Mobile Floating Quick Contact Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 shadow-[0_-8px_25px_rgba(0,0,0,0.12)]">
                <div className="flex items-center justify-between gap-2.5 max-w-md mx-auto">
                    {/* Left: Price & Online Status */}
                    <div className="flex flex-col min-w-0 pr-1">
                        <div className="flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wide">Online • ⚡ 5m Reply</span>
                        </div>
                        <span className="text-base sm:text-lg font-black text-pink-600 truncate leading-tight">
                            Rs {ad.price.toLocaleString()}
                        </span>
                    </div>

                    {/* Right: Quick Call, WhatsApp & Share Buttons */}
                    <div className="flex items-center gap-1.5 flex-1 justify-end">
                        <button
                            type="button"
                            onClick={handleShare}
                            className="w-11 h-11 bg-indigo-50 hover:bg-indigo-100 active:bg-indigo-600 active:text-white border border-indigo-200 text-indigo-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xs transition active:scale-95 cursor-pointer"
                            title="Share Ad"
                        >
                            <i className="fas fa-share-nodes text-base"></i>
                        </button>
                        <a
                            href={ad.phone_number ? `tel:${ad.phone_number}` : 'tel:0700000000'}
                            onClick={incrementContactCount}
                            className="flex-1 max-w-[125px] bg-[#E50914] active:bg-red-800 text-white font-extrabold text-xs sm:text-sm py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
                        >
                            <i className="fas fa-phone-alt text-xs"></i>
                            <span>CALL NOW</span>
                        </a>
                        <a
                            href={
                                ad.whatsapp_number
                                    ? `https://wa.me/${ad.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi, I saw your ad on TinTinAds.com: ${ad.title}`)}`
                                    : `https://wa.me/94700000000?text=${encodeURIComponent(`Hi, I saw your ad on TinTinAds.com: ${ad.title}`)}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={incrementContactCount}
                            className="flex-1 max-w-[125px] bg-[#25D366] active:bg-green-700 text-white font-extrabold text-xs sm:text-sm py-3 px-2 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
                        >
                            <i className="fab fa-whatsapp text-base"></i>
                            <span>WHATSAPP</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListingDetailPage;

