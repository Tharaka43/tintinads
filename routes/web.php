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
use App\Models\Advertisement;
use Illuminate\Support\Facades\Response;

Route::get('/sitemap.xml', function () {
    $ads = Advertisement::where('status', 'activated')->orderBy('created_at', 'desc')->get();
    
    $xml = '<?xml version="1.0" encoding="UTF-8"?>';
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
    
    // Home
    $xml .= '<url><loc>' . url('/') . '</loc><changefreq>daily</changefreq><priority>1.0</priority></url>';
    
    // Packages
    $xml .= '<url><loc>' . url('/packages') . '</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>';
    
    // Terms
    $xml .= '<url><loc>' . url('/terms-and-conditions') . '</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>';
    
    // Ads
    foreach ($ads as $ad) {
        $xml .= '<url>';
        $xml .= '<loc>' . url('/ad/' . $ad->id) . '</loc>';
        $xml .= '<lastmod>' . $ad->updated_at->tz('UTC')->toAtomString() . '</lastmod>';
        $xml .= '<changefreq>weekly</changefreq>';
        $xml .= '<priority>0.8</priority>';
        $xml .= '</url>';
    }

    // Blog Index
    $xml .= '<url><loc>' . url('/blog') . '</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>';

    // Blog Articles
    if (\Illuminate\Support\Facades\Schema::hasTable('blogs')) {
        $blogs = \App\Models\Blog::where('is_published', true)->get();
        foreach ($blogs as $b) {
            $xml .= '<url>';
            $xml .= '<loc>' . url('/blog/' . $b->slug) . '</loc>';
            $xml .= '<lastmod>' . $b->updated_at->tz('UTC')->toAtomString() . '</lastmod>';
            $xml .= '<changefreq>monthly</changefreq>';
            $xml .= '<priority>0.9</priority>';
            $xml .= '</url>';
        }
    }
    
    $xml .= '</urlset>';
    
    return Response::make($xml, 200, ['Content-Type' => 'text/xml']);
});

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

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

Route::get('/singleview', function () {
    return redirect()->route('home');
})->name('singleview');

Route::get('/vip', function () {
    return response()->view('vip_bridge');
})->name('vip.bridge');

Route::get('/telegram', function () {
    return redirect()->route('vip.bridge');
})->name('telegram.bridge');

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

    Route::get('/blogs-manage', function () {
        return Inertia::render('Admin/AdminDashboard', [
            'pageKey' => 'blogs',
        ]);
    })->name('blogs.manage');

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
    Route::post('/api/advertisements', [AdminAdvertisementController::class, 'store'])->name('api.advertisements.store');
    Route::post('/api/advertisements/{id}/update', [AdminAdvertisementController::class, 'update'])->name('api.advertisements.update');
    Route::post('/api/advertisements/block', [AdminAdvertisementController::class, 'block'])->name('api.advertisements.block');
    Route::post('/api/advertisements/feature', [AdminAdvertisementController::class, 'feature'])->name('api.advertisements.feature');
    Route::post('/api/advertisements/activate', [AdminAdvertisementController::class, 'activate'])->name('api.advertisements.activate');
    Route::post('/api/advertisements/renew', [AdminAdvertisementController::class, 'renew'])->name('api.advertisements.renew');
    Route::get('/api/advertisements/{id}/images', [AdminAdvertisementController::class, 'getImages'])->name('api.advertisements.images.get');
    Route::post('/api/advertisements/{id}/images', [AdminAdvertisementController::class, 'uploadImages'])->name('api.advertisements.images.upload');
    Route::delete('/api/advertisements/images/{imageId}', [AdminAdvertisementController::class, 'deleteImage'])->name('api.advertisements.images.delete');
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

    // Blog Management API Routes
    Route::get('/blogs', [\App\Http\Controllers\BlogController::class, 'adminIndex'])->name('api.blogs.index');
    Route::post('/blogs', [\App\Http\Controllers\BlogController::class, 'store'])->name('api.blogs.store');
    Route::post('/blogs/{blog}', [\App\Http\Controllers\BlogController::class, 'update'])->name('api.blogs.update');
    Route::delete('/blogs/{blog}', [\App\Http\Controllers\BlogController::class, 'destroy'])->name('api.blogs.delete');
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

// One-click Batch Ad Importer for Hostinger Production
Route::get('/import-batch-ads', [\App\Http\Controllers\BatchAdImportController::class, 'import'])->name('import-batch-ads');

// Boost all ad views count by 200 on Hostinger production
Route::get('/boost-ad-views', function (\Illuminate\Http\Request $request) {
    if ($request->query('key') !== 'tintin2026') {
        abort(403, 'Unauthorized.');
    }
    $amount = (int) $request->query('amount', 200);
    $affected = \Illuminate\Support\Facades\DB::table('advertisements')->increment('views_count', $amount);
    $samples = \Illuminate\Support\Facades\DB::table('advertisements')->select('id', 'title', 'views_count')->limit(5)->get();
    return response()->json([
        'status' => 'success',
        'message' => "Successfully boosted views count by +{$amount} for all {$affected} ads on production!",
        'samples' => $samples
    ]);
})->name('boost-ad-views');

// Renew all expired ads to active and update post_date = now()
Route::get('/renew-all-ads', function (\Illuminate\Http\Request $request) {
    if ($request->query('key') !== 'tintin2026') {
        abort(403, 'Unauthorized.');
    }
    $affected = \Illuminate\Support\Facades\DB::table('advertisements')->update([
        'status' => 'activated',
        'payment_status' => 'paid',
        'post_date' => now(),
    ]);
    return response()->json([
        'status' => 'success',
        'message' => "Successfully renewed all {$affected} ads to active & post_date = now()!",
        'total_active' => \App\Models\Advertisement::where('status', 'activated')->unexpired()->count()
    ]);
})->name('renew-all-ads');

// Insert Shanika Proposal Ad & 4 New Ads + Delete Duplicates on Hostinger Production
Route::get('/insert-proposal-ad', function (\Illuminate\Http\Request $request) {
    if ($request->query('key') !== 'tintin2026') {
        abort(403, 'Unauthorized.');
    }

    $storageDir = storage_path('app/public/ad-images');
    $publicStorageDir = public_path('storage/ad-images');
    if (!is_dir($storageDir)) @mkdir($storageDir, 0755, true);
    if (!is_dir($publicStorageDir)) @mkdir($publicStorageDir, 0755, true);

    // 1. Delete duplicate proposal ad in Category 4
    $deleted = \App\Models\Advertisement::where('title', 'LIKE', '%විවාහයට පෙර%')
        ->where('common_category_id', 4)
        ->delete();

    // 2. Insert the 4 new ads
    $newAds = [
        [
            'title' => "මාතර සමින්ද (අවු. 33) - වෙනස බලන්න, සතුටු වන්න! කාන්තාවන්ට පමණි",
            'desc' => "වෙනස බලන්න ! සැපගන්න !\nසතුටු වන්න ! ප්‍රීතිවන්න !\nවිනෝද වන්න ! දැන්ම අමතන්න.\n\nකාන්තාවන්ට පමණක් කථා කළ හැකි දුරකථන අංකයකි.\n\nමාතර සමින්ද\nඅවු. 33\nදුරකථන අංකය: 071 8209543\n\nමෙවැනි දැන්වීමක් පලකරවා ගන්න ශානිකා අමතන්න: 070 616 1617 / 071 616 1613",
            'category_id' => 2, // Boys Personal
            'location' => 'Matara',
            'phone' => '0718209543',
            'image' => 'matara_saminda_33.png',
            'price' => 1500,
        ],
        [
            'title' => "ඇඹිලිපිටියේ රාජපක්ෂ (අවු. 30) - කාන්තාවන්ට පමණක් කථා කළ හැකි දුරකථන අංකයකි",
            'desc' => "වෙනස බලන්න ! සැපගන්න !\nසතුටු වන්න ! ප්‍රීතිවන්න !\nවිනෝද වන්න ! දැන්ම අමතන්න.\n\nකාන්තාවන්ට පමණක් කථා කළ හැකි දුරකථන අංකයකි.\n\nඇඹිලිපිටියේ රාජපක්ෂ\nඅවු. 30\n\nතොරතුරු සහ විස්තර සඳහා ශානිකා අමතන්න:\nදුරකථන අංකය: 070 616 1617 / 071 616 1613",
            'category_id' => 2, // Boys Personal
            'location' => 'Ratnapura',
            'phone' => '0706161617',
            'image' => 'embilipitiye_rajapaksha_30.png',
            'price' => 1500,
        ],
        [
            'title' => "මහනුවර 42, ඉතාම හුරු බුහුටි නිදහස් කාන්තාවකි - වැදගත් මහත්මයෙකුටයි",
            'desc' => "මහනුවර 42, ඉතාම හුරු බුහුටි\nමාගේ ඇරයුම\nආර්ථික යහපත්, ලෝභ නැති, විනෝදයට බර\nවැදගත්, වැදගත් මහත්මයෙකුටයි,\nමා නිදහස් කාන්තාවකි.\nහඳුනා ගැනීම පමණක් ඉතා වැදගත් වේ.\n\nමැයගේ තොරතුරු අප සතුව ඇත.\nමෙවැනි දැන්වීමක් පලකරවා ගන්න ශානිකා අමතන්න.\nදුරකථන අංකය: 070 616 1617 / 071 616 1613",
            'category_id' => 1, // Girls Personal
            'location' => 'Kandy',
            'phone' => '0706161617',
            'image' => 'kandy_lady_42.png',
            'price' => 1500,
        ],
        [
            'title' => "දඹුල්ල දම්මික - විනෝදයට, සමීප ඇසුරට කැමති කාන්තාවන්ට පමණි",
            'desc' => "කාන්තාවන්ට පමණක් කථා කළ හැකි දුරකථන අංකයකි.\nදඹුල්ල දම්මික - 077 3216161\n\nකාන්තා ඔබේ ආර්ථික ගැටළුවට ස්ථිර විසඳුමක්.\nවිනෝදයට - සමීප ඇසුරට කැමති කාන්තාවන්ට පමණයි.\nඔබේ ආර්ථික ගැටළු අපට කියන්න.\n\nමෙවැනි දැන්වීමක් පලකරවා ගන්න ශානිකා අමතන්න:\n070 616 1617 / 071 616 1613",
            'category_id' => 2, // Boys Personal
            'location' => 'Matale',
            'phone' => '0773216161',
            'image' => 'dambulla_dammika.png',
            'price' => 1500,
        ],
    ];

    $results = ["Deleted {$deleted} duplicate proposal ad(s) from Cat #4"];

    foreach ($newAds as $idx => $item) {
        $imgName = $item['image'];
        $srcImage = public_path("ads_data/{$imgName}");
        if (file_exists($srcImage)) {
            @copy($srcImage, $storageDir . '/' . $imgName);
            @copy($srcImage, $publicStorageDir . '/' . $imgName);
        }

        $existing = \App\Models\Advertisement::where('title', $item['title'])->first();
        if ($existing) {
            $existing->update([
                'status' => 'activated',
                'payment_status' => 'paid',
                'price' => $item['price'],
                'post_date' => now()->subMinutes(($idx + 1) * 3),
            ]);
            $results[] = "Updated Ad #{$existing->id}: {$item['title']}";
        } else {
            do {
                $code = 'AD-SHAN-' . strtoupper(\Illuminate\Support\Str::random(5));
            } while (\App\Models\Advertisement::where('code', $code)->exists());

            $ad = \App\Models\Advertisement::create([
                'agent_id' => 1,
                'code' => $code,
                'status' => 'activated',
                'payment_status' => 'paid',
                'title' => $item['title'],
                'description' => $item['desc'],
                'price' => $item['price'],
                'location' => $item['location'],
                'phone_number' => $item['phone'],
                'whatsapp_number' => null,
                'telegram_number' => null,
                'common_category_id' => $item['category_id'],
                'listing_category_id' => 1,
                'sub_category_id' => null,
                'post_date' => now()->subMinutes(($idx + 1) * 3),
                'views_count' => rand(280, 420),
                'likes_count' => rand(15, 35),
            ]);

            \App\Models\AdvertisementImage::create([
                'advertisement_id' => $ad->id,
                'path' => 'ad-images/' . $imgName,
            ]);

            $results[] = "Created Ad #{$ad->id} ({$ad->code}): {$item['title']}";
        }
    }

    return response()->json([
        'status' => 'success',
        'result' => $results
    ]);
})->name('insert-proposal-ad');

// WhatsApp Outreach & Expired Renewal Hub API routes
Route::get('/api/outreach/data', [\App\Http\Controllers\OutreachController::class, 'getData'])->name('outreach.data');
Route::post('/api/outreach/mark', [\App\Http\Controllers\OutreachController::class, 'markMessage'])->name('outreach.mark');
Route::post('/api/outreach/send-gateway', [\App\Http\Controllers\OutreachController::class, 'sendGatewayMessage'])->name('outreach.send-gateway');

Route::get('/download-vcf', function (\Illuminate\Http\Request $request) {
    if ($request->query('fresh') === '1' || $request->query('today') === '1') {
        $file = public_path('hela_fresh_20_oct21.vcf');
    } else {
        $file = public_path('tintin_advertisers.vcf');
    }
    if (!file_exists($file)) {
        abort(404);
    }
    $filename = basename($file);
    return response()->file($file, [
        'Content-Type' => 'text/vcard; charset=utf-8',
        'Content-Disposition' => 'attachment; filename="' . $filename . '"'
    ]);
})->name('download.vcf');

Route::get('/download-fresh-vcf', function () {
    $file = public_path('hela_fresh_20_oct21.vcf');
    if (!file_exists($file)) {
        abort(404);
    }
    return response()->file($file, [
        'Content-Type' => 'text/vcard; charset=utf-8',
        'Content-Disposition' => 'attachment; filename="hela_fresh_20_oct21.vcf"'
    ]);
})->name('download.fresh-vcf');

// 100 Fresh LankaAd Calling Kit Routes
Route::get('/calling-sheet', function () {
    $file = public_path('calling_sheet.html');
    if (!file_exists($file)) abort(404);
    return response()->file($file, ['Content-Type' => 'text/html; charset=utf-8']);
})->name('calling-sheet');

Route::get('/download-lankaad-vcf', function () {
    $file = public_path('lankaad_100_call_leads.vcf');
    if (!file_exists($file)) abort(404);
    return response()->file($file, [
        'Content-Type' => 'text/vcard; charset=utf-8',
        'Content-Disposition' => 'attachment; filename="lankaad_100_call_leads.vcf"'
    ]);
})->name('download.lankaad-vcf');

Route::get('/download-lankaad-csv', function () {
    $file = public_path('lankaad_100_calling_list.csv');
    if (!file_exists($file)) abort(404);
    return response()->file($file, [
        'Content-Type' => 'text/csv; charset=utf-8',
        'Content-Disposition' => 'attachment; filename="lankaad_100_calling_list.csv"'
    ]);
})->name('download.lankaad-csv');

// LankaAd Pereda (Oct 21) 20 Leads Kit Routes
Route::get('/pereda-sheet', function () {
    $file = public_path('pereda_calling_sheet.html');
    if (!file_exists($file)) abort(404);
    return response()->file($file, ['Content-Type' => 'text/html; charset=utf-8']);
})->name('pereda-sheet');

Route::get('/download-pereda-vcf', function () {
    $file = public_path('lankaad_pereda_20.vcf');
    if (!file_exists($file)) abort(404);
    return response()->file($file, [
        'Content-Type' => 'text/vcard; charset=utf-8',
        'Content-Disposition' => 'attachment; filename="lankaad_pereda_20.vcf"'
    ]);
})->name('download.pereda-vcf');

Route::get('/download-pereda-csv', function () {
    $file = public_path('lankaad_pereda_20.csv');
    if (!file_exists($file)) abort(404);
    return response()->file($file, [
        'Content-Type' => 'text/csv; charset=utf-8',
        'Content-Disposition' => 'attachment; filename="lankaad_pereda_20.csv"'
    ]);
})->name('download.pereda-csv');

Route::get('/reports/competitor-analysis.pdf', function () {
    $file = public_path('reports/competitor_analysis_report.pdf');
    if (!file_exists($file)) {
        $file = base_path('TinTinAds_Competitor_Analysis_Report_2026.pdf');
    }
    if (!file_exists($file)) {
        abort(404);
    }
    return response()->file($file, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'inline; filename="TinTinAds_Competitor_Analysis_Report_2026.pdf"'
    ]);
})->name('reports.pdf');

Route::get('/reports/competitor-analysis', function () {
    $file = public_path('reports/competitor_analysis_report.html');
    if (!file_exists($file)) {
        abort(404);
    }
    return response()->file($file, [
        'Content-Type' => 'text/html; charset=utf-8'
    ]);
})->name('reports.html');


