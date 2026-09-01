import React, { useState, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminDashboardHome from './AdminDashboardHome';
import AgentManagementPage from './AgentManagementPage';
import SuperAdminAds from './SuperAdminAds';
import CommissionReview from './CommissionReview';
import ReportsPage from './ReportsPage';
import SettingsPage from './SettingsPage';

interface AdminDashboardProps {
    pageKey: 'home' | 'agent' | 'ads' | 'payments' | 'settings' | 'reports'; 
}

const PAGE_COMPONENTS: Record<AdminDashboardProps['pageKey'], React.FC> = {
    home: AdminDashboardHome,
    agent: AgentManagementPage,
    ads: SuperAdminAds,
    payments: CommissionReview,
    settings: SettingsPage,
    reports: ReportsPage,
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ pageKey }) => {
    
    // State for mobile sidebar visibility
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => setIsSidebarOpen(false);
    
    const CurrentPageContent = useMemo(() => PAGE_COMPONENTS[pageKey], [pageKey]);
    
    // Find header title based on pageKey
    const headerTitle = useMemo(() => {
        const item = [
            { key: 'home', title: 'System Overview' },
            { key: 'agent', title: 'Agent Management' },
            { key: 'ads', title: 'Ad Approvals' },
            { key: 'payments', title: 'Commission Payouts' },
            { key: 'settings', title: 'System Settings' },
            { key: 'reports', title: 'Reports & Analytics' },
        ].find(nav => nav.key === pageKey);
        return item ? item.title : 'Admin Portal';
    }, [pageKey]);

    return (
        <div className="bg-[#f8f9fc] min-h-screen font-sans text-gray-900 flex flex-col lg:flex-row">
            
            {/* Mobile Header Bar */}
            <div className="lg:hidden sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
                        <i className="fas fa-shield-alt text-sm"></i>
                    </div>
                    <span className="font-bold text-gray-800 text-lg">Admin Portal</span>
                </div>
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 rounded-lg bg-pink-50 text-pink-600 hover:bg-pink-100 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                    <i className="fas fa-bars text-lg"></i>
                </button>
            </div>

            {/* Sidebar Container (Fixed position for mobile translation) */}
            <div 
                className={`fixed left-0 top-0 h-full w-64 z-50 transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <AdminSidebar currentPageKey={pageKey} onNavigate={closeSidebar} />
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity" onClick={toggleSidebar}></div>
            )}

            {/* Main Content Wrapper */}
            <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300 min-h-screen">
                
                {/* Desktop Header */}
                <header className="hidden lg:flex bg-white shadow-sm border-b border-gray-100 px-8 py-4 items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{headerTitle}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                            <i className="fas fa-crown text-yellow-500"></i> Super Admin
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[70vh] overflow-hidden">
                        {CurrentPageContent ? <CurrentPageContent /> : <div className="p-6">Page not found.</div>}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
