<?php

namespace App\Http\Controllers;

use App\Models\AdTransaction;
use App\Models\AdsPrice;
use App\Models\Advertisement;
use App\Models\BankAccount;
use App\Models\CommonCategory;
use App\Models\ListingCategory;
use App\Models\SubCategory;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AgentAdController extends Controller
{
    public function create(Request $request): Response
    {
        $agent = Auth::guard('agent')->user();
        Log::info('Agent requested post form', ['agent_id' => $agent->id]);

        $commonCategories = CommonCategory::orderBy('name')->get(['id', 'name']);
        
        $listingCategories = ListingCategory::orderBy('sort_order')->orderBy('name')
            ->get(['id', 'name', 'price'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'price' => $category->price !== null 
                        ? number_format((float) $category->price, 2, '.', '')
                        : null,
                ];
            })
            ->values();
        
        $subCategories = SubCategory::orderBy('name')->get(['id', 'name']);

        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'post',
            'postAdData' => [
                'commonCategories' => $commonCategories,
                'listingCategories' => $listingCategories,
                'subCategories' => $subCategories,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->merge([
            'listing_category_id' => $request->input('listing_category_id') ?: null,
            'sub_category_id' => $request->input('sub_category_id') ?: null,
        ]);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'location' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:255'],
            'telegram_number' => ['nullable', 'string', 'max:255'],
            'common_category_id' => ['required', 'exists:common_categories,id'],
            'listing_category_id' => ['nullable', 'exists:listing_categories,id'],
            'sub_category_id' => ['nullable', 'exists:sub_categories,id'],
            'images' => ['required', 'array', 'min:1', 'max:3'],
            'images.*' => ['image', 'max:5120'],
        ]);

        $agent = Auth::guard('agent')->user();
        Log::info('Attempting to create advertisement', [
            'agent_id' => $agent->id,
            'title' => $validated['title'],
        ]);

        DB::transaction(function () use ($request, $validated, $agent) {
            $uploadedImages = $request->file('images');

            $advertisement = Advertisement::create([
                'agent_id' => $agent->id,
                'code' => $this->generateUniqueCode(),
                'status' => 'deactivated',
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'location' => $validated['location'],
                'phone_number' => $validated['phone_number'] ?? null,
                'whatsapp_number' => $validated['whatsapp_number'] ?? null,
                'telegram_number' => $validated['telegram_number'] ?? null,
                'common_category_id' => $validated['common_category_id'],
                'listing_category_id' => $validated['listing_category_id'] ?? null,
                'sub_category_id' => $validated['sub_category_id'] ?? null,
                'post_date' => now(),
            ]);

            Log::info('Advertisement record created', ['ad_id' => $advertisement->id]);

            if ($uploadedImages && is_array($uploadedImages)) {
                foreach ($uploadedImages as $uploadedImage) {
                    if ($uploadedImage instanceof \Illuminate\Http\UploadedFile) {
                        $path = $uploadedImage->store('ad-images', 'public');
                        $advertisement->images()->create([
                            'path' => $path,
                        ]);

                        // --- WATERMARK LOGIC (Native PHP GD) ---
                        try {
                            $fullPath = storage_path('app/public/' . $path);
                            $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

                            $img = null;
                            if (in_array($ext, ['jpg', 'jpeg'])) {
                                $img = @imagecreatefromjpeg($fullPath);
                            } elseif ($ext == 'png') {
                                $img = @imagecreatefrompng($fullPath);
                            }

                            if ($img) {
                                $width = imagesx($img);
                                $height = imagesy($img);
                                
                                $text = 'tintin.com';
                                $font = 5;
                                $fw = imagefontwidth($font) * strlen($text);
                                $fh = imagefontheight($font);
                                
                                $x = $width - $fw - 15;
                                $y = $height - $fh - 15;
                                
                                // Add semi-transparent black background box
                                $bg = imagecolorallocatealpha($img, 0, 0, 0, 80);
                                imagefilledrectangle($img, $x - 10, $y - 10, $x + $fw + 10, $y + $fh + 10, $bg);
                                
                                // Add white text
                                $color = imagecolorallocate($img, 255, 255, 255);
                                imagestring($img, $font, $x, $y, $text, $color);
                                
                                if (in_array($ext, ['jpg', 'jpeg'])) {
                                    imagejpeg($img, $fullPath, 90);
                                } elseif ($ext == 'png') {
                                    imagepng($img, $fullPath);
                                }
                                imagedestroy($img);
                            }
                        } catch (\Exception $e) {
                            \Illuminate\Support\Facades\Log::error('Watermark failed: ' . $e->getMessage());
                        }
                        // --- END WATERMARK LOGIC ---


                        Log::info('Advertisement image stored', [
                            'ad_id' => $advertisement->id,
                            'path' => $path,
                        ]);

                        // --- WATERMARK LOGIC (Native PHP GD) ---
                        try {
                            $fullPath = storage_path('app/public/' . $path);
                            $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

                            $img = null;
                            if (in_array($ext, ['jpg', 'jpeg'])) {
                                $img = @imagecreatefromjpeg($fullPath);
                            } elseif ($ext == 'png') {
                                $img = @imagecreatefrompng($fullPath);
                            }

                            if ($img) {
                                $width = imagesx($img);
                                $height = imagesy($img);
                                
                                $text = 'tintin.com';
                                $font = 5;
                                $fw = imagefontwidth($font) * strlen($text);
                                $fh = imagefontheight($font);
                                
                                $x = $width - $fw - 15;
                                $y = $height - $fh - 15;
                                
                                // Add semi-transparent black background box
                                $bg = imagecolorallocatealpha($img, 0, 0, 0, 80);
                                imagefilledrectangle($img, $x - 10, $y - 10, $x + $fw + 10, $y + $fh + 10, $bg);
                                
                                // Add white text
                                $color = imagecolorallocate($img, 255, 255, 255);
                                imagestring($img, $font, $x, $y, $text, $color);
                                
                                if (in_array($ext, ['jpg', 'jpeg'])) {
                                    imagejpeg($img, $fullPath, 90);
                                } elseif ($ext == 'png') {
                                    imagepng($img, $fullPath);
                                }
                                imagedestroy($img);
                            }
                        } catch (\Exception $e) {
                            \Illuminate\Support\Facades\Log::error('Watermark failed: ' . $e->getMessage());
                        }
                        // --- END WATERMARK LOGIC ---

                    }
                }
            }
        });

        return redirect()
            ->route('agent.ads')
            ->with('success', 'Advertisement created successfully.');
    }

    public function edit(Request $request, $id): Response
    {
        $agent = Auth::guard('agent')->user();
        $advertisement = Advertisement::where('agent_id', $agent->id)->with('images')->findOrFail($id);
        
        Log::info('Agent requested edit form', ['agent_id' => $agent->id, 'ad_id' => $id]);

        $commonCategories = CommonCategory::orderBy('name')->get(['id', 'name']);
        
        $listingCategories = ListingCategory::orderBy('sort_order')->orderBy('name')
            ->get(['id', 'name', 'price'])
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'price' => $category->price !== null 
                        ? number_format((float) $category->price, 2, '.', '')
                        : null,
                ];
            })
            ->values();
        
        $subCategories = SubCategory::orderBy('name')->get(['id', 'name']);

        // Format ad images for frontend
        $advertisement->formatted_images = $advertisement->images->map(function($img) {
             return Storage::url($img->path);
        });

        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'post',
            'postAdData' => [
                'commonCategories' => $commonCategories,
                'listingCategories' => $listingCategories,
                'subCategories' => $subCategories,
                'ad' => $advertisement,
                'isEditing' => true,
            ],
        ]);
    }

    public function update(Request $request, $id): RedirectResponse
    {
        $agent = Auth::guard('agent')->user();
        $advertisement = Advertisement::where('agent_id', $agent->id)->findOrFail($id);

        $request->merge([
            'listing_category_id' => $request->input('listing_category_id') ?: null,
            'sub_category_id' => $request->input('sub_category_id') ?: null,
        ]);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'location' => ['required', 'string', 'max:255'],
            'phone_number' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:255'],
            'telegram_number' => ['nullable', 'string', 'max:255'],
            'common_category_id' => ['required', 'exists:common_categories,id'],
            'listing_category_id' => ['nullable', 'exists:listing_categories,id'],
            'sub_category_id' => ['nullable', 'exists:sub_categories,id'],
            'images' => ['nullable', 'array', 'min:1', 'max:3'],
            'images.*' => ['image', 'max:5120'],
        ]);

        DB::transaction(function () use ($request, $validated, $advertisement) {
            $advertisement->update([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price' => $validated['price'],
                'location' => $validated['location'],
                'phone_number' => $validated['phone_number'] ?? null,
                'whatsapp_number' => $validated['whatsapp_number'] ?? null,
                'telegram_number' => $validated['telegram_number'] ?? null,
                'common_category_id' => $validated['common_category_id'],
                'listing_category_id' => $validated['listing_category_id'] ?? null,
                'sub_category_id' => $validated['sub_category_id'] ?? null,
            ]);

            $uploadedImages = $request->file('images');

            if ($uploadedImages && is_array($uploadedImages) && count($uploadedImages) > 0) {
                // If new images uploaded, remove old ones
                foreach ($advertisement->images as $image) {
                    if (Storage::disk('public')->exists($image->path)) {
                        Storage::disk('public')->delete($image->path);
                    }
                    $image->delete();
                }

                // Add new ones
                foreach ($uploadedImages as $uploadedImage) {
                    if ($uploadedImage instanceof \Illuminate\Http\UploadedFile) {
                        $path = $uploadedImage->store('ad-images', 'public');
                        $advertisement->images()->create([
                            'path' => $path,
                        ]);

                        // --- WATERMARK LOGIC (Native PHP GD) ---
                        try {
                            $fullPath = storage_path('app/public/' . $path);
                            $ext = strtolower(pathinfo($fullPath, PATHINFO_EXTENSION));

                            $img = null;
                            if (in_array($ext, ['jpg', 'jpeg'])) {
                                $img = @imagecreatefromjpeg($fullPath);
                            } elseif ($ext == 'png') {
                                $img = @imagecreatefrompng($fullPath);
                            }

                            if ($img) {
                                $width = imagesx($img);
                                $height = imagesy($img);
                                
                                $text = 'tintin.com';
                                $font = 5;
                                $fw = imagefontwidth($font) * strlen($text);
                                $fh = imagefontheight($font);
                                
                                $x = $width - $fw - 15;
                                $y = $height - $fh - 15;
                                
                                // Add semi-transparent black background box
                                $bg = imagecolorallocatealpha($img, 0, 0, 0, 80);
                                imagefilledrectangle($img, $x - 10, $y - 10, $x + $fw + 10, $y + $fh + 10, $bg);
                                
                                // Add white text
                                $color = imagecolorallocate($img, 255, 255, 255);
                                imagestring($img, $font, $x, $y, $text, $color);
                                
                                if (in_array($ext, ['jpg', 'jpeg'])) {
                                    imagejpeg($img, $fullPath, 90);
                                } elseif ($ext == 'png') {
                                    imagepng($img, $fullPath);
                                }
                                imagedestroy($img);
                            }
                        } catch (\Exception $e) {
                            \Illuminate\Support\Facades\Log::error('Watermark failed: ' . $e->getMessage());
                        }
                        // --- END WATERMARK LOGIC ---

                    }
                }
            }
        });

        return redirect()
            ->route('agent.ads')
            ->with('success', 'Advertisement updated successfully.');
    }

    public function index(Request $request): Response
    {
        $agent = Auth::guard('agent')->user();
        $userId = $agent->id;

        $ads = Advertisement::with([
            'images', 'commonCategory:id,name', 'listingCategory:id,name', 'subCategory:id,name',
        ])
            ->where('agent_id', $userId)
            ->latest('post_date')
            ->get()
            ->map(function (Advertisement $advertisement) {
                return [
                    'id' => $advertisement->id,
                    'title' => $advertisement->title,
                    'description' => $advertisement->description,
                    'price' => (string) $advertisement->price,
                    'location' => $advertisement->location,
                    'status' => $advertisement->status,
                    'code' => $advertisement->code,
                    'post_date' => optional($advertisement->post_date)->toDateTimeString(),
                    'common_category' => optional($advertisement->commonCategory)->name,
                    'listing_category' => optional($advertisement->listingCategory)->name,
                    'sub_category' => optional($advertisement->subCategory)->name,
                    'image_url' => $advertisement->images->first()
                        ? Storage::url($advertisement->images->first()->path)
                        : '/placeholder-image.jpg',
                ];
            })->values();

        Log::info('Loaded advertisements for agent', ['agent_id' => $userId, 'count' => $ads->count()]);

        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'ads',
            'adsData' => [
                'ads' => $ads,
            ],
        ]);
    }

    public function payments(Request $request): Response
    {
        $agent = Auth::guard('agent')->user();
        $userId = $agent->id;

        $adOptions = Advertisement::where('advertisements.agent_id', $userId)
            ->where('advertisements.payment_status', 'unpaid')
            ->leftJoin('listing_categories', 'advertisements.listing_category_id', '=', 'listing_categories.id')
            ->select(
                'advertisements.id',
                'advertisements.code',
                'advertisements.title',
                'listing_categories.price as listing_category_price'
            )
            ->latest('advertisements.created_at')
            ->get()
            ->map(function ($advertisement) {
                $listingCategoryPrice = $advertisement->listing_category_price 
                    ? number_format((float) $advertisement->listing_category_price, 2, '.', '')
                    : null;
                
                return [
                    'id' => $advertisement->id,
                    'code' => $advertisement->code,
                    'title' => $advertisement->title,
                    'listing_category_price' => $listingCategoryPrice,
                ];
            })->values();

        $priceOptions = AdsPrice::orderBy('price')
            ->get(['id', 'name', 'price'])
            ->map(function (AdsPrice $price) {
                $normalizedPrice = $price->price !== null
                    ? number_format((float) $price->price, 2, '.', '')
                    : null;

                return [
                    'id' => $price->id,
                    'name' => $price->name,
                    'price' => $normalizedPrice,
                ];
            })
            ->filter(fn ($option) => $option['price'] !== null)
            ->values();

        $bankAccounts = BankAccount::where('is_active', true)
            ->orderBy('bank_name')
            ->get()
            ->map(function (BankAccount $bank) {
                return [
                    'id' => $bank->id,
                    'bank_name' => $bank->bank_name,
                    'account_number' => $bank->getAccountNumberForSearch(), // Decrypted account number
                ];
            })
            ->values();

        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'payments',
            'paymentData' => [
                'adOptions' => $adOptions,
                'priceOptions' => $priceOptions,
                'bankAccounts' => $bankAccounts,
            ],
        ]);
    }

    public function storeTransaction(Request $request)
    {
        $agent = Auth::guard('agent')->user();

        try {
            $validated = $request->validate([
                'adId' => ['required', 'integer', 'exists:advertisements,id'],
                'accountNumber' => ['required', 'string', 'max:255'],
                'bankReference' => ['required', 'string', 'max:255'],
                'amount' => ['required', 'numeric', 'min:0'],
                'paymentDate' => ['required'],
                'notes' => ['nullable', 'string'],
                'receiptFile' => ['required', 'file', 'mimes:jpeg,png,jpg,pdf', 'max:5120'],
            ]);

            $advertisement = Advertisement::where('agent_id', $agent->id)->findOrFail($validated['adId']);

            $receiptFile = $request->file('receiptFile');
            if (!$receiptFile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Receipt file is required.',
                ], 422);
            }

            $receiptPath = $receiptFile->store('transactions', 'public');

            // Parse payment date (handles datetime-local format)
            try {
                $paymentDateTime = Carbon::parse($validated['paymentDate']);
            } catch (\Exception $e) {
                Log::error('Payment date parsing failed', [
                    'paymentDate' => $validated['paymentDate'],
                    'error' => $e->getMessage(),
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid payment date format.',
                    'error' => $e->getMessage(),
                ], 422);
            }

            AdTransaction::create([
                'agent_id' => $agent->id,
                'advertisement_id' => $advertisement->id,
                'account_number' => $validated['accountNumber'],
                'bank_reference_number' => $validated['bankReference'],
                'amount' => (float) $validated['amount'],
                'commission' => 100,
                'payment_datetime' => $paymentDateTime,
                'receipt_path' => $receiptPath,
                'notes' => $validated['notes'] ?? null,
                'status' => 'Pending Review',
            ]);

            // Leave the advertisement as deactivated until Admin approves it
            // but we can set payment_status to 'review' if needed (currently we just wait for transaction approval)
            $advertisement->update([
                'payment_status' => 'review',
            ]);

            Log::info('Payment transaction created', [
                'agent_id' => $agent->id,
                'advertisement_id' => $advertisement->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment report submitted successfully.',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Payment transaction validation failed', [
                'errors' => $e->errors(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed. Please check your input.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment transaction creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit payment report. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    protected function generateUniqueCode(): string
    {
        do {
            $code = 'AD-' . strtoupper(Str::random(6));
        } while (Advertisement::where('code', $code)->exists());

        return $code;
    }

    public function codes(Request $request): JsonResponse
    {
        $agent = Auth::guard('agent')->user();
        $codes = Advertisement::where('agent_id', $agent->id)
            ->orderByDesc('created_at')
            ->get(['id', 'code', 'title']);

        return response()->json($codes);
    }

    public function commissionHistory(Request $request): Response
    {
        $agent = Auth::guard('agent')->user();
        $userId = $agent->id;

        $transactions = AdTransaction::with('advertisement')
            ->where('agent_id', $userId)
            ->latest('payment_datetime')
            ->get()
            ->map(function (AdTransaction $transaction) {
                $commissionRate = $transaction->amount > 0 
                    ? ($transaction->commission / $transaction->amount) 
                    : 0;

                return [
                    'id' => (string) $transaction->id,
                    'date' => $transaction->payment_datetime->format('M d, Y'),
                    'clientId' => $transaction->advertisement->code ?? "AD-{$transaction->advertisement_id}",
                    'paidAmount' => (float) $transaction->amount,
                    'commissionRate' => $commissionRate,
                    'earnedAmount' => (float) $transaction->commission,
                    'status' => $transaction->status ?? 'Pending Review',
                ];
            })
            ->values();

        $totalCommissionEarned = AdTransaction::where('agent_id', $userId)
            ->sum('commission');

        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'commission',
            'commissionData' => [
                'transactions' => $transactions,
                'totalCommissionEarned' => (float) $totalCommissionEarned,
            ],
        ]);
    }

    public function toggleStatus(Request $request, $id): RedirectResponse
    {
        $agent = Auth::guard('agent')->user();
        $advertisement = Advertisement::where('agent_id', $agent->id)->findOrFail($id);

        if ($advertisement->status === 'active') {
            $advertisement->status = 'paused';
        } elseif ($advertisement->status === 'paused') {
            $advertisement->status = 'active';
        }

        $advertisement->save();

        Log::info('Agent toggled ad status', ['agent_id' => $agent->id, 'ad_id' => $id, 'new_status' => $advertisement->status]);

        return redirect()->back()->with('success', 'Advertisement status updated.');
    }

    public function bumpAd(Request $request, $id): RedirectResponse
    {
        $agent = Auth::guard('agent')->user();
        $advertisement = Advertisement::where('agent_id', $agent->id)->findOrFail($id);

        $advertisement->post_date = now();
        $advertisement->save();

        Log::info('Agent bumped ad', ['agent_id' => $agent->id, 'ad_id' => $id]);

        return redirect()->back()->with('success', 'Advertisement bumped to top successfully.');
    }

    public function deleteAd(Request $request, $id): RedirectResponse
    {
        $agent = Auth::guard('agent')->user();
        $advertisement = Advertisement::where('agent_id', $agent->id)->findOrFail($id);

        $advertisement->delete();

        Log::info('Agent deleted ad', ['agent_id' => $agent->id, 'ad_id' => $id]);

        return redirect()->back()->with('success', 'Advertisement deleted successfully.');
    }

    public function profile(Request $request): Response
    {
        $agent = Auth::guard('agent')->user();

        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'profile',
            'profileData' => [
                'userData' => [
                    'id' => $agent->id,
                    'name' => $agent->name,
                    'email' => $agent->email,
                    'number' => $agent->number,
                    'whatsapp_number' => $agent->whatsapp_number,
                    'telegram_number' => $agent->telegram_number,
                    'profile_picture' => $agent->profile_picture 
                        ? (Storage::disk('public')->exists($agent->profile_picture) 
                            ? Storage::url($agent->profile_picture) 
                            : null)
                        : null,
                    'created_at' => $agent->created_at?->toISOString(),
                    'updated_at' => $agent->updated_at?->toISOString(),
                ],
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $agent = Auth::guard('agent')->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:agents,email,' . $agent->id],
            'number' => ['nullable', 'string', 'max:255'],
            'whatsapp_number' => ['nullable', 'string', 'max:255'],
            'telegram_number' => ['nullable', 'string', 'max:255'],
            'profile_picture' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:5120'],
        ]);

        try {
            // Handle profile picture upload
            if ($request->hasFile('profile_picture')) {
                // Delete old profile picture if exists
                if ($agent->profile_picture) {
                    Storage::disk('public')->delete($agent->profile_picture);
                }

                $profilePath = $request->file('profile_picture')->store('profile-pictures', 'public');
                $validated['profile_picture'] = $profilePath;
            } else {
                unset($validated['profile_picture']);
            }

            // Convert empty strings to null for optional number fields
            if (isset($validated['number']) && $validated['number'] === '') {
                $validated['number'] = null;
            }
            if (isset($validated['whatsapp_number']) && $validated['whatsapp_number'] === '') {
                $validated['whatsapp_number'] = null;
            }
            if (isset($validated['telegram_number']) && $validated['telegram_number'] === '') {
                $validated['telegram_number'] = null;
            }

            $agent->update($validated);

            Log::info('Profile updated', [
                'agent_id' => $agent->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Profile update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}


