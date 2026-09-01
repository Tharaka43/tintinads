import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController
); 

// --- Global Constants ---
const PRIMARY_PINK = '#EC4899';
const LIGHT_BLUE = '#0EA5E9';

// --- Types ---
interface DashboardData {
    urgentStats: {
        pendingAgentSignups: number;
        pendingPaymentProofs: number;
        flaggedAds: number;
    };
    chartData: {
        adTrend: {
            labels: string[];
            data: number[];
        };
        activity: {
            labels: string[];
            agentData: number[];
            userData: number[];
        };
    };
    totalAdsPosted: number;
    percentageChange: number;
}

// --- Sub-Components ---
const UrgentStatCard: React.FC<{ title: string; value: number; subtext: string; icon: string; actionText: string; routePath?: string }> = ({ title, value, subtext, icon, actionText, routePath }) => (
    <div className="bg-white rounded-lg shadow-md border-l-4 border-primary-pink p-6" style={{ borderColor: PRIMARY_PINK }}>
        <div className="flex items-center justify-between">
            <div>
                <h4 className="text-sm font-medium text-gray-600">{title}</h4>
                <p className="text-2xl font-bold mt-1" style={{ color: PRIMARY_PINK }}>{value}</p>
                <p className="text-sm text-gray-500 mt-1">{subtext}</p>
            </div>
            <div className="w-12 h-12 bg-primary-pink bg-opacity-10 rounded-lg flex items-center justify-center" style={{ '--tw-bg-opacity': 0.1, backgroundColor: PRIMARY_PINK }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: PRIMARY_PINK }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
                </svg>
            </div>
        </div>
        {routePath ? (
            <Link href={routePath} className="w-full mt-4 text-white py-2 px-4 rounded-md transition-colors block text-center" style={{ backgroundColor: PRIMARY_PINK }}>
                {actionText}
            </Link>
        ) : (
            <button className="w-full mt-4 text-white py-2 px-4 rounded-md transition-colors" style={{ backgroundColor: PRIMARY_PINK, hoverBg: '#db2777' }}>{actionText}</button>
        )}
    </div>
);

const QuickLinkButton: React.FC<{ title: string; icon: string; bgColor: string; routePath?: string }> = ({ title, icon, bgColor, routePath }) => {
    const content = (
        <div className="flex items-center space-x-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={icon}></path>
            </svg>
            <span className="font-medium">{title}</span>
        </div>
    );

    if (routePath) {
        return (
            <Link href={routePath} className={`p-4 rounded-lg hover:bg-opacity-90 transition-colors text-left block`} style={{ backgroundColor: bgColor, color: 'white' }}>
                {content}
            </Link>
        );
    }

    return (
        <button className={`p-4 rounded-lg hover:bg-opacity-90 transition-colors text-left`} style={{ backgroundColor: bgColor, color: 'white' }}>
            {content}
        </button>
    );
};


const AdminDashboardHome: React.FC = () => {
    const adTrendCanvasRef = useRef<HTMLCanvasElement>(null);
    const activityCanvasRef = useRef<HTMLCanvasElement>(null);
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Chart instances refs
    const chartInstancesRef = useRef<{ [key: string]: any }>({});

    // Load dashboard data
    const loadDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/admin/api/dashboard');
            if (response.data.success) {
                setData(response.data);
            } else {
                setError('Failed to load dashboard data.');
            }
        } catch (err: any) {
            console.error('Load dashboard error:', err);
            setError(err?.response?.data?.message || 'Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, [loadDashboardData]);

    // --- Chart Initialization ---
    useEffect(() => {
        if (!data || !adTrendCanvasRef.current) return;

        // Destroy existing charts
        Object.values(chartInstancesRef.current).forEach(chart => {
            if (chart) chart.destroy();
        });
        chartInstancesRef.current = {};

        // Ad Posting Trend Chart (Line Chart)
        if (adTrendCanvasRef.current && data.chartData.adTrend.labels.length > 0) {
            const ctx = adTrendCanvasRef.current.getContext('2d');
            if (!ctx) return;
            
            const chart = new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: data.chartData.adTrend.labels,
                    datasets: [{
                        label: 'Ads Posted',
                        data: data.chartData.adTrend.data,
                        borderColor: LIGHT_BLUE,
                        backgroundColor: `rgba(14, 165, 233, 0.1)`,
                        tension: 0.4,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } }, x: { grid: { display: false } } }
                }
            });
            chartInstancesRef.current['adTrend'] = chart;
        }

        // Agent Activity vs User Signups Chart (Bar Chart)
        if (activityCanvasRef.current && data.chartData.activity.labels.length > 0) {
            const ctx = activityCanvasRef.current.getContext('2d');
            if (!ctx) return;
            
            const chart = new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: data.chartData.activity.labels,
                    datasets: [{
                        label: 'Active Agents',
                        data: data.chartData.activity.agentData,
                        backgroundColor: LIGHT_BLUE,
                    }, {
                        label: 'New Users',
                        data: data.chartData.activity.userData,
                        backgroundColor: PRIMARY_PINK,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } }, x: { grid: { display: false } } }
                }
            });
            chartInstancesRef.current['activity'] = chart;
        }
        
        // Cleanup function
        return () => {
            Object.values(chartInstancesRef.current).forEach(chart => {
                if (chart) chart.destroy();
            });
            chartInstancesRef.current = {};
        };
    }, [data]);

    if (loading) {
        return (
            <div className="p-6 sm:p-8 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 sm:p-8 bg-gray-50 min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error loading dashboard</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="p-6 sm:p-8 space-y-8 bg-gray-50">
            
            {/* Urgent Review Cards */}
            <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Urgent Reviews Required</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <UrgentStatCard 
                        title="New Agent Signups" 
                        value={data.urgentStats.pendingAgentSignups} 
                        subtext="Pending Approval" 
                        icon="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" 
                        actionText="Review Now"
                        routePath="/admin/agents"
                    />
                    <UrgentStatCard 
                        title="Payment Proofs" 
                        value={data.urgentStats.pendingPaymentProofs} 
                        subtext="Awaiting Review" 
                        icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                        actionText="Review Now"
                        routePath="/admin/payments"
                    />
                    <UrgentStatCard 
                        title="Flagged Ads" 
                        value={data.urgentStats.flaggedAds} 
                        subtext="Recently Reported" 
                        icon="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
                        actionText="Review Now"
                        routePath="/admin/ads"
                    />
                </div>
            </section>

            {/* System Health Charts */}
            <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health Metrics</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Ad Posting Trend Chart */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900">Ad Posting Trend</h4>
                            <span className="text-sm text-gray-500">Last 4 Weeks</span>
                        </div>
                        <div className="h-64 w-full">
                            <canvas ref={adTrendCanvasRef} className="w-full h-full"></canvas>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-600">Total Ads Posted: <strong style={{ color: LIGHT_BLUE }}>{data.totalAdsPosted.toLocaleString()}</strong></span>
                            <span className={data.percentageChange >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {data.percentageChange >= 0 ? '↗' : '↘'} {data.percentageChange >= 0 ? '+' : ''}{data.percentageChange}% vs last week
                            </span>
                        </div>
                    </div>

                    {/* Agent Activity vs User Signups */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900">Agent Activity vs User Signups</h4>
                            <span className="text-sm text-gray-500">This Month</span>
                        </div>
                        <div className="h-64 w-full">
                            <canvas ref={activityCanvasRef} className="w-full h-full"></canvas>
                        </div>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                                <span className="text-gray-600">New Agents</span>
                                <p className="text-lg font-bold" style={{ color: LIGHT_BLUE }}>{data.chartData.activity.agentData.reduce((a, b) => a + b, 0)}</p>
                            </div>
                            <div className="text-center">
                                <span className="text-gray-600">Ads Posted</span>
                                <p className="text-lg font-bold" style={{ color: PRIMARY_PINK }}>{data.chartData.activity.userData.reduce((a, b) => a + b, 0)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Links */}
            <section>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickLinkButton title="Agent Management" icon="M17 20H5a2 2 0 01-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" bgColor={LIGHT_BLUE} routePath="/admin/agents" />
                    <QuickLinkButton title="Ads Management" icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" bgColor={LIGHT_BLUE} routePath="/admin/ads" />
                    <QuickLinkButton title="Analytics" icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" bgColor="#475569" routePath="/admin/reports" />
                    <QuickLinkButton title="Settings" icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" bgColor="#475569" routePath="/admin/settings" />
                </div>
            </section>
        </div>
    );
};

export default AdminDashboardHome;