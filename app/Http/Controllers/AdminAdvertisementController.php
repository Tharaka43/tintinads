<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\AdvertisementImage;
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

            // Apply status filter
            if ($request->has('status') && $request->status !== 'All Status') {
                $statusReq = strtolower($request->status);
                if ($statusReq === 'active') {
                    $query->where('status', 'activated')->unexpired();
                } elseif ($statusReq === 'expired') {
                    // Match expired ads (status is expired OR status is activated and past expiry)
                    $query->where(function ($q) {
                        $q->where('status', 'expired')
                          ->orWhere(function ($activeSub) {
                              $activeSub->where('status', 'activated')
                                  ->where(function ($exp) {
                                      $exp->whereNull('post_date')
                                          ->orWhere(function ($sub) {
                                              $sub->where('listing_category_id', 4)->where('post_date', '<', now()->subDays(30));
                                          })
                                          ->orWhere(function ($sub) {
                                              $sub->where('listing_category_id', 1)->where('post_date', '<', now()->subDays(3));
                                          })
                                          ->orWhere(function ($sub) {
                                              $sub->where('listing_category_id', 2)->where('post_date', '<', now()->subDays(2));
                                          })
                                          ->orWhere(function ($sub) {
                                              $sub->where(function ($sub2) {
                                                  $sub2->where('listing_category_id', 3)->orWhereNull('listing_category_id');
                                              })->where('post_date', '<', now()->subDays(1));
                                          });
                                  });
                          });
                    });
                } elseif ($statusReq === 'featured') {
                    $query->where('status', 'activated')
                        ->unexpired()
                        ->whereHas('listingCategory', function ($q) {
                            $q->whereIn('name', ['VIP', 'Premium', 'Super', 'Platinum', 'Featured']);
                        });
                } elseif ($statusReq === 'pending review' || $statusReq === 'pending' || $statusReq === 'deactivated') {
                    $query->whereIn('status', ['deactivated', 'pending']);
                } elseif ($statusReq === 'blocked') {
                    $query->where('status', 'blocked');
                } else {
                    $query->where('status', $request->status);
                }
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

            // Search by Title, Code, Description, Location, ID, or Phone/WhatsApp Number
            if ($request->has('search') && $request->search) {
                $search = trim($request->search);
                $cleanDigits = preg_replace('/[^0-9]/', '', $search);

                $query->where(function ($q) use ($search, $cleanDigits) {
                    $q->where('title', 'like', '%' . $search . '%')
                      ->orWhere('code', 'like', '%' . $search . '%')
                      ->orWhere('description', 'like', '%' . $search . '%')
                      ->orWhere('location', 'like', '%' . $search . '%');

                    // If numeric Ad ID (e.g. 182, #182)
                    $numericOnly = ltrim(trim($search, '# '), '0');
                    if ($numericOnly !== '' && is_numeric($numericOnly)) {
                        $q->orWhere('id', (int) $numericOnly);
                    }

                    // Search by Phone or WhatsApp number if digits exist
                    if (!empty($cleanDigits) && strlen($cleanDigits) >= 3) {
                        $q->orWhere('phone_number', 'like', '%' . $cleanDigits . '%')
                          ->orWhere('whatsapp_number', 'like', '%' . $cleanDigits . '%');

                        if (str_starts_with($cleanDigits, '0') && strlen($cleanDigits) >= 9) {
                            $withoutZero = substr($cleanDigits, 1);
                            $q->orWhere('phone_number', 'like', '%' . $withoutZero . '%')
                              ->orWhere('whatsapp_number', 'like', '%' . $withoutZero . '%');
                        }

                        if (str_starts_with($cleanDigits, '94') && strlen($cleanDigits) >= 11) {
                            $without94 = substr($cleanDigits, 2);
                            $q->orWhere('phone_number', 'like', '%' . $without94 . '%')
                              ->orWhere('whatsapp_number', 'like', '%' . $without94 . '%');
                        }
                    }
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
                ->latest('id')
                ->skip($offset)
                ->take($perPage)
                ->get()
                ->map(function (Advertisement $advertisement) {
                // Get all images
                $allImages = $advertisement->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'url' => Storage::url($img->path),
                        'path' => $img->path,
                    ];
                })->values();

                // Get first image URL, or use default header image
                $imageUrl = $allImages->first() ? $allImages->first()['url'] : '/placeholder-image.jpg';

                // Determine if featured (check listing category for VIP/Premium)
                $listingCategoryName = optional($advertisement->listingCategory)->name ?? '';
                $isFeatured = in_array(strtolower($listingCategoryName), ['vip', 'premium', 'super', 'platinum', 'featured']) 
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
                    'images' => $allImages,
                    'isFeatured' => $isFeatured,
                    'isExpired' => $isExpired,
                    'listing_category_id' => $advertisement->listing_category_id,
                    'listing_category_name' => $listingCategoryName,
                    'isSelected' => false,
                    'advertisement_id' => $advertisement->id,
                    'receiptPath' => $receiptPath,
                    'phone_number' => $advertisement->phone_number ?? null,
                    'whatsapp_number' => $advertisement->whatsapp_number ?? null,
                ];
            });

            // Get statistics
            $expiredQuery = Advertisement::where(function ($q) {
                $q->where('status', 'expired')
                  ->orWhere(function ($activeSub) {
                      $activeSub->where('status', 'activated')
                          ->where(function ($exp) {
                              $exp->whereNull('post_date')
                                  ->orWhere(function ($sub) {
                                      $sub->where('listing_category_id', 4)->where('post_date', '<', now()->subDays(30));
                                  })
                                  ->orWhere(function ($sub) {
                                      $sub->where('listing_category_id', 1)->where('post_date', '<', now()->subDays(3));
                                  })
                                  ->orWhere(function ($sub) {
                                      $sub->where('listing_category_id', 2)->where('post_date', '<', now()->subDays(2));
                                  })
                                  ->orWhere(function ($sub) {
                                      $sub->where(function ($sub2) {
                                          $sub2->where('listing_category_id', 3)->orWhereNull('listing_category_id');
                                      })->where('post_date', '<', now()->subDays(1));
                                  });
                          });
                  });
            });

            $stats = [
                'totalAds' => Advertisement::count(),
                'activeAds' => Advertisement::where('status', 'activated')->unexpired()->count(),
                'expiredAds' => (clone $expiredQuery)->count(),
                'blockedAds' => Advertisement::where('status', 'blocked')->count(),
                'featuredAds' => Advertisement::where('status', 'activated')->unexpired()
                    ->whereHas('listingCategory', function ($q) {
                        $q->whereIn('name', ['VIP', 'Premium', 'Featured', 'Platinum', 'Super']);
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

    /**
     * Renew / Reactivate expired advertisement(s)
     */
    public function renew(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'ad_id' => ['nullable', 'integer', 'exists:advertisements,id'],
                'ad_ids' => ['nullable', 'array'],
                'ad_ids.*' => ['integer', 'exists:advertisements,id'],
                'listing_category_id' => ['nullable', 'integer', 'in:1,2,3,4'],
            ]);

            $ids = [];
            if (!empty($validated['ad_id'])) {
                $ids[] = $validated['ad_id'];
            }
            if (!empty($validated['ad_ids'])) {
                $ids = array_unique(array_merge($ids, $validated['ad_ids']));
            }

            if (empty($ids)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No advertisement IDs provided.',
                ], 422);
            }

            $updateData = [
                'status' => 'activated',
                'payment_status' => 'paid',
                'post_date' => now(),
            ];

            if (!empty($validated['listing_category_id'])) {
                $updateData['listing_category_id'] = $validated['listing_category_id'];
            }

            $count = Advertisement::whereIn('id', $ids)->update($updateData);

            Log::info('Advertisements renewed by admin', [
                'ad_ids' => $ids,
                'category' => $validated['listing_category_id'] ?? 'unchanged',
                'count' => $count,
            ]);

            return response()->json([
                'success' => true,
                'message' => "Successfully renewed {$count} advertisement(s).",
                'count' => $count,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to renew advertisements', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to renew advertisement(s).',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all images for a specific advertisement
     */
    public function getImages(int $adId): JsonResponse
    {
        try {
            $ad = Advertisement::with('images')->findOrFail($adId);

            $images = $ad->images->map(function ($img) {
                return [
                    'id' => $img->id,
                    'url' => Storage::url($img->path),
                    'path' => $img->path,
                    'created_at' => $img->created_at ? $img->created_at->format('Y-m-d H:i') : '',
                ];
            });

            return response()->json([
                'success' => true,
                'ad_id' => $ad->id,
                'ad_title' => $ad->title,
                'ad_code' => $ad->code,
                'images' => $images,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve images.',
                'error' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Upload new images for a specific advertisement
     */
    public function uploadImages(Request $request, int $adId): JsonResponse
    {
        try {
            $ad = Advertisement::findOrFail($adId);

            $request->validate([
                'images' => ['nullable', 'array'],
                'images.*' => ['file', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
                'image' => ['nullable', 'file', 'mimes:jpeg,png,jpg,webp', 'max:10240'],
            ]);

            $files = [];
            if ($request->hasFile('images')) {
                $files = $request->file('images');
            } elseif ($request->hasFile('image')) {
                $files = [$request->file('image')];
            }

            if (empty($files)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No image files provided.',
                ], 422);
            }

            $addedImages = [];
            foreach ($files as $file) {
                if ($file instanceof \Illuminate\Http\UploadedFile) {
                    $path = $file->store('ad-images', 'public');
                    $this->watermarkImage($path);

                    $imgRecord = $ad->images()->create([
                        'path' => $path,
                    ]);

                    $addedImages[] = [
                        'id' => $imgRecord->id,
                        'url' => Storage::url($imgRecord->path),
                        'path' => $imgRecord->path,
                    ];
                }
            }

            // Return all images of this ad
            $allImages = $ad->fresh()->images->map(function ($img) {
                return [
                    'id' => $img->id,
                    'url' => Storage::url($img->path),
                    'path' => $img->path,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => count($addedImages) . ' image(s) uploaded successfully.',
                'added_count' => count($addedImages),
                'images' => $allImages,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to upload images for ad', [
                'ad_id' => $adId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload images: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete an image from storage and database
     */
    public function deleteImage(int $imageId): JsonResponse
    {
        try {
            $image = AdvertisementImage::findOrFail($imageId);
            $adId = $image->advertisement_id;

            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }

            $image->delete();

            $remainingImages = AdvertisementImage::where('advertisement_id', $adId)->get()->map(function ($img) {
                return [
                    'id' => $img->id,
                    'url' => Storage::url($img->path),
                    'path' => $img->path,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Image deleted successfully.',
                'images' => $remainingImages,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete ad image', [
                'image_id' => $imageId,
                'error' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete image: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Watermark an image with tintinads.com badge using GD
     */
    private function watermarkImage(string $path): void
    {
        try {
            $fullPath = storage_path('app/public/' . $path);
            if (!file_exists($fullPath)) {
                return;
            }

            $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));
            $img = null;
            if (in_array($ext, ['jpg', 'jpeg'])) {
                $img = @imagecreatefromjpeg($fullPath);
            } elseif ($ext === 'png') {
                $img = @imagecreatefrompng($fullPath);
            } elseif ($ext === 'webp' && function_exists('imagecreatefromwebp')) {
                $img = @imagecreatefromwebp($fullPath);
            }

            if ($img) {
                $width = imagesx($img);
                $height = imagesy($img);

                $text = 'tintinads.com';
                $font = 5;
                $fw = imagefontwidth($font) * strlen($text);
                $fh = imagefontheight($font);

                $x = $width - $fw - 15;
                $y = $height - $fh - 15;

                // Add semi-transparent black background box
                $bg = imagecolorallocatealpha($img, 0, 0, 0, 80);
                imagefilledrectangle($img, max(0, $x - 10), max(0, $y - 10), min($width, $x + $fw + 10), min($height, $y + $fh + 10), $bg);

                // Add white text
                $color = imagecolorallocate($img, 255, 255, 255);
                imagestring($img, $font, $x, $y, $text, $color);

                if (in_array($ext, ['jpg', 'jpeg'])) {
                    imagejpeg($img, $fullPath, 90);
                } elseif ($ext === 'png') {
                    imagepng($img, $fullPath);
                } elseif ($ext === 'webp' && function_exists('imagewebp')) {
                    imagewebp($img, $fullPath, 90);
                }
                imagedestroy($img);
            }
        } catch (\Throwable $e) {
            Log::warning('Watermark failed on admin image upload: ' . $e->getMessage());
        }
    }
}

