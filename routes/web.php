<?php

use App\Http\Controllers\AdminAdvertisementController;
use App\Http\Controllers\AdminAgentController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminCommissionController;
use App\Http\Controllers\AdminReportsController;
use App\Http\Controllers\AdminSettingsController;
use App\Http\Controllers\AgentAdController;
use App\Http\Controllers\AgentAuthController;
use App\Http\Controllers\ClassifiedsController;
use App\Http\Controllers\OcrController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [ClassifiedsController::class, 'index'])->name('home');
Route::get('/agents', [ClassifiedsController::class, 'agents'])->name('agents');
Route::get('/saved-ads', [ClassifiedsController::class, 'savedAds'])->name('saved-ads');
Route::post('/ads/{adId}/save', [ClassifiedsController::class, 'saveAd'])->name('ads.save');
Route::post('/ads/{adId}/unsave', [ClassifiedsController::class, 'unsaveAd'])->name('ads.unsave');
Route::post('/ads/{adId}/like', [ClassifiedsController::class, 'likeAd'])->name('ads.like');
Route::get('/ad/{adId}', [ClassifiedsController::class, 'show'])->name('ad.show');
Route::get('/packages', function () {
    return Inertia::render('PackagesPage');
})->name('packages');

Route::get('/terms-and-conditions', function () {
    return Inertia::render('TermsAndConditions');
})->name('terms');
Route::get('/singleview', function () {
    return redirect()->route('home');
})->name('singleview');

Route::get('/ocruploader', function () {
    return Inertia::render('OcrUploader');
})->name('OcrUploader');
Route::middleware('guest')->group(function () {
    Route::get('/agent/login', [AgentAuthController::class, 'create'])->name('agent.login');
    Route::post('/agent/login', [AgentAuthController::class, 'store'])->name('agent.login.store');

    Route::get('/login', function () {
        return redirect()->route('agent.login');
    })->name('login');
});

Route::post('/agent/logout', [AgentAuthController::class, 'destroy'])
    ->middleware('agent')
    ->name('agent.logout');

// Super Admin Login Routes
Route::middleware('guest')->group(function () {
    Route::get('/admin/login', [AdminAuthController::class, 'create'])->name('admin.login');
    Route::post('/admin/login', [AdminAuthController::class, 'store'])->name('admin.login.store');
});

Route::post('/admin/logout', [AdminAuthController::class, 'destroy'])
    ->name('admin.logout');

Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
    Route::get('/', function () {
        return redirect()->route('admin.dashboard');
    });

    Route::get('/dashboard', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'home',
        ]);
    })->name('dashboard');

    Route::get('/agents', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'agent',
        ]);
    })->name('agents');

    Route::get('/ads', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'ads',
        ]);
    })->name('ads');

    Route::get('/payments', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'payments',
        ]);
    })->name('payments');

    Route::get('/settings', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'settings',
        ]);
    })->name('settings');

    Route::get('/reports', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'reports',
        ]);
    })->name('reports');

    // Agent Management API Routes
    Route::get('/api/agents', [AdminAgentController::class, 'index'])->name('api.agents.index');
    Route::post('/api/agents', [AdminAgentController::class, 'store'])->name('api.agents.store');
    Route::get('/api/agents/{id}', [AdminAgentController::class, 'show'])->name('api.agents.show');
    Route::put('/api/agents/{id}', [AdminAgentController::class, 'update'])->name('api.agents.update');
    Route::patch('/api/agents/{id}/toggle-status', [AdminAgentController::class, 'toggleStatus'])->name('api.agents.toggle-status');

    // Advertisement Management API Routes
    Route::get('/api/advertisements', [AdminAdvertisementController::class, 'index'])->name('api.advertisements.index');
    Route::post('/api/advertisements/block', [AdminAdvertisementController::class, 'block'])->name('api.advertisements.block');
    Route::post('/api/advertisements/feature', [AdminAdvertisementController::class, 'feature'])->name('api.advertisements.feature');
    Route::post('/api/advertisements/activate', [AdminAdvertisementController::class, 'activate'])->name('api.advertisements.activate');
    Route::post('/api/advertisements/delete', [AdminAdvertisementController::class, 'delete'])->name('api.advertisements.delete');
    Route::post('/api/advertisements/update-payment-status', [AdminAdvertisementController::class, 'updatePaymentStatus'])->name('api.advertisements.update-payment-status');

    // Commission Review API Routes
    Route::get('/api/commissions', [AdminCommissionController::class, 'index'])->name('api.commissions.index');
    Route::post('/api/commissions/{id}/confirm', [AdminCommissionController::class, 'confirm'])->name('api.commissions.confirm');
    Route::post('/api/commissions/{id}/reject', [AdminCommissionController::class, 'reject'])->name('api.commissions.reject');

    // Reports & Analytics API Routes
    Route::get('/api/reports', [AdminReportsController::class, 'index'])->name('api.reports.index');
    Route::get('/api/dashboard', [AdminReportsController::class, 'dashboard'])->name('api.dashboard.index');

    // Settings API Routes - Listing Categories
    Route::get('/api/settings/listing-categories', [AdminSettingsController::class, 'getListingCategories'])->name('api.settings.listing-categories.index');
    Route::post('/api/settings/listing-categories', [AdminSettingsController::class, 'storeListingCategory'])->name('api.settings.listing-categories.store');
    Route::put('/api/settings/listing-categories/{id}', [AdminSettingsController::class, 'updateListingCategory'])->name('api.settings.listing-categories.update');
    Route::delete('/api/settings/listing-categories/{id}', [AdminSettingsController::class, 'deleteListingCategory'])->name('api.settings.listing-categories.delete');

    // Category Management API Routes
    Route::get('/api/settings/categories', [AdminSettingsController::class, 'getCategories'])->name('api.settings.categories.index');
    Route::post('/api/settings/categories', [AdminSettingsController::class, 'storeCategory'])->name('api.settings.categories.store');
    Route::put('/api/settings/categories/{id}', [AdminSettingsController::class, 'updateCategory'])->name('api.settings.categories.update');
    Route::delete('/api/settings/categories/{id}', [AdminSettingsController::class, 'deleteCategory'])->name('api.settings.categories.delete');
});

// Route::get('/argentdashboard', function () {
//     return Inertia::render('Argent/AgentDashboard');
// })->name('singleview');

Route::prefix('agent')->name('agent.')->middleware('agent')->group(function () {

    // 1. Dashboard Home (Loads the main Dashboard component)
    Route::get('/', function () {
        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'home',
        ]);
    })->name('dashboard');

    Route::get('/mainhome', function () {
        return Inertia::render('Argent/AgentDashboardLayout', [
            'pageKey' => 'mainhome',
        ]);
    })->name('mainhome');

    Route::get('/ads', [AgentAdController::class, 'index'])->name('ads');
    Route::get('/ads/codes', [AgentAdController::class, 'codes'])->name('ads.codes');


    Route::get('/post', [AgentAdController::class, 'create'])->name('post');
    Route::post('/post', [AgentAdController::class, 'store'])->name('post.store');
    Route::get('/ads/{id}/edit', [AgentAdController::class, 'edit'])->name('ads.edit');
    Route::post('/ads/{id}/update', [AgentAdController::class, 'update'])->name('ads.update');
    Route::post('/ads/{id}/toggle', [AgentAdController::class, 'toggleStatus'])->name('ads.toggle');
    Route::post('/ads/{id}/bump', [AgentAdController::class, 'bumpAd'])->name('ads.bump');
    Route::delete('/ads/{id}/delete', [AgentAdController::class, 'deleteAd'])->name('ads.delete');


    Route::get('/commission', [AgentAdController::class, 'commissionHistory'])->name('commission');

    Route::get('/payments', [AgentAdController::class, 'payments'])->name('payments');
    Route::post('/payments/report', [AgentAdController::class, 'storeTransaction'])->name('payments.store');

    Route::get('/profile', [AgentAdController::class, 'profile'])->name('profile');
    Route::post('/profile/update', [AgentAdController::class, 'updateProfile'])->name('profile.update');
});


// API routes
Route::post('/ocr', [OcrController::class, 'processReceipt']);
