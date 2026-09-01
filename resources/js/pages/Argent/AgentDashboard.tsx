import React, { useState, useCallback, useMemo } from 'react';
import MyAdsPage from './MyAdsPage';
// import { Link } from '@inertiajs/react'; // <<< Real Inertia Project එකකදී මෙය අවශ්‍ය වේ.

// --- Global Constants ---
const PRIMARY_PINK = '#EC4899';
const LIGHT_BLUE = '#7DD3FC';
const GRAY_600 = '#4B5563';

// --- Types for Navigation ---
type PageKey = 'home' | 'ads' | 'post' | 'payments' | 'commission';

interface NavItem {
    key: PageKey;
    title: string;
    icon: string;
    route: string; // The URL/route name Inertia would use
}

// --- Mock Components for Sub-Pages ---

const HomeContent: React.FC = () => (
    <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Dashboard Overview (Home)</h3>
        <p>This is the main KPI and Activity Feed content.</p>
    </div>
);

const MyAdsContent: React.FC = () => (
    <MyAdsPage/>
    // <div className="p-6">
    //     <h3 className="text-xl font-bold mb-4">My Ads Management</h3>
    //     <p>This page lists all active, expired, and blocked advertisements.</p>
    // </div>
);

const PostNewAdContent: React.FC = () => (
    <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Post New Ad (3-Step Form)</h3>
        <p>This is where agents submit new listings.</p>
    </div>
);

const PaymentsContent: React.FC = () => (
    <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Payment Report Submission</h3>
        <p>Agents submit commission payment proofs here.</p>
    </div>
);

const CommissionHistoryContent: React.FC = () => (
    <div className="p-6">
        <h3 className="text-xl font-bold mb-4">Commission History & Payouts</h3>
        <p>Detailed view of earned and pending commission amounts.</p>
    </div>
);

const PAGE_COMPONENTS: Record<PageKey, React.FC> = {
    home: HomeContent,
    ads: MyAdsContent,
    post: PostNewAdContent,
    payments: PaymentsContent,
    commission: CommissionHistoryContent,
};

// --- Sidebar Data ---
const NAV_ITEMS: NavItem[] = [
    // ⚠️ වැදගත්: Inertia link එකට Route name එක හෝ නිවැරදි URL path එක දිය යුතුයි.
    // ඔබට Route Name (Ex: route('agent.dashboard')) භාවිත කළ හැකි නම්, එය වඩාත් සුදුසුය.
    
    { key: 'home', title: 'Dashboard', icon: 'fas fa-home', route: '/agent/dashboard' },
    { key: 'ads', title: 'My Ads', icon: 'fas fa-ad', route: '/agent/ads' },
    { key: 'post', title: 'Post New', icon: 'fas fa-plus-circle', route: '/agent/post' },
    { key: 'payments', title: 'Payments', icon: 'fas fa-credit-card', route: '/agent/payments' },
    { key: 'commission', title: 'Commission', icon: 'fas fa-percentage', route: '/agent/commission' },
];

// --- Main Agent Dashboard Component ---

const AgentDashboard: React.FC = () => {
    // 1. State to simulate Inertia page routing
    const [currentPage, setCurrentPage] = useState<PageKey>('home');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = useCallback(() => setIsSidebarOpen(prev => !prev), []);
    
    // Function to handle link clicks (Simulating Inertia navigation)
    const handleNavigation = (key: PageKey) => {
        setCurrentPage(key);
        setIsSidebarOpen(false); // Close sidebar on mobile after navigation
        
        // In a REAL Inertia app, you would use:
        // Inertia.get(NAV_ITEMS.find(i => i.key === key)!.route);
    };

    const CurrentPageContent = PAGE_COMPONENTS[currentPage];

    return (
        <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
            {/* Mobile Menu Button */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button onClick={toggleSidebar} className="p-2 rounded-lg shadow-lg" style={{ backgroundColor: LIGHT_BLUE, color: 'white' }}>
                    <i className="fas fa-bars text-lg"></i>
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div 
                id="sidebar" 
                className={`fixed left-0 top-0 h-full w-64 shadow-xl z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ backgroundColor: LIGHT_BLUE }}
            >
                <div className="p-6">
                    <div className="flex items-center mb-8">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                            <i className="fas fa-user-tie text-lg" style={{ color: LIGHT_BLUE }}></i>
                        </div>
                        <h1 className="text-xl font-bold text-white">Agent Portal</h1>
                    </div>
                    
                    <nav className="space-y-2">
                        {NAV_ITEMS.map((item) => (
                            // 2. Inertia Link Component Usage
                            <a 
                                // Replace with <Link href={item.route} onClick={() => handleNavigation(item.key)} ...> in real Inertia app
                                key={item.key}
                                onClick={() => handleNavigation(item.key)}
                                href={item.route} // Fallback href
                                className={`flex items-center px-4 py-3 text-white rounded-lg transition-colors cursor-pointer ${
                                    item.key === currentPage ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                                }`}
                            >
                                <i className={`${item.icon} mr-3`}></i>
                                {item.title}
                            </a>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Main Content Area */}
            {/* Conditional margin to push content when sidebar is open on desktop */}
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 ml-0' : 'lg:ml-64 ml-0'}`}>
                
                {/* Header (Simplified) */}
                <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">{NAV_ITEMS.find(i => i.key === currentPage)?.title}</h2>
                    <p className="text-gray-600 mt-1">Status: {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)} View</p>
                </header>

                {/* Main Content Rendered Here (Simulating Inertia Page Load) */}
                <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 min-h-[60vh]">
                        <CurrentPageContent />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AgentDashboard;