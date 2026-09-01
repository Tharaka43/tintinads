<?php

namespace App\Http\Controllers;

use App\Models\Agent;
use App\Models\Advertisement;
use App\Models\AdTransaction;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AdminReportsController extends Controller
{
    /**
     * Get comprehensive analytics and reports data
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $dateFrom = $request->input('date_from') ? Carbon::parse($request->input('date_from')) : Carbon::now()->subDays(30);
            $dateTo = $request->input('date_to') ? Carbon::parse($request->input('date_to')) : Carbon::now();

            // Overall Statistics
            $totalAgents = Agent::count();
            $activeAgents = Agent::where('is_active', true)->count();
            $totalAds = Advertisement::count();
            $activeAds = Advertisement::where('status', 'activated')->count();
            $totalTransactions = AdTransaction::count();
            $totalRevenue = AdTransaction::sum('amount');
            $totalCommission = AdTransaction::sum('commission');
            $pendingCommissions = AdTransaction::where('status', 'Pending Review')->count();

            // Date Range Statistics
            $adsInRange = Advertisement::whereBetween('post_date', [$dateFrom, $dateTo])->count();
            $transactionsInRange = AdTransaction::whereBetween('payment_datetime', [$dateFrom, $dateTo])->count();
            $revenueInRange = AdTransaction::whereBetween('payment_datetime', [$dateFrom, $dateTo])->sum('amount');
            $commissionInRange = AdTransaction::whereBetween('payment_datetime', [$dateFrom, $dateTo])->sum('commission');

            // Daily Statistics for Charts (Last 30 days)
            $dailyStats = $this->getDailyStats($dateFrom, $dateTo);

            // Weekly Statistics
            $weeklyStats = $this->getWeeklyStats($dateFrom, $dateTo);

            // Top Performing Agents
            $topAgents = Agent::withCount(['advertisements', 'adTransactions'])
                ->withSum('adTransactions', 'commission')
                ->withSum('adTransactions', 'amount')
                ->orderBy('ad_transactions_sum_commission', 'desc')
                ->limit(10)
                ->get()
                ->map(function (Agent $agent) {
                    return [
                        'id' => 'AG' . str_pad((string) $agent->id, 3, '0', STR_PAD_LEFT),
                        'name' => $agent->name,
                        'email' => $agent->email,
                        'totalAds' => $agent->advertisements_count ?? 0,
                        'totalTransactions' => $agent->ad_transactions_count ?? 0,
                        'totalCommission' => (float) ($agent->ad_transactions_sum_commission ?? 0),
                        'totalRevenue' => (float) ($agent->ad_transactions_sum_amount ?? 0),
                    ];
                });

            // Transaction Status Breakdown
            $transactionStatusBreakdown = AdTransaction::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray();

            // Ad Status Breakdown
            $adStatusBreakdown = Advertisement::select('status', DB::raw('count(*) as count'))
                ->groupBy('status')
                ->get()
                ->pluck('count', 'status')
                ->toArray();

            // Category Performance
            $categoryPerformance = Advertisement::join('common_categories', 'advertisements.common_category_id', '=', 'common_categories.id')
                ->select('common_categories.name as category', DB::raw('count(*) as count'))
                ->groupBy('common_categories.name')
                ->orderBy('count', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($item) {
                    return [
                        'category' => $item->category,
                        'count' => $item->count,
                    ];
                });

            return response()->json([
                'success' => true,
                'overallStats' => [
                    'totalAgents' => $totalAgents,
                    'activeAgents' => $activeAgents,
                    'totalAds' => $totalAds,
                    'activeAds' => $activeAds,
                    'totalTransactions' => $totalTransactions,
                    'totalRevenue' => (float) $totalRevenue,
                    'totalCommission' => (float) $totalCommission,
                    'pendingCommissions' => $pendingCommissions,
                ],
                'rangeStats' => [
                    'dateFrom' => $dateFrom->format('Y-m-d'),
                    'dateTo' => $dateTo->format('Y-m-d'),
                    'adsInRange' => $adsInRange,
                    'transactionsInRange' => $transactionsInRange,
                    'revenueInRange' => (float) $revenueInRange,
                    'commissionInRange' => (float) $commissionInRange,
                ],
                'dailyStats' => $dailyStats,
                'weeklyStats' => $weeklyStats,
                'topAgents' => $topAgents,
                'transactionStatusBreakdown' => $transactionStatusBreakdown,
                'adStatusBreakdown' => $adStatusBreakdown,
                'categoryPerformance' => $categoryPerformance,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch reports data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reports data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get daily statistics for charts
     */
    private function getDailyStats(Carbon $dateFrom, Carbon $dateTo): array
    {
        $stats = [];
        $currentDate = $dateFrom->copy();

        while ($currentDate->lte($dateTo)) {
            $dateStr = $currentDate->format('Y-m-d');

            $adsCount = Advertisement::whereDate('post_date', $dateStr)->count();
            $transactionsCount = AdTransaction::whereDate('payment_datetime', $dateStr)->count();
            $revenue = AdTransaction::whereDate('payment_datetime', $dateStr)->sum('amount');
            $commission = AdTransaction::whereDate('payment_datetime', $dateStr)->sum('commission');

            $stats[] = [
                'date' => $currentDate->format('M d'),
                'dateFull' => $dateStr,
                'ads' => $adsCount,
                'transactions' => $transactionsCount,
                'revenue' => (float) $revenue,
                'commission' => (float) $commission,
            ];

            $currentDate->addDay();
        }

        return $stats;
    }

    /**
     * Get weekly statistics for charts
     */
    private function getWeeklyStats(Carbon $dateFrom, Carbon $dateTo): array
    {
        $stats = [];
        $currentDate = $dateFrom->copy()->startOfWeek();

        while ($currentDate->lte($dateTo)) {
            $weekEnd = $currentDate->copy()->endOfWeek();
            if ($weekEnd->gt($dateTo)) {
                $weekEnd = $dateTo->copy();
            }

            $weekLabel = $currentDate->format('M d') . ' - ' . $weekEnd->format('M d');

            $adsCount = Advertisement::whereBetween('post_date', [$currentDate, $weekEnd])->count();
            $transactionsCount = AdTransaction::whereBetween('payment_datetime', [$currentDate, $weekEnd])->count();
            $revenue = AdTransaction::whereBetween('payment_datetime', [$currentDate, $weekEnd])->sum('amount');
            $commission = AdTransaction::whereBetween('payment_datetime', [$currentDate, $weekEnd])->sum('commission');

            $stats[] = [
                'week' => $weekLabel,
                'weekStart' => $currentDate->format('Y-m-d'),
                'weekEnd' => $weekEnd->format('Y-m-d'),
                'ads' => $adsCount,
                'transactions' => $transactionsCount,
                'revenue' => (float) $revenue,
                'commission' => (float) $commission,
            ];

            $currentDate->addWeek();
        }

        return $stats;
    }

    /**
     * Get dashboard statistics for admin home page
     */
    public function dashboard(Request $request): JsonResponse
    {
        try {
            // Urgent Review Statistics
            $pendingAgentSignups = Agent::where('is_active', false)->count();
            $pendingPaymentProofs = AdTransaction::where('status', 'Pending Review')->count();
            $flaggedAds = Advertisement::where('status', 'blocked')->count(); // Assuming blocked ads are flagged

            // Weekly Statistics (Last 4 weeks)
            $weeklyStats = [];
            $currentDate = Carbon::now();
            
            for ($i = 3; $i >= 0; $i--) {
                $weekStart = $currentDate->copy()->subWeeks($i)->startOfWeek();
                $weekEnd = $weekStart->copy()->endOfWeek();
                $weekLabel = 'Week ' . (4 - $i);
                
                $adsCount = Advertisement::whereBetween('post_date', [$weekStart, $weekEnd])->count();
                $newAgents = Agent::whereBetween('created_at', [$weekStart, $weekEnd])->count();
                
                $weeklyStats[] = [
                    'week' => $weekLabel,
                    'ads' => $adsCount,
                    'newAgents' => $newAgents,
                ];
            }

            // Ad Posting Trend (Last 4 weeks)
            $adTrend = [
                'labels' => array_column($weeklyStats, 'week'),
                'data' => array_column($weeklyStats, 'ads'),
            ];

            // Agent Activity (Last 4 weeks)
            $activity = [
                'labels' => array_column($weeklyStats, 'week'),
                'agentData' => array_column($weeklyStats, 'newAgents'),
                'userData' => array_column($weeklyStats, 'ads'), // Using ads as user activity proxy
            ];

            // Total Ads Posted
            $totalAdsPosted = Advertisement::count();

            // Calculate percentage change (comparing last 2 weeks)
            $lastWeekAds = $weeklyStats[3]['ads'] ?? 0;
            $previousWeekAds = $weeklyStats[2]['ads'] ?? 0;
            $percentageChange = $previousWeekAds > 0 
                ? round((($lastWeekAds - $previousWeekAds) / $previousWeekAds) * 100, 1)
                : 0;

            return response()->json([
                'success' => true,
                'urgentStats' => [
                    'pendingAgentSignups' => $pendingAgentSignups,
                    'pendingPaymentProofs' => $pendingPaymentProofs,
                    'flaggedAds' => $flaggedAds,
                ],
                'chartData' => [
                    'adTrend' => $adTrend,
                    'activity' => $activity,
                ],
                'totalAdsPosted' => $totalAdsPosted,
                'percentageChange' => $percentageChange,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch dashboard data', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

