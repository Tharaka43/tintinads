import React from 'react';

// --- Global Constants & Types ---
// Define color variables outside or use Tailwind utility classes directly.
const PRIMARY_PINK = '#EC4899';
const LIGHT_BLUE = '#7DD3FC';
// const DARK_BLUE = '#1E40AF'; // Not strictly needed for this content

interface KPI {
    id: number;
    title: string;
    value: string;
    trend: string;
    trendColor: string;
    icon: string;
    iconBg: string;
    iconColor: string;
}

interface Activity {
    id: number;
    title: string;
    description: string;
    time: string;
    icon: string;
    iconColor: string;
    iconBg: string;
}

// --- Mock Data ---

const KPI_DATA: KPI[] = [
    { id: 1, title: 'Total Active Ads', value: '24', trend: '+12% from last month', trendColor: 'text-green-600', icon: 'fas fa-ad', iconBg: 'bg-pink-100', iconColor: 'text-primary-pink' },
    { id: 2, title: 'Ads Under Review', value: '3', trend: 'Avg. 2 days review', trendColor: 'text-yellow-600', icon: 'fas fa-hourglass-half', iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600' },
    { id: 3, title: 'Pending Payments', value: '$1,240', trend: 'Next payout: Dec 15', trendColor: 'text-blue-600', icon: 'fas fa-credit-card', iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { id: 4, title: 'Total Commission', value: '$8,450', trend: '+18% this quarter', trendColor: 'text-green-600', icon: 'fas fa-percentage', iconBg: 'bg-pink-100', iconColor: 'text-primary-pink' },
];

const ACTIVITY_FEED: Activity[] = [
    { id: 1, title: 'Ad "Luxury Downtown Apartment" was approved', description: 'Your listing is now live and visible to potential buyers', time: '2 hours ago', icon: 'fas fa-check', iconColor: 'text-green-600', iconBg: 'bg-green-100' },
    { id: 2, title: 'Commission payment of $320 processed', description: 'Payment for "Suburban Family Home" sale', time: '1 day ago', icon: 'fas fa-dollar-sign', iconColor: 'text-primary-pink', iconBg: 'bg-pink-100' },
    { id: 3, title: 'New ad "Modern Condo with City View" posted', description: 'Currently under review by our team', time: '2 days ago', icon: 'fas fa-plus', iconColor: 'text-blue-600', iconBg: 'bg-blue-100' },
    { id: 4, title: 'Ad "Beachfront Villa" received 45 new views', description: '3 inquiries and 1 showing request', time: '3 days ago', icon: 'fas fa-eye', iconColor: 'text-yellow-600', iconBg: 'bg-yellow-100' },
    { id: 5, title: 'Updated pricing for "Garden Townhouse"', description: 'Price reduced by $15,000 to attract more buyers', time: '4 days ago', icon: 'fas fa-edit', iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
];

// --- Sub-Components ---

const KPICard: React.FC<{ data: KPI }> = ({ data }) => {
    // Determine color for value text
    const valueColor = data.id === 1 || data.id === 4 ? PRIMARY_PINK : 'rgb(17 24 39)'; // Tailwind gray-900 equivalent

    return (
        <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm font-medium">{data.title}</p>
                    <p className="text-3xl font-bold mt-2" style={{ color: valueColor }}>
                        {data.value}
                    </p>
                    <p className={`text-sm mt-1 flex items-center ${data.trendColor}`}>
                        {data.id === 1 || data.id === 4 ? <i className="fas fa-arrow-up mr-1"></i> : null}
                        {data.trend}
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${data.iconBg}`}>
                    <i className={`${data.icon} ${data.iconColor} text-xl`} style={{ color: data.iconColor.includes('text-primary-pink') ? PRIMARY_PINK : undefined }}></i>
                </div>
            </div>
        </div>
    );
};

const ActivityItem: React.FC<{ activity: Activity }> = ({ activity }) => {
    // Ensure primary pink is applied correctly for icons/backgrounds where necessary
    const iconStyle = activity.iconColor.includes('text-primary-pink') ? { color: PRIMARY_PINK } : {};
    const bgStyle = activity.iconBg.includes('bg-pink-100') ? { backgroundColor: 'rgba(236, 72, 153, 0.1)' } : {}; // bg-pink-100 equivalent
    
    return (
        <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${activity.iconBg}`} style={bgStyle}>
                <i className={`${activity.icon} ${activity.iconColor}`} style={iconStyle}></i>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
        </div>
    );
};

// --- Main Component ---

const MainDash: React.FC = () => {
    return (
        <div className="bg-gray-50 font-sans text-gray-900 min-h-full">
            
            {/* Header Content (Replicating the original dashboard header part) */}
            <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h2>
                        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your ads.</p>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                
                {/* KPI Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {KPI_DATA.map(kpi => <KPICard key={kpi.id} data={kpi} />)}
                </div>

                {/* Recent Activity Feed */}
                <div className="bg-white rounded-xl shadow-md">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                        <p className="text-gray-600 text-sm">Your latest actions and updates</p>
                    </div>
                    <div className="p-6">
                        <div className="space-y-4">
                            {ACTIVITY_FEED.map(activity => <ActivityItem key={activity.id} activity={activity} />)}
                        </div>
                        
                        <div className="mt-6 text-center">
                            <button className="hover:text-blue-600 font-medium text-sm transition-colors" style={{ color: LIGHT_BLUE }}>
                                View All Activity
                                <i className="fas fa-arrow-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MainDash;