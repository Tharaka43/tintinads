<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use Illuminate\Support\Facades\DB;

$jsonFile = __DIR__ . '/structured_batch4_ads.json';
if (!file_exists($jsonFile)) {
    die("Error: structured_batch4_ads.json not found\n");
}

$adsData = json_decode(file_get_contents($jsonFile), true);
if (empty($adsData)) {
    die("Error: No ads found in structured_batch4_ads.json\n");
}

$storageDir = storage_path('app/public/ad-images');
if (!is_dir($storageDir)) {
    mkdir($storageDir, 0755, true);
}
$publicStorageDir = public_path('storage/ad-images');
if (!is_dir($publicStorageDir)) {
    @mkdir($publicStorageDir, 0755, true);
}

DB::beginTransaction();

try {
    $insertedCount = 0;
    foreach ($adsData as $item) {
        $num = $item['num'];
        $code = $item['code'];
        $srcImage = __DIR__ . '/public/ads_data/' . $num . '.png';
        $imageFilename = 'batch_ad_' . $num . '.png';
        $destPath = $storageDir . '/' . $imageFilename;
        $publicDestPath = $publicStorageDir . '/' . $imageFilename;
        $dbImagePath = 'ad-images/' . $imageFilename;

        if (file_exists($srcImage)) {
            copy($srcImage, $destPath);
            @copy($srcImage, $publicDestPath);
        } else {
            echo "Warning: Image {$srcImage} not found!\n";
        }

        // Delete existing if re-running
        $existing = Advertisement::where('code', $code)->first();
        if ($existing) {
            AdvertisementImage::where('advertisement_id', $existing->id)->delete();
            $existing->delete();
        }

        $ad = Advertisement::create([
            'agent_id' => 1,
            'code' => $code,
            'status' => 'activated',
            'payment_status' => 'paid',
            'title' => $item['title'],
            'description' => $item['description'],
            'price' => $item['price'],
            'location' => $item['location'],
            'phone_number' => $item['phone'],
            'whatsapp_number' => $item['whatsapp'],
            'telegram_number' => null,
            'common_category_id' => $item['category_id'],
            'listing_category_id' => 1, // VIP
            'sub_category_id' => null,
            'post_date' => now(),
            'views_count' => rand(15, 45),
            'likes_count' => rand(2, 9),
        ]);

        if (file_exists($destPath)) {
            AdvertisementImage::create([
                'advertisement_id' => $ad->id,
                'path' => $dbImagePath,
            ]);
        }

        $insertedCount++;
        echo "Inserted Ad #{$num} -> ID: {$ad->id} | Code: {$ad->code} | Title: {$ad->title}\n";
    }

    DB::commit();
    echo "\nSUCCESS! Inserted all {$insertedCount} advertisements (batch 4: #61 to #80)!\n";
} catch (\Exception $e) {
    DB::rollBack();
    echo "Error inserting ads: " . $e->getMessage() . "\n";
    exit(1);
}
