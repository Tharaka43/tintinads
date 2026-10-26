<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

$jsonFile = __DIR__ . '/ads_batch_50_oct26.json';
if (!file_exists($jsonFile)) {
    die("Error: ads_batch_50_oct26.json not found\n");
}

$adsData = json_decode(file_get_contents($jsonFile), true);
if (empty($adsData)) {
    die("Error: No ads found in JSON\n");
}

echo "Found " . count($adsData) . " ads to insert into database.\n";

$storageDir = storage_path('app/public/ad-images');
$publicStorageDir = public_path('storage/ad-images');
if (!is_dir($storageDir)) @mkdir($storageDir, 0755, true);
if (!is_dir($publicStorageDir)) @mkdir($publicStorageDir, 0755, true);

$inserted = 0;
DB::beginTransaction();

try {
    Advertisement::withoutEvents(function () use ($adsData, &$inserted) {
        foreach ($adsData as $item) {
            $imageFilename = $item['image'];
            $dbImagePath = 'ad-images/' . $imageFilename;

            do {
                $code = 'AD-26O-' . strtoupper(Str::random(5));
            } while (Advertisement::where('code', $code)->exists());

            // Smart location detection
            $fullText = strtolower($item['title'] . ' ' . $item['description']);
            $location = $item['location'];
            $cities = [
                'kollupitiya' => 'Kollupitiya',
                'bambalapitiya' => 'Bambalapitiya',
                'wellawatta' => 'Wellawatte',
                'wellawatte' => 'Wellawatte',
                'dehiwala' => 'Dehiwala',
                'mount lavinia' => 'Mount Lavinia',
                'nugegoda' => 'Nugegoda',
                'katunayaka' => 'Katunayake',
                'seeduwa' => 'Seeduwa',
                'kandy' => 'Kandy',
                'gampaha' => 'Gampaha',
                'negombo' => 'Negombo',
                'kurunegala' => 'Kurunegala',
                'maharagama' => 'Maharagama',
                'havelock' => 'Colombo (Havelock)',
                'thimbirigasyaya' => 'Thimbirigasyaya',
                'rajagiriya' => 'Rajagiriya',
                'battaramulla' => 'Battaramulla',
                'malabe' => 'Malabe',
                'kalutara' => 'Kalutara',
                'galle' => 'Galle'
            ];
            foreach ($cities as $needle => $cityName) {
                if (str_contains($fullText, $needle)) {
                    $location = $cityName;
                    break;
                }
            }

            // Title cleanup if invalid or too short
            $title = trim($item['title']);
            if (strlen($title) < 5 || is_numeric($title)) {
                $title = "VIP Genuine Service in {$location}";
            }

            $ad = Advertisement::create([
                'agent_id' => 1,
                'code' => $code,
                'status' => 'activated',
                'payment_status' => 'paid',
                'title' => $title,
                'description' => $item['description'],
                'price' => $item['price'],
                'location' => $location,
                'phone_number' => $item['phone'],
                'whatsapp_number' => $item['whatsapp'],
                'telegram_number' => null,
                'common_category_id' => $item['category_id'],
                'listing_category_id' => 1, // VIP Top ad
                'sub_category_id' => null,
                'post_date' => now()->subMinutes(rand(5, 300)),
                'views_count' => rand(180, 420),
                'likes_count' => rand(10, 38),
            ]);

            AdvertisementImage::create([
                'advertisement_id' => $ad->id,
                'path' => $dbImagePath,
            ]);

            $inserted++;
            echo "[{$inserted}/" . count($adsData) . "] Inserted Ad #{$ad->id} ({$ad->code}): {$ad->title}\n";
        }
    });

    DB::commit();
    echo "\nSUCCESS! Successfully inserted all {$inserted} ads into database!\n";
    echo "Total Ads now in DB: " . Advertisement::count() . "\n";
} catch (\Throwable $e) {
    DB::rollBack();
    echo "ERROR: " . $e->getMessage() . "\n";
}
