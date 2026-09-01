// resources/js/Pages/Agent/AgentDashboard.tsx (à¶´à·à¶»à¶«à·’ à¶±à¶¸ à·€à·™à¶±à·”à·€à¶§ à¶¸à·™à¶º Layout à¶‘à¶š à¶½à·™à·ƒ à¶·à·à·€à·’à¶­à· à¶šà¶»à¶¸à·”)

import React, { useState, useMemo } from 'react';
import AgentSidebar from './AgentSidebar'; // Sidebar component à¶‘à¶š import à¶šà¶»à¶±à·Šà¶±
import MyAdsPage from './MyAdsPage';
import PostNewAd from './PostNewAd';
import MainDash from './MainDash';
import PaymentReportForm from './PaymentReportForm';
import CommissionHistory from './CommissionHistory';
import MyProfile from './MyProfile';

// --- Mock Content Components (à¶´à·à¶»à¶«à·’ à¶šà·šà¶­à¶ºà·™à¶±à·Š) ---
const HomeContent: React.FC = () => (<div className="p-6"><h3 className="text-xl font-bold mb-4">Dashboard Overview</h3><p>Main Home Content.</p></div>);
const MyAdsContent: React.FC = () => (<div className="p-6"><h3 className="text-xl font-bold mb-4">My Ads Management</h3><p>Advertisements list content.</p></div>);
const PostNewAdContent: React.FC = () => (<div className="p-6"><h3 className="text-xl font-bold mb-4">Post New Ad</h3><p>New ad creation form.</p></div>);
const PaymentsContent: React.FC = () => (<div className="p-6"><h3 className="text-xl font-bold mb-4">Payment Report Form</h3><p>Payment submission details.</p></div>);
const CommissionHistoryContent: React.FC = () => (<div className="p-6"><h3 className="text-xl font-bold mb-4">Commission History</h3><p>Payouts and history content.</p></div>);

const PAGE_COMPONENTS: Record<string, React.FC> = {
    // Support both 'home' and 'mainhome' keys (backend sometimes uses 'mainhome')
    home: MainDash,
    mainhome: MainDash,
    ads: () => null,
    post: () => null,
};
interface NavItem {
    key: string; // The pageKey used in the backend (e.g., 'ads', 'commission')
    title: string;
    icon: string;
    routePath: string; // The URL/route name Inertia would use (e.g., '/agent/ads')
}
const NAV_ITEMS: NavItem[] = [
    { key: 'mainhome', title: 'Dashboard', icon: 'fas fa-home', routePath: '/agent/mainhome' },
    { key: 'ads', title: 'My Ads', icon: 'fas fa-ad', routePath: '/agent/ads' },
    { key: 'post', title: 'Post New', icon: 'fas fa-plus-circle', routePath: '/agent/post' },
    { key: 'payments', title: 'Payments', icon: 'fas fa-credit-card', routePath: '/agent/payments' },
    { key: 'commission', title: 'Commission', icon: 'fas fa-percentage', routePath: '/agent/commission' },
];

// --- Props Type ---
interface PostAdDataProps {
    commonCategories: { id: number; name: string }[];
    listingCategories: { id: number; name: string; price?: string | number | null }[];
    subCategories: { id: number; name: string }[];
    ad?: any;
    isEditing?: boolean;
}

interface AdsDataProps {
    ads: {
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
    }[];
}

interface PaymentDataProps {
    adOptions: {
        id: number;
        code: string | null;
        title: string;
    }[];
    priceOptions: {
        id: number;
        name: string;
        price: string;
    }[];
}

interface CommissionDataProps {
    transactions: {
        id: string;
        date: string;
        clientId: string;
        paidAmount: number;
        commissionRate: number;
        earnedAmount: number;
        status: string;
    }[];
    totalCommissionEarned: number;
}

interface ProfileDataProps {
    userData: {
        id: number;
        name: string;
        email: string;
        profile_picture?: string | null;
        created_at: string;
        updated_at: string;
    };
}

interface AgentDashboardProps {
    // Inertia Props à¶¸à¶Ÿà·’à¶±à·Š backend à¶‘à¶šà·™à¶±à·Š à¶½à·à¶¶à·™à¶± key à¶‘à¶š
    // NOTE: backend may send 'mainhome' in some routes â€” accept it here.
    pageKey: 'home' | 'mainhome' | 'ads' | 'post' | 'payments' | 'commission' | 'profile';
    postAdData?: PostAdDataProps;
    adsData?: AdsDataProps;
    paymentData?: PaymentDataProps;
    commissionData?: CommissionDataProps;
    profileData?: ProfileDataProps;
}

const AgentDashboardLayout: React.FC<AgentDashboardProps> = ({ pageKey, postAdData, adsData, paymentData, commissionData, profileData }) => {

    // Mobile sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

    // Normalize pageKey so both 'home' and 'mainhome' resolve to the same content
    const normalizedForContent = pageKey === 'mainhome' ? 'home' : pageKey;

    // Sidebar expects the 'mainhome' key for highlighting; convert when necessary
    const sidebarActiveKey = pageKey === 'home' ? 'mainhome' : pageKey;

    const renderedContent = useMemo(() => {
        if (normalizedForContent === 'post') {
            const fallback = postAdData ?? { commonCategories: [], listingCategories: [], subCategories: [] };
            return <PostNewAd {...fallback} />;
        }

        if (normalizedForContent === 'ads') {
            const fallback = adsData ?? { ads: [] };
            return <MyAdsPage {...fallback} />;
        }

        if (normalizedForContent === 'payments') {
            const fallback = paymentData ?? { adOptions: [], priceOptions: [] };
            return <PaymentReportForm {...fallback} />;
        }

        if (normalizedForContent === 'commission') {
            const fallback = commissionData ?? { transactions: [], totalCommissionEarned: 0 };
            return <CommissionHistory {...fallback} />;
        }

        if (normalizedForContent === 'profile') {
            if (!profileData?.userData) {
                return <div className="p-6">Loading profile data...</div>;
            }
            return <MyProfile {...profileData} />;
        }

        const Component = PAGE_COMPONENTS[normalizedForContent];
        return Component ? <Component /> : null;
    }, [normalizedForContent, postAdData, adsData, paymentData, commissionData, profileData]);

        return (
        <div className="bg-[#f8f9fc] min-h-screen font-sans text-gray-900 flex flex-col lg:flex-row">

            {/* Mobile Header Bar */}
            <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <img src="/build/assets/siteicon.png" alt="Logo" className="h-8 w-auto mr-2" />
                    <span className="font-bold text-gray-800 text-lg">Agent Portal</span>
                </div>
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    <i className="fas fa-bars text-lg"></i>
                </button>
            </div>

            {/* Sidebar Container (Fixed and Hidden on mobile by default) */}
            <div
                className={`fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                <AgentSidebar
                    currentPageKey={sidebarActiveKey}
                    toggleSidebar={toggleSidebar}
                />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={toggleSidebar}></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300 min-h-screen">
                
                {/* Desktop Header */}
                <header className="hidden lg:flex bg-white shadow-sm border-b border-gray-100 px-8 py-4 items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 capitalize">{sidebarActiveKey === 'mainhome' ? 'Dashboard' : sidebarActiveKey}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                            <i className="fas fa-user-circle text-gray-400"></i> Agent
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[70vh] overflow-hidden">
                        {renderedContent}
                    </div>
                </main>
            </div>
        </div>
    );
};

// Inertia à¶¸à¶Ÿà·’à¶±à·Š render à¶šà·’à¶»à·“à¶¸à¶§ Dashboard component à¶‘à¶š export à¶šà¶»à¶±à·Šà¶±
export default AgentDashboardLayout;
