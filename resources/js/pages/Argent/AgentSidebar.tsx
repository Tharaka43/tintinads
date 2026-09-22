// resources/js/Pages/Agent/AgentSidebar.tsx

import { Link, router } from '@inertiajs/react';
import React from 'react';
// සැබෑ Inertia project එකකදී, @inertiajs/react වෙතින් Link import කරන්න
// import { Link } from '@inertiajs/react'; 

const LIGHT_BLUE = '#7DD3FC';

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
    { key: 'profile', title: 'My Profile', icon: 'fas fa-user', routePath: '/agent/profile' },
];

interface AgentSidebarProps {
    // Backend route එකෙන් ලැබෙන වත්මන් active page එකේ key එක.
    currentPageKey: string; 
    
    // Sidebar එක close/open කිරීමේ handler එක (mobile සඳහා)
    toggleSidebar: () => void; 
}

const AgentSidebar: React.FC<AgentSidebarProps> = ({ currentPageKey, toggleSidebar }) => {

    const handleLogout = () => {
        router.post('/agent/logout');
    };

    return (
        <div 
            id="sidebar" 
            className="h-full w-64 shadow-xl p-6 flex flex-col"
            style={{ backgroundColor: LIGHT_BLUE }}
        >
            <div className="flex items-center mb-8">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-3">
                    <i className="fas fa-user-tie text-lg" style={{ color: LIGHT_BLUE }}></i>
                </div>
                <h1 className="text-xl font-bold text-white">Agent Portal</h1>
                {/* Mobile close button (විකල්ප) */}
                <button onClick={toggleSidebar} className="lg:hidden ml-auto text-white p-2">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            
            <nav className="space-y-2 flex-1">
                {NAV_ITEMS.map((item) => (
                    <Link 
                        key={item.key}
                        href={item.routePath}
                        preserveScroll={true}
                        onClick={toggleSidebar}
                        className={`flex items-center px-4 py-3 text-black rounded-lg transition-colors cursor-pointer ${
                            item.key === currentPageKey ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'
                        }`}
                    >
                        <i className={`${item.icon} mr-3`}></i>
                        {item.title}
                    </Link>
                ))}
            </nav>

            <div className="pt-6 mt-6 border-t border-white/40">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#FF69B4] bg-opacity-20 text-white font-semibold rounded-lg transition-colors hover:bg-opacity-30"
                >
                    <i className="fas fa-sign-out-alt"></i>
                    Logout
                </button>
            </div>
        </div>
    );
};
export default AgentSidebar;