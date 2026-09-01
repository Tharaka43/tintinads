import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
    DoughnutController,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    LineController,
    BarController,
    DoughnutController
);

// --- Global Constants ---
const BLUE_600 = '#2563EB';
const GREEN_600 = '#10B981';
const PURPLE_600 = '#9333EA';
const ORANGE_600 = '#EA580C';
const PINK_600 = '#EC4899';

// --- Types ---
interface OverallStats {
    totalAgents: number;
    activeAgents: number;
    totalAds: number;
    activeAds: number;
    totalTransactions: number;
    totalRevenue: number;
    totalCommission: number;
    pendingCommissions: number;
}

interface RangeStats {
    dateFrom: string;
    dateTo: string;
    adsInRange: number;
    transactionsInRange: number;
    revenueInRange: number;
    commissionInRange: number;
}

interface DailyStat {
    date: string;
    dateFull: string;
    ads: number;
    transactions: number;
    revenue: number;
    commission: number;
}

interface TopAgent {
    id: string;
    name: string;
    email: string;
    totalAds: number;
    totalTransactions: number;
    totalCommission: number;
    totalRevenue: number;
}

interface ReportsData {
    overallStats: OverallStats;
    rangeStats: RangeStats;
    dailyStats: DailyStat[];
    weeklyStats: any[];
    topAgents: TopAgent[];
    transactionStatusBreakdown: Record<string, number>;
    adStatusBreakdown: Record<string, number>;
    categoryPerformance: Array<{ category: string; count: number }>;
}

// --- Sub-Components ---
const StatCard: React.FC<{ title: string; value: string | number; icon: string; iconColor: string; bgColor: string; trend?: string }> = ({ title, value, icon, iconColor, bgColor, trend }) => (
    <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                </p>
                {trend && (
                    <p className="text-sm text-green-600 mt-1">{trend}</p>
                )}
            </div>
            <div className={`p-3 rounded-lg ${bgColor}`}>
                <i className={`${icon} ${iconColor} text-2xl`}></i>
            </div>
        </div>
    </div>
);

const ReportsPage: React.FC = () => {
    const [data, setData] = useState<ReportsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dateFrom, setDateFrom] = useState<string>('');
    const [dateTo, setDateTo] = useState<string>('');

    // Chart refs
    const adsTrendChartRef = useRef<HTMLCanvasElement>(null);
    const revenueChartRef = useRef<HTMLCanvasElement>(null);
    const transactionStatusChartRef = useRef<HTMLCanvasElement>(null);
    const categoryChartRef = useRef<HTMLCanvasElement>(null);
    
    // Chart instances refs
    const chartInstancesRef = useRef<{ [key: string]: any }>({});

    // Set default date range (last 30 days) - only once on mount
    useEffect(() => {
        if (!dateFrom || !dateTo) {
            const today = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(today.getDate() - 30);
            
            setDateTo(today.toISOString().split('T')[0]);
            setDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
        }
    }, []);

    const loadReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params: any = {};
            if (dateFrom) params.date_from = dateFrom;
            if (dateTo) params.date_to = dateTo;

            const response = await axios.get('/admin/api/reports', { params });
            if (response.data.success) {
                setData(response.data);
            } else {
                setError('Failed to load reports data.');
            }
        } catch (err: any) {
            console.error('Load reports error:', err);
            setError(err?.response?.data?.message || 'Failed to load reports data. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [dateFrom, dateTo]);

    // Load reports data when dates change
    useEffect(() => {
        if (dateFrom && dateTo) {
            loadReports();
        }
    }, [dateFrom, dateTo, loadReports]);

    // Initialize charts when data is loaded
    useEffect(() => {
        if (!data || !adsTrendChartRef.current) return;

        // Destroy existing charts
        Object.values(chartInstancesRef.current).forEach(chart => {
            if (chart) chart.destroy();
        });
        chartInstancesRef.current = {};
        
        // Ads Trend Chart
        if (adsTrendChartRef.current && data.dailyStats && data.dailyStats.length > 0) {
            const ctx = adsTrendChartRef.current.getContext('2d');
            if (!ctx) return;
            
            const chart = new ChartJS(ctx, {
                type: 'line',
                data: {
                    labels: data.dailyStats.map(d => d.date),
                    datasets: [{
                        label: 'Ads Posted',
                        data: data.dailyStats.map(d => d.ads),
                        borderColor: BLUE_600,
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        tension: 0.4,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Ads Posted Trend' }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
            chartInstancesRef.current['adsTrend'] = chart;
        }

        // Revenue Chart
        if (revenueChartRef.current && data.dailyStats && data.dailyStats.length > 0) {
            const ctx = revenueChartRef.current.getContext('2d');
            if (!ctx) return;
            
            const chart = new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: data.dailyStats.map(d => d.date),
                    datasets: [{
                        label: 'Revenue',
                        data: data.dailyStats.map(d => d.revenue),
                        backgroundColor: GREEN_600,
                    }, {
                        label: 'Commission',
                        data: data.dailyStats.map(d => d.commission),
                        backgroundColor: PURPLE_600,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true },
                        title: { display: true, text: 'Revenue & Commission' }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
            chartInstancesRef.current['revenue'] = chart;
        }

        // Transaction Status Chart
        if (transactionStatusChartRef.current && data.transactionStatusBreakdown && Object.keys(data.transactionStatusBreakdown).length > 0) {
            const ctx = transactionStatusChartRef.current.getContext('2d');
            if (!ctx) return;
            
            const chart = new ChartJS(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(data.transactionStatusBreakdown),
                    datasets: [{
                        data: Object.values(data.transactionStatusBreakdown),
                        backgroundColor: [BLUE_600, GREEN_600, ORANGE_600, PINK_600],
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: true, position: 'bottom' },
                        title: { display: true, text: 'Transaction Status Breakdown' }
                    }
                }
            });
            chartInstancesRef.current['transactionStatus'] = chart;
        }

        // Category Performance Chart
        if (categoryChartRef.current && data.categoryPerformance && data.categoryPerformance.length > 0) {
            const ctx = categoryChartRef.current.getContext('2d');
            if (!ctx) return;
            
            const chart = new ChartJS(ctx, {
                type: 'bar',
                data: {
                    labels: data.categoryPerformance.map(c => c.category),
                    datasets: [{
                        label: 'Ads Count',
                        data: data.categoryPerformance.map(c => c.count),
                        backgroundColor: PINK_600,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: 'Top Categories by Ad Count' }
                    },
                    scales: {
                        y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.1)' } },
                        x: { grid: { display: false } }
                    }
                }
            });
            chartInstancesRef.current['category'] = chart;
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
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600">Loading reports...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-gray-50 min-h-screen p-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    <p className="font-medium">Error loading reports</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
                            <p className="text-gray-600 mt-1">Comprehensive insights into system performance and metrics</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={loadReports}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                                <i className="fas fa-sync-alt mr-2"></i>Refresh
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                {/* Overall Statistics */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Statistics</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatCard
                            title="Total Agents"
                            value={data.overallStats.totalAgents}
                            icon="fas fa-users"
                            iconColor="text-blue-600"
                            bgColor="bg-blue-100"
                        />
                        <StatCard
                            title="Active Agents"
                            value={data.overallStats.activeAgents}
                            icon="fas fa-user-check"
                            iconColor="text-green-600"
                            bgColor="bg-green-100"
                        />
                        <StatCard
                            title="Total Ads"
                            value={data.overallStats.totalAds}
                            icon="fas fa-ad"
                            iconColor="text-purple-600"
                            bgColor="bg-purple-100"
                        />
                        <StatCard
                            title="Active Ads"
                            value={data.overallStats.activeAds}
                            icon="fas fa-check-circle"
                            iconColor="text-green-600"
                            bgColor="bg-green-100"
                        />
                        <StatCard
                            title="Total Transactions"
                            value={data.overallStats.totalTransactions}
                            icon="fas fa-receipt"
                            iconColor="text-orange-600"
                            bgColor="bg-orange-100"
                        />
                        <StatCard
                            title="Total Revenue"
                            value={`LKR ${data.overallStats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon="fas fa-dollar-sign"
                            iconColor="text-green-600"
                            bgColor="bg-green-100"
                        />
                        <StatCard
                            title="Total Commission"
                            value={`LKR ${data.overallStats.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon="fas fa-hand-holding-usd"
                            iconColor="text-purple-600"
                            bgColor="bg-purple-100"
                        />
                        <StatCard
                            title="Pending Commissions"
                            value={data.overallStats.pendingCommissions}
                            icon="fas fa-clock"
                            iconColor="text-orange-600"
                            bgColor="bg-orange-100"
                        />
                    </div>
                </section>

                {/* Date Range Statistics */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Statistics for {data.rangeStats.dateFrom} to {data.rangeStats.dateTo}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <StatCard
                            title="Ads in Range"
                            value={data.rangeStats.adsInRange}
                            icon="fas fa-ad"
                            iconColor="text-blue-600"
                            bgColor="bg-blue-100"
                        />
                        <StatCard
                            title="Transactions in Range"
                            value={data.rangeStats.transactionsInRange}
                            icon="fas fa-exchange-alt"
                            iconColor="text-orange-600"
                            bgColor="bg-orange-100"
                        />
                        <StatCard
                            title="Revenue in Range"
                            value={`LKR ${data.rangeStats.revenueInRange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon="fas fa-dollar-sign"
                            iconColor="text-green-600"
                            bgColor="bg-green-100"
                        />
                        <StatCard
                            title="Commission in Range"
                            value={`LKR ${data.rangeStats.commissionInRange.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            icon="fas fa-hand-holding-usd"
                            iconColor="text-purple-600"
                            bgColor="bg-purple-100"
                        />
                    </div>
                </section>

                {/* Charts Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Analytics Charts</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Ads Trend Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-64">
                                <canvas ref={adsTrendChartRef}></canvas>
                            </div>
                        </div>

                        {/* Revenue Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-64">
                                <canvas ref={revenueChartRef}></canvas>
                            </div>
                        </div>

                        {/* Transaction Status Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-64">
                                <canvas ref={transactionStatusChartRef}></canvas>
                            </div>
                        </div>

                        {/* Category Performance Chart */}
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-64">
                                <canvas ref={categoryChartRef}></canvas>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Top Performing Agents */}
                <section className="mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Agents</h2>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Ads</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transactions</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {data.topAgents.map((agent) => (
                                        <tr key={agent.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                                                    <div className="text-sm text-gray-500">{agent.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.totalAds}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{agent.totalTransactions}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                LKR {agent.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                                                LKR {agent.totalCommission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ReportsPage;

