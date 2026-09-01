import React from 'react';
import { Link, router } from '@inertiajs/react';

interface NavItem {
    key: string; 
    title: string;
    icon: string;
    routePath: string;
}

const NAV_ITEMS: NavItem[] = [
    { key: 'home', title: 'Dashboard Overview', icon: 'fas fa-chart-pie', routePath: '/admin/dashboard' },
    { key: 'ads', title: 'Ad Approvals', icon: 'fas fa-check-circle', routePath: '/admin/ads' },
    { key: 'payments', title: 'Commission Payouts', icon: 'fas fa-hand-holding-usd', routePath: '/admin/payments' },
    { key: 'agent', title: 'Agent Management', icon: 'fas fa-user-tie', routePath: '/admin/agents' },
    { key: 'reports', title: 'Reports & Analytics', icon: 'fas fa-chart-bar', routePath: '/admin/reports' },
    { key: 'settings', title: 'System Settings', icon: 'fas fa-cog', routePath: '/admin/settings' },
];

interface AdminSidebarProps {
    currentPageKey: string; 
    onNavigate?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentPageKey, onNavigate }) => {
    const handleNavigate = () => {
        if (onNavigate) {
            onNavigate();
        }
    };

    const handleLogout = () => {
        router.post('/admin/logout');
    };

    return (
        <aside className="h-full bg-white border-r border-gray-100 flex flex-col shadow-sm">
            {/* Logo Area */}
            <div className="h-16 flex items-center px-6 border-b border-gray-50 shrink-0">
                <Link href="/admin/dashboard" className="flex items-center gap-3 w-full" onClick={handleNavigate}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-md">
                        <i className="fas fa-shield-alt text-sm"></i>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent tracking-tight">
                        Admin Portal
                    </span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 no-scrollbar">
                <div className="space-y-1">
                    {NAV_ITEMS.map((item) => {
                        const isActive = item.key === currentPageKey;
                        return (
                            <Link
                                key={item.key}
                                href={item.routePath}
                                onClick={handleNavigate}
                                className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 shadow-sm border border-pink-100/50'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                                    isActive 
                                        ? 'bg-white text-pink-600 shadow-sm' 
                                        : 'bg-gray-50 text-gray-400 group-hover:bg-white group-hover:shadow-sm group-hover:text-pink-500'
                                }`}>
                                    <i className={item.icon}></i>
                                </div>
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-gray-50 shrink-0">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;