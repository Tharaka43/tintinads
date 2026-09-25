<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\Agent;
use App\Models\CommonCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ClassifiedsController extends Controller
{
    public function index(Request $request): Response
    {
        // Get query parameters for filtering
        $category = $request->query('category', 'All Categories');
        $page = (int) $request->query('page', 1);
        $search = $request->query('search', '');
        $location = $request->query('location', '');
        $perPage = 9;

        // Fetch advertisements with relationships
        $query = Advertisement::with([
            'images',
            'commonCategory:id,name',
            'listingCategory:id,name',
            'subCategory:id,name',
        ])
            ->where('status', 'activated') // Only show activated ads
            ->where('payment_status', 'paid') // Only show paid ads
            ->where('post_date', '>=', now()->subDays(14)) // 14 Days expiration rule
            ->orderByRaw('listing_category_id IS NULL, listing_category_id ASC')
            ->latest('post_date');

        // Filter by category if not "All Categories"
        if ($category !== 'All Categories') {
            $query->whereHas('commonCategory', function ($q) use ($category) {
                $q->where('name', $category);
            });
        }

        // Filter by search term if provided
        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%')
                  ->orWhere('location', 'like', '%' . $search . '%');
            });
        }

        // Filter by location if provided
        if (!empty($location) && $location !== 'All Sri Lanka') {
            $query->where('location', 'like', '%' . $location . '%');
        }

        // Get total count for pagination
        $totalAds = $query->count();

        // Paginate results
        $ads = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get()
            ->map(function (Advertisement $advertisement) {
                // Determine if VIP or Premium based on listing category name
                $listingCategoryName = optional($advertisement->listingCategory)->name ?? '';
                $isVip = strtolower($listingCategoryName) === 'vip';
                $isPremium = strtolower($listingCategoryName) === 'premium' || strtolower($listingCategoryName) === 'super';

                // Determine if has cash back guarantee based on sub category
                $subCategoryName = optional($advertisement->subCategory)->name ?? '';
                $hasCashBackGuarantee = stripos($subCategoryName, 'cash back') !== false 
                    || stripos($subCategoryName, 'cashback') !== false;

                // Get all images
                $images = $advertisement->images->map(function ($image) {
                    return Storage::url($image->path);
                })->values()->toArray();

                // Get first image URL, or use default header image
                if (!empty($images)) {
                    $imageUrl = $images[0];
                } else {
                    $imageUrl = '/placeholder-image.jpg';
                    $images = [$imageUrl]; // Ensure images array has at least the default
                }

                // Calculate time ago
                $timeAgo = $advertisement->post_date 
                    ? $this->timeAgo($advertisement->post_date)
                    : 'Recently';

                return [
                    'id' => $advertisement->id,
                    'title' => $advertisement->title,
                    'price' => (float) $advertisement->price,
                    'description' => $advertisement->description ?? '',
                    'category' => optional($advertisement->commonCategory)->name ?? 'Uncategorized',
                    'location' => $advertisement->location,
                    'time' => $timeAgo,
                    'imgSrc' => $imageUrl,
                    'images' => $images,
                    'isVip' => $isVip,
                    'isPremium' => $isPremium,
                    'hasCashBackGuarantee' => $hasCashBackGuarantee,
                ];
            })
            ->values();

        // Get all categories for the filter sidebar
        $categories = CommonCategory::orderBy('name')
            ->pluck('name')
            ->toArray();

        // Get top categories for Browse section (show up to 6 categories)
        $topCategories = CommonCategory::orderBy('name')
            ->take(6)
            ->get(['id', 'name'])
            ->map(function ($cat) {
                // Map category names to icons (you can customize this)
                $iconMap = [
                    'Agents' => 'fas fa-user-tie',
                    'Fake Ads' => 'fas fa-ban',
                    'Aergents' => 'fas fa-car',
                    'Facke Ads' => 'fas fa-home',
                    'Brows' => 'fas fa-laptop',
                    'Browse' => 'fas fa-search',
                    'Vehicles' => 'fas fa-car',
                    'Electronics' => 'fas fa-laptop',
                    'Real Estate' => 'fas fa-home',
                    'Services' => 'fas fa-tools',
                    'Jobs' => 'fas fa-briefcase',
                    'Fashion' => 'fas fa-tshirt',
                ];
                
                // Try to match icon by exact name or partial match
                $icon = 'fas fa-tag'; // default icon
                foreach ($iconMap as $key => $mappedIcon) {
                    if (stripos($cat->name, $key) !== false || stripos($key, $cat->name) !== false) {
                        $icon = $mappedIcon;
                        break;
                    }
                }
                
                return [
                    'name' => $cat->name,
                    'icon' => $icon,
                ];
            })
            ->values();

        // Get saved ad IDs from session
        $savedAdIds = $request->session()->get('saved_ads', []);

        // Add isSaved flag to each ad
        $ads = $ads->map(function ($ad) use ($savedAdIds) {
            $ad['isSaved'] = in_array($ad['id'], $savedAdIds);
            return $ad;
        });

        return Inertia::render('ClassifiedsPage', [
            'ads' => $ads,
            'categories' => $categories,
            'topCategories' => $topCategories,
            'pagination' => [
                'currentPage' => $page,
                'totalItems' => $totalAds,
                'perPage' => $perPage,
                'totalPages' => $totalAds > 0 ? ceil($totalAds / $perPage) : 1,
            ],
            'selectedCategory' => $category,
            'searchTerm' => $search,
            'selectedLocation' => $location,
            'savedAdIds' => $savedAdIds,
        ]);
    }

    /**
     * Save an ad to session
     */
    public function saveAd(Request $request, int $adId): JsonResponse
    {
        $savedAds = $request->session()->get('saved_ads', []);
        
        if (!in_array($adId, $savedAds)) {
            $savedAds[] = $adId;
            $request->session()->put('saved_ads', $savedAds);
        }

        return response()->json([
            'success' => true,
            'message' => 'Ad saved successfully',
            'savedCount' => count($savedAds),
        ]);
    }

    /**
     * Unsave an ad from session
     */
    public function unsaveAd(Request $request, int $adId): JsonResponse
    {
        $savedAds = $request->session()->get('saved_ads', []);
        $savedAds = array_values(array_filter($savedAds, fn($id) => $id !== $adId));
        $request->session()->put('saved_ads', $savedAds);

        return response()->json([
            'success' => true,
            'message' => 'Ad removed from saved',
            'savedCount' => count($savedAds),
        ]);
    }

    /**
     * Get saved ads page
     */
    public function savedAds(Request $request): Response
    {
        $savedAdIds = $request->session()->get('saved_ads', []);
        
        if (empty($savedAdIds)) {
            return Inertia::render('SavedAdsPage', [
                'ads' => [],
                'pagination' => [
                    'currentPage' => 1,
                    'totalItems' => 0,
                    'perPage' => 9,
                    'totalPages' => 1,
                ],
            ]);
        }

        // Fetch saved advertisements
        $ads = Advertisement::with([
            'images',
            'commonCategory:id,name',
            'listingCategory:id,name',
            'subCategory:id,name',
        ])
            ->whereIn('id', $savedAdIds)
            ->where('status', 'activated')
            ->where('payment_status', 'paid')
            ->where('post_date', '>=', now()->subDays(14))
            ->latest('post_date')
            ->get()
            ->map(function (Advertisement $advertisement) {
                // Determine if VIP or Premium based on listing category name
                $listingCategoryName = optional($advertisement->listingCategory)->name ?? '';
                $isVip = strtolower($listingCategoryName) === 'vip';
                $isPremium = strtolower($listingCategoryName) === 'premium' || strtolower($listingCategoryName) === 'super';

                // Determine if has cash back guarantee based on sub category
                $subCategoryName = optional($advertisement->subCategory)->name ?? '';
                $hasCashBackGuarantee = stripos($subCategoryName, 'cash back') !== false 
                    || stripos($subCategoryName, 'cashback') !== false;

                // Get all images
                $images = $advertisement->images->map(function ($image) {
                    return Storage::url($image->path);
                })->values()->toArray();

                // Get first image URL, or use default header image
                if (!empty($images)) {
                    $imageUrl = $images[0];
                } else {
                    $imageUrl = '/placeholder-image.jpg';
                    $images = [$imageUrl];
                }

                // Calculate time ago
                $timeAgo = $advertisement->post_date 
                    ? $this->timeAgo($advertisement->post_date)
                    : 'Recently';

                return [
                    'id' => $advertisement->id,
                    'title' => $advertisement->title,
                    'price' => (float) $advertisement->price,
                    'description' => $advertisement->description ?? '',
                    'category' => optional($advertisement->commonCategory)->name ?? 'Uncategorized',
                    'location' => $advertisement->location,
                    'time' => $timeAgo,
                    'imgSrc' => $imageUrl,
                    'images' => $images,
                    'isVip' => $isVip,
                    'isPremium' => $isPremium,
                    'hasCashBackGuarantee' => $hasCashBackGuarantee,
                    'isSaved' => true,
                ];
            })
            ->values();

        return Inertia::render('SavedAdsPage', [
            'ads' => $ads,
            'pagination' => [
                'currentPage' => 1,
                'totalItems' => $ads->count(),
                'perPage' => 9,
                'totalPages' => 1,
            ],
        ]);
    }

    /**
     * Show single ad detail page
     */
    public function show(Request $request, int $adId): Response
    {
        $advertisement = Advertisement::with([
            'images',
            'commonCategory:id,name',
            'listingCategory:id,name',
            'subCategory:id,name',
            'agent:id,name,email',
        ])
            ->where('status', 'activated')
            ->where('payment_status', 'paid')
            ->where('post_date', '>=', now()->subDays(14))
            ->findOrFail($adId);

        // Increment views count
        $advertisement->increment('views_count');

        // Determine if VIP or Premium
        $listingCategoryName = optional($advertisement->listingCategory)->name ?? '';
        $isVip = strtolower($listingCategoryName) === 'vip';
        $isPremium = strtolower($listingCategoryName) === 'premium' || strtolower($listingCategoryName) === 'super';

        // Determine if has cash back guarantee
        $subCategoryName = optional($advertisement->subCategory)->name ?? '';
        $hasCashBackGuarantee = stripos($subCategoryName, 'cash back') !== false 
            || stripos($subCategoryName, 'cashback') !== false;

        // Get all image URLs
        $images = $advertisement->images->map(function ($image) {
            return Storage::url($image->path);
        })->toArray();

        // If no images, use default header image
        if (empty($images)) {
            $images = ['/placeholder-image.jpg'];
        }

        // Calculate time ago
        $timeAgo = $advertisement->post_date 
            ? $this->timeAgo($advertisement->post_date)
            : 'Recently';

        // Get saved ad IDs from session
        $savedAdIds = $request->session()->get('saved_ads', []);
        $isSaved = in_array($adId, $savedAdIds);

        // Get related ads (same category, excluding current ad)
        $relatedAds = Advertisement::with([
            'images',
            'commonCategory:id,name',
            'listingCategory:id,name',
            'subCategory:id,name',
        ])
            ->where('status', 'activated')
            ->where('payment_status', 'paid')
            ->where('post_date', '>=', now()->subDays(14))
            ->where('common_category_id', $advertisement->common_category_id)
            ->where('id', '!=', $adId)
            ->latest('post_date')
            ->take(6)
            ->get()
            ->map(function (Advertisement $ad) {
                $listingCategoryName = optional($ad->listingCategory)->name ?? '';
                $isVip = strtolower($listingCategoryName) === 'vip';
                $isPremium = strtolower($listingCategoryName) === 'premium' || strtolower($listingCategoryName) === 'super';
                $subCategoryName = optional($ad->subCategory)->name ?? '';
                $hasCashBackGuarantee = stripos($subCategoryName, 'cash back') !== false 
                    || stripos($subCategoryName, 'cashback') !== false;

                // Get all images
                $images = $ad->images->map(function ($image) {
                    return Storage::url($image->path);
                })->values()->toArray();

                if (!empty($images)) {
                    $imageUrl = $images[0];
                } else {
                    $imageUrl = '/placeholder-image.jpg';
                    $images = [$imageUrl];
                }

                $timeAgo = $ad->post_date 
                    ? $this->timeAgo($ad->post_date)
                    : 'Recently';

                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'price' => (float) $ad->price,
                    'description' => $ad->description ?? '',
                    'category' => optional($ad->commonCategory)->name ?? 'Uncategorized',
                    'location' => $ad->location,
                    'time' => $timeAgo,
                    'imgSrc' => $imageUrl,
                    'images' => $images,
                    'isVip' => $isVip,
                    'isPremium' => $isPremium,
                    'hasCashBackGuarantee' => $hasCashBackGuarantee,
                ];
            })
            ->values();

        return Inertia::render('ListingDetailPage', [
            'ad' => [
                'id' => $advertisement->id,
                'title' => $advertisement->title,
                'price' => (float) $advertisement->price,
                'description' => $advertisement->description ?? '',
                'category' => optional($advertisement->commonCategory)->name ?? 'Uncategorized',
                'location' => $advertisement->location,
                'time' => $timeAgo,
                'images' => $images,
                'isVip' => $isVip,
                'isPremium' => $isPremium,
                'hasCashBackGuarantee' => $hasCashBackGuarantee,
                'isSaved' => $isSaved,
                'phone_number' => $advertisement->phone_number ?? null,
                'whatsapp_number' => $advertisement->whatsapp_number ?? null,
                'telegram_number' => $advertisement->telegram_number ?? null,
                'views' => $advertisement->views_count ?? 1,
                'likes' => $advertisement->likes_count ?? 0,
            ],
            'relatedAds' => $relatedAds,
        ]);
    }

    /**
     * Calculate time ago string
     */
    private function timeAgo($datetime): string
    {
        $now = now();
        $diff = $now->diffInSeconds($datetime);

        if ($diff < 60) {
            return 'Just now';
        } elseif ($diff < 3600) {
            $minutes = floor($diff / 60);
            return $minutes . ' ' . ($minutes === 1 ? 'minute' : 'minutes') . ' ago';
        } elseif ($diff < 86400) {
            $hours = floor($diff / 3600);
            return $hours . ' ' . ($hours === 1 ? 'hour' : 'hours') . ' ago';
        } elseif ($diff < 604800) {
            $days = floor($diff / 86400);
            return $days . ' ' . ($days === 1 ? 'day' : 'days') . ' ago';
        } elseif ($diff < 2592000) {
            $weeks = floor($diff / 604800);
            return $weeks . ' ' . ($weeks === 1 ? 'week' : 'weeks') . ' ago';
        } else {
            $months = floor($diff / 2592000);
            return $months . ' ' . ($months === 1 ? 'month' : 'months') . ' ago';
        }
    }

    /**
     * Display agents listing page
     */
    public function agents(Request $request): Response
    {
        $page = (int) $request->query('page', 1);
        $perPage = 12;

        // Fetch active agents
        $query = Agent::where('is_active', true)
            ->latest('created_at');

        // Get total count for pagination
        $totalAgents = $query->count();

        // Paginate results
        $agents = $query->skip(($page - 1) * $perPage)
            ->take($perPage)
            ->get()
            ->map(function (Agent $agent) {
                return [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'email' => $agent->email,
                    'number' => $agent->number,
                    'profile_picture' => $agent->profile_picture 
                        ? Storage::url($agent->profile_picture) 
                        : null,
                ];
            })
            ->values();

        return Inertia::render('AgentsPage', [
            'agents' => $agents,
            'pagination' => [
                'currentPage' => $page,
                'totalItems' => $totalAgents,
                'perPage' => $perPage,
                'totalPages' => $totalAgents > 0 ? ceil($totalAgents / $perPage) : 1,
            ],
        ]);
    }

    /**
     * Like an ad
     */
    public function likeAd(Request $request, int $adId): JsonResponse
    {
        $ad = Advertisement::findOrFail($adId);
        $ad->increment('likes_count');
        
        return response()->json([
            'success' => true,
            'message' => 'Ad liked successfully',
            'likes' => $ad->likes_count
        ]);
    }
}
