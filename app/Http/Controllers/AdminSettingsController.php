<?php

namespace App\Http\Controllers;

use App\Models\AdsPrice;
use App\Models\CommonCategory;
use App\Models\ListingCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminSettingsController extends Controller
{
    /**
     * Get all listing categories
     */
    public function getListingCategories(Request $request): JsonResponse
    {
        try {
            $categories = ListingCategory::orderBy('sort_order', 'asc')->orderBy('name', 'asc')->get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'price' => (float) $category->price,
                    'sort_order' => $category->sort_order,
                ];
            });

            return response()->json([
                'success' => true,
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch listing categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch listing categories.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new listing category
     */
    public function storeListingCategory(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:listing_categories,name'],
                'price' => ['required', 'numeric', 'min:0'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
            ]);

            $listingCategory = ListingCategory::create([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'sort_order' => $validated['sort_order'] ?? 0,
            ]);

            Log::info('Listing category created by admin', [
                'id' => $listingCategory->id,
                'name' => $listingCategory->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Listing category created successfully.',
                'category' => [
                    'id' => $listingCategory->id,
                    'name' => $listingCategory->name,
                    'price' => (float) $listingCategory->price,
                    'sort_order' => $listingCategory->sort_order,
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create listing category', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create listing category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a listing category
     */
    public function updateListingCategory(Request $request, $id): JsonResponse
    {
        try {
            $listingCategory = ListingCategory::findOrFail($id);

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:listing_categories,name,' . $id],
                'price' => ['required', 'numeric', 'min:0'],
                'sort_order' => ['nullable', 'integer', 'min:0'],
            ]);

            $listingCategory->update([
                'name' => $validated['name'],
                'price' => $validated['price'],
                'sort_order' => $validated['sort_order'] ?? $listingCategory->sort_order,
            ]);

            Log::info('Listing category updated by admin', [
                'id' => $listingCategory->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Listing category updated successfully.',
                'category' => [
                    'id' => $listingCategory->id,
                    'name' => $listingCategory->name,
                    'price' => (float) $listingCategory->price,
                    'sort_order' => $listingCategory->sort_order,
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update listing category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update listing category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a listing category
     */
    public function deleteListingCategory(Request $request, $id): JsonResponse
    {
        try {
            $listingCategory = ListingCategory::findOrFail($id);

            // Check if category has advertisements
            if ($listingCategory->advertisements()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete listing category. It is being used by ' . $listingCategory->advertisements()->count() . ' advertisement(s).',
                ], 422);
            }

            $listingCategory->delete();

            Log::info('Listing category deleted by admin', [
                'id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Listing category deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete listing category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete listing category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get all common categories
     */
    public function getCategories(Request $request): JsonResponse
    {
        try {
            $categories = CommonCategory::orderBy('name', 'asc')->get()->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description ?? '',
                ];
            });

            return response()->json([
                'success' => true,
                'categories' => $categories,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch categories', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch categories.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a new category
     */
    public function storeCategory(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:common_categories,name'],
                'description' => ['nullable', 'string', 'max:500'],
            ]);

            $category = CommonCategory::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            Log::info('Category created by admin', [
                'id' => $category->id,
                'name' => $category->name,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'category' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description ?? '',
                ],
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to create category', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to create category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update a category
     */
    public function updateCategory(Request $request, $id): JsonResponse
    {
        try {
            $category = CommonCategory::findOrFail($id);

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:common_categories,name,' . $id],
                'description' => ['nullable', 'string', 'max:500'],
            ]);

            $category->update([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
            ]);

            Log::info('Category updated by admin', [
                'id' => $category->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'category' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'description' => $category->description ?? '',
                ],
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a category
     */
    public function deleteCategory(Request $request, $id): JsonResponse
    {
        try {
            $category = CommonCategory::findOrFail($id);

            // Check if category has advertisements
            if ($category->advertisements()->count() > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete category. It is being used by ' . $category->advertisements()->count() . ' advertisement(s).',
                ], 422);
            }

            $category->delete();

            Log::info('Category deleted by admin', [
                'id' => $id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to delete category', [
                'id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

