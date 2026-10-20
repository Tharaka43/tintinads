<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

$storageDir = storage_path('app/public/ad-images');
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
}
$publicStorageDir = public_path('storage/ad-images');
if (!is_dir($publicStorageDir)) {
    @mkdir($publicStorageDir, 0755, true);
}

$srcImage = __DIR__ . '/public/assets/qualified_therapist_colombo.png';
$imageFilename = 'qualified_therapist_colombo_' . Str::random(6) . '.png';
$destPath = $storageDir . '/' . $imageFilename;
$publicDestPath = $publicStorageDir . '/' . $imageFilename;
$dbImagePath = 'ad-images/' . $imageFilename;

if (file_exists($srcImage)) {
    copy($srcImage, $destPath);
    @copy($srcImage, $publicDestPath);
}

// Generate code
do {
    $code = 'AD-THERAPIST-' . strtoupper(Str::random(4));
} while (Advertisement::where('code', $code)->exists());

$title = 'Qualified Therapist in Colombo - Royalty Service & Professional Consultation';

// Check if already inserted
$existing = Advertisement::where('title', $title)->first();
if ($existing) {
    echo "Ad already exists with ID: {$existing->id}\n";
    $ad = $existing;
} else {
    $ad = Advertisement::create([
        'agent_id' => 1,
        'code' => $code,
        'status' => 'activated',
        'payment_status' => 'paid',
        'title' => $title,
        'description' => "Specialized in Full Body Massage, Leg & Foot Massage, Face & Head Massage. Royalty Service & Professional Consultation in Colombo.\n\nAppointments Only. Call Now: +94 71 604 27 25",
        'price' => 5000.00,
        'location' => 'Colombo',
        'phone_number' => '0716042725',
        'whatsapp_number' => '0716042725',
        'telegram_number' => '0716042725',
        'common_category_id' => 6, // Spa & Wellness Services
        'listing_category_id' => 1, // VIP
        'sub_category_id' => 2,
        'post_date' => now(),
    ]);

    $ad->images()->create([
        'path' => $dbImagePath,
    ]);

    echo "Successfully created ad with ID: {$ad->id}\n";
}

// Auto-post to Telegram VIP Channel
try {
    $telegramService = app(\App\Services\TelegramChannelService::class);
    $res = $telegramService->postAdvertisement($ad, true);
    echo "Telegram Post Result: " . json_encode($res, JSON_UNESCAPED_UNICODE) . "\n";
} catch (\Throwable $e) {
    echo "Telegram Post Error: " . $e->getMessage() . "\n";
}
