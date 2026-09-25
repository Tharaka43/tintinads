<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class AdminAdvertisementController extends Controller
{
    /**
     * Get all advertisements with their statistics
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Advertisement::with([
                'images',
                'agent:id,name,email',
                'commonCategory:id,name',
                'listingCategory:id,name',
                'subCategory:id,name',
                'transactions'
            ]);

            // Apply filters
            if ($request->has('status') && $request->status !== 'All Status') {
                $query->where('status', $request->status);
            }

            if ($request->has('agent_id') && $request->agent_id) {
                // Extract numeric ID from format like "AG001"
                $numericId = (int) str_replace('AG', '', $request->agent_id);
                $query->where('agent_id', $numericId);
            }

            if ($request->has('category') && $request->category !== 'All Categories') {
                $query->whereHas('commonCategory', function ($q) use ($request) {
                    $q->where('name', $request->category);
                });
            }

            if ($request->has('date_from') && $request->date_from) {
                $query->whereDate('post_date', '>=', $request->date_from);
            }

            if ($request->has('date_to') && $request->date_to) {
                $query->whereDate('post_date', '<=', $request->date_to);
            }

            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('code', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%');
                });
            }

            // Get total count before pagination
            $totalItems = $query->count();

            // Pagination parameters
            $perPage = (int) ($request->input('per_page', 10));
            $currentPage = (int) ($request->input('page', 1));
            $perPage = max(1, min(100, $perPage)); // Limit between 1 and 100
            $currentPage = max(1, $currentPage);

            // Calculate pagination
            $totalPages = (int) ceil($totalItems / $perPage);
            $offset = ($currentPage - 1) * $perPage;

            // Apply pagination
            $ads = $query->latest('post_date')
                ->skip($offset)
                ->take($perPage)
                ->get()
                ->map(function (Advertisement $advertisement) {
                // Get first image URL, or use default header image
                $imageUrl = $advertisement->images->first()
                    ? Storage::url($advertisement->images->first()->path)
                    : '/placeholder-image.jpg';

                // Determine if featured (check listing category for VIP/Premium)
                $listingCategoryName = optional($advertisement->listingCategory)->name ?? '';
                $isFeatured = in_array(strtolower($listingCategoryName), ['vip', 'premium', 'super', 'featured']) 
                    && strtolower($advertisement->status) === 'activated';

                $rawStatus = $advertisement->status;
                $isExpired = $advertisement->is_expired;
                if ($rawStatus === 'activated' && $isExpired) {
                    $rawStatus = 'expired';
                    $isFeatured = false;
                }

                // Map status to frontend format
                $status = $this->mapStatus($rawStatus, $isFeatured);

                // Get latest transaction receipt if exists
                $latestTransaction = $advertisement->transactions->sortByDesc('created_at')->first();
                $receiptPath = $latestTransaction && $latestTransaction->receipt_path 
                    ? Storage::url($latestTransaction->receipt_path) 
                    : null;

                return [
                    'id' => '#' . $advertisement->code,
                    'title' => $advertisement->title,
                    'description' => $advertisement->description,
                    'price' => $advertisement->price,
                    'location' => $advertisement->location,
                    'category' => optional($advertisement->commonCategory)->name ?? 'Uncategorized',
                    'agentName' => optional($advertisement->agent)->name ?? 'Unknown',
                    'agentId' => 'AG' . str_pad((string) $advertisement->agent_id, 3, '0', STR_PAD_LEFT),
                    'status' => $status,
                    'paymentStatus' => $advertisement->payment_status ?? 'unpaid',
                    'datePosted' => $advertisement->post_date ? $advertisement->post_date->format('Y-m-d') : '',
                    'imgSrc' => $imageUrl,
                    'isFeatured' => $isFeatured,
                    'isSelected' => false,
                    'advertisement_id' => $advertisement->id,
                    'receiptPath' => $receiptPath,
                ];
            });

            // Get statistics
            $stats = [
                'totalAds' => Advertisement::count(),
                'activeAds' => Advertisement::where('status', 'activated')->count(),
                'blockedAds' => Advertisement::where('status', 'blocked')->count(),
                'featuredAds' => Advertisement::where('status', 'activated')
                    ->whereHas('listingCategory', function ($q) {
                        $q->whereIn('name', ['VIP', 'Premium', 'Featured']);
                    })->count(),
            ];

            return response()->json([
                'success' => true,
                'ads' => $ads,
                'stats' => $stats,
                'pagination' => [
                    'current_page' => $currentPage,
                    'total_pages' => $totalPages,
                    'per_page' => $perPage,
                    'total_items' => $totalItems,
                    'from' => $totalItems > 0 ? $offset + 1 : 0,
                    'to' => min($offset + $perPage, $totalItems),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch advertisements', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch advertisements.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Block advertisements (bulk or single)
     */
    public function block(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ad_ids' => ['required', 'array'],
                'ad_ids.*' => ['required', 'integer', 'exists:advertisements,id'],
            ]);

            $count = Advertisement::whereIn('id', $validated['ad_ids'])
                ->update([
                    'status' => 'blocked',
                ]);

            Log::info('Advertisements blocked by admin', [
                'ad_ids' => $validated['ad_ids'],
                'count' => $count,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully blocked {$count} advertisement(s).",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to block advertisements', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to block advertisements.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Feature advertisements (bulk or single)
     */
    public function feature(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ad_ids' => ['required', 'array'],
                'ad_ids.*' => ['required', 'integer', 'exists:advertisements,id'],
            ]);

            // Feature ads by setting status to activated (they become featured if they have VIP/Premium listing category)
            $count = Advertisement::whereIn('id', $validated['ad_ids'])
                ->update([
                    'status' => 'activated',
                ]);

            Log::info('Advertisements featured by admin', [
                'ad_ids' => $validated['ad_ids'],
                'count' => $count,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully featured {$count} advertisement(s).",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to feature advertisements', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to feature advertisements.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Activate advertisements (bulk or single)
     */
    public function activate(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ad_ids' => ['required', 'array'],
                'ad_ids.*' => ['required', 'integer', 'exists:advertisements,id'],
            ]);

            $count = Advertisement::whereIn('id', $validated['ad_ids'])
                ->update([
                    'status' => 'activated',
                    'payment_status' => 'paid',
                    'post_date' => now(),
                ]);

            \App\Models\AdTransaction::whereIn('advertisement_id', $validated['ad_ids'])
                ->where('status', 'Pending Review')
                ->update(['status' => 'Confirmed']);

            Log::info('Advertisements activated by admin', [
                'ad_ids' => $validated['ad_ids'],
                'count' => $count,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully activated {$count} advertisement(s).",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to activate advertisements', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to activate advertisements.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete advertisements (bulk or single)
     */
    public function delete(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ad_ids' => ['required', 'array'],
                'ad_ids.*' => ['required', 'integer', 'exists:advertisements,id'],
            ]);

            DB::transaction(function () use ($validated) {
                $advertisements = Advertisement::whereIn('id', $validated['ad_ids'])->get();

                foreach ($advertisements as $advertisement) {
                    // Delete associated images
                    foreach ($advertisement->images as $image) {
                        if (Storage::disk('public')->exists($image->path)) {
                            Storage::disk('public')->delete($image->path);
                        }
                        $image->delete();
                    }

                    // Delete the advertisement
                    $advertisement->delete();
                }
            });

            $count = count($validated['ad_ids']);

            Log::info('Advertisements deleted by admin', [
                'ad_ids' => $validated['ad_ids'],
                'count' => $count,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully deleted {$count} advertisement(s).",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete advertisements', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete advertisements.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update payment status (bulk or single)
     */
    public function updatePaymentStatus(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ad_ids' => ['required', 'array'],
                'ad_ids.*' => ['required', 'integer', 'exists:advertisements,id'],
                'payment_status' => ['required', 'string', 'in:paid,unpaid'],
            ]);

            $count = Advertisement::whereIn('id', $validated['ad_ids'])
                ->update([
                    'payment_status' => $validated['payment_status'],
                ]);

            Log::info('Advertisement payment status updated by admin', [
                'ad_ids' => $validated['ad_ids'],
                'payment_status' => $validated['payment_status'],
                'count' => $count,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully updated payment status to '{$validated['payment_status']}' for {$count} advertisement(s).",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to update payment status', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update payment status.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Map database status to frontend status format
     */
    private function mapStatus(string $status, bool $isFeatured = false): string
    {
        if ($isFeatured && strtolower($status) === 'activated') {
            return 'Featured';
        }

        $statusMap = [
            'activated' => 'Active',
            'blocked' => 'Blocked',
            'deactivated' => 'Pending Review',
            'expired' => 'Expired',
        ];

        return $statusMap[strtolower($status)] ?? 'Pending Review';
    }
}

