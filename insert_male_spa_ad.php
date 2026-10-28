<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use Illuminate\Support\Str;

$title = "🌿 Qualified Male Spa Therapist - Full Body, Foot & Head Massage (Visits Available)";

$description = <<<DESC
🌿 Qualified Male Spa Therapist - Professional & Friendly Service 🌿

කාර්යබහුල ජීවිතයේ විඩාව නිවාගෙන, මනසට සහ ගතට උපරිම සහනයක් ලබාගැනීමට ඇති හොඳම සහ 100% ආරක්ෂිතම තේරීම! 💆‍♂️✨

ඉතාමත් පිරිසිදු, නිදහස් පරිසරයක් තුළින් උසස් ප්‍රමිතියෙන් යුතු විශ්වාසනීය සම්බාහන සේවාවක් (Professional Massage Service) ලබාදීමට අප බැඳී සිටින්නෙමු.

✨ අපගේ සේවාවන් (Our Services):
✅ Full Body Massage (සම්පූර්ණ ශරීර සම්බාහනය)
✅ Leg & Foot Reflexology Massage (දෙපා සහ විලුඹ සම්බාහනය)
✅ Face & Head Relaxing Massage (හිස සහ මුහුණ සම්බාහනය)
✅ Deep Tissue & Muscle Pain Relief (මාංශපේශී සහ ශරීර වේදනා සමනය)
✅ Stress Relief & Mind Relaxation (මානසික ආතතිය දුරු කිරීම)

🌟 අපගේ විශේෂත්වයන් (Why Choose Us):
🔹 සුදුසුකම්ලත් පළපුරුදු පිරිමි සම්බාහන ශිල්පියෙකි (Qualified & Experienced Male Therapist).
🔹 100% විශ්වාසනීය සහ පූර්ණ රහස්‍යභාවය (100% Confidential & Safe).
🔹 ඔබට කැමති ඕනෑම ස්ථානයකට පැමිණ සේවය සැපයිය හැක (Visits Available to your Hotel / Home / Residence).
🔹 ඉහළම ප්‍රමිතියේ ස්වභාවික සුවඳ තෙල් සහ ආයුර්වේද නිෂ්පාදන භාවිතය (Premium Aroma & Herbal Oils).

💰 විශේෂ පැකේජ ගාස්තු: රු. 1,500/= සිට ඉහළට (Special Packages from Rs. 1,500/=)
📍 සේවා ප්‍රදේශ: කොළඹ සහ දිවයින පුරා (Colombo & Islandwide / Visits Available)

📞 ඔබගේ වේලාව වෙන්කරවා ගැනීමට දැන්ම අමතන්න / WhatsApp කරන්න:
📱 Call: 0716042725
💬 WhatsApp: 0716042725 (https://wa.me/94716042725)
DESC;

$imagePath = 'ad-images/male_spa_therapist_0716042725.jpg';

// Find or create ad
$phone = '0716042725';
$ad = Advertisement::where('phone_number', $phone)->first();

if (!$ad) {
    do {
        $code = 'AD-SPA-' . strtoupper(Str::random(4));
    } while (Advertisement::where('code', $code)->exists());

    $ad = Advertisement::create([
        'agent_id' => 1,
        'code' => $code,
        'status' => 'activated',
        'payment_status' => 'paid',
        'title' => $title,
        'description' => $description,
        'price' => 1500,
        'location' => 'Colombo (Visits Available)',
        'phone_number' => $phone,
        'whatsapp_number' => $phone,
        'telegram_number' => null,
        'common_category_id' => 6, // Spa & Wellness Services
        'listing_category_id' => 4, // Platinum (Rs. 1500 Tier)
        'sub_category_id' => null,
        'post_date' => now(),
        'views_count' => rand(85, 160),
        'likes_count' => rand(8, 22),
    ]);
    echo "Created new Advertisement ID: {$ad->id}\n";
} else {
    $ad->update([
        'title' => $title,
        'description' => $description,
        'price' => 1500,
        'location' => 'Colombo (Visits Available)',
        'common_category_id' => 6,
        'listing_category_id' => 4, // Platinum
        'status' => 'activated',
        'payment_status' => 'paid',
        'post_date' => now(),
    ]);
    echo "Updated existing Advertisement ID: {$ad->id}\n";
}

// Ensure Image
$adImage = AdvertisementImage::firstOrNew(['advertisement_id' => $ad->id]);
$adImage->path = $imagePath;
$adImage->save();

echo "Image associated: {$imagePath}\n";
echo "Ad URL: http://localhost:8000/ad/{$ad->id}\n";
