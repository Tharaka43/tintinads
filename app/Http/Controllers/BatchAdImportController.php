<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use App\Models\AdvertisementImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class BatchAdImportController extends Controller
{
    public function import(Request $request)
    {
        if ($request->query('key') !== 'tintin2026') {
            abort(403, 'Unauthorized access key.');
        }

        $jsonFile = base_path('all_40_ads.json');
        if (!file_exists($jsonFile)) {
            return response("Error: all_40_ads.json not found on server.", 404);
        }

        $adsData = json_decode(file_get_contents($jsonFile), true);
        if (empty($adsData)) {
            return response("Error: No ads found in all_40_ads.json.", 400);
        }

        $storageDir = storage_path('app/public/ad-images');
        if (!is_dir($storageDir)) {
            @mkdir($storageDir, 0755, true);
        }
        $publicStorageDir = public_path('storage/ad-images');
        if (!is_dir($publicStorageDir)) {
            @mkdir($publicStorageDir, 0755, true);
        }

        $results = [];

        foreach ($adsData as $item) {
            $num = $item['num'];
            $srcImage = public_path("ads_data/{$num}.png");
            $imageFilename = "batch_ad_{$num}.png";
            $destPath = $storageDir . '/' . $imageFilename;
            $publicDestPath = $publicStorageDir . '/' . $imageFilename;
            $dbImagePath = 'ad-images/' . $imageFilename;

            if (file_exists($srcImage)) {
                @copy($srcImage, $destPath);
                @copy($srcImage, $publicDestPath);
            }

            // Check if already created on this system
            $existing = Advertisement::where('title', $item['title'])->first();

            if ($existing) {
                // Ensure active, unexpired, and paid
                $existing->update([
                    'status' => 'activated',
                    'payment_status' => 'paid',
                    'listing_category_id' => 1,
                    'post_date' => now(),
                ]);

                // Ensure image exists
                if (!$existing->images()->exists()) {
                    AdvertisementImage::create([
                        'advertisement_id' => $existing->id,
                        'path' => $dbImagePath,
                    ]);
                }

                $results[] = [
                    'num' => $num,
                    'status' => 'Existing (Updated)',
                    'id' => $existing->id,
                    'code' => $existing->code,
                    'title' => $existing->title,
                    'phone' => $existing->phone_number,
                    'whatsapp' => $existing->whatsapp_number,
                    'location' => $existing->location,
                    'category' => $item['category_name'],
                    'price' => $existing->price,
                    'url' => url('/ad/' . $existing->id),
                ];
            } else {
                do {
                    $code = 'AD-' . strtoupper(Str::random(6));
                } while (Advertisement::where('code', $code)->exists());

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
                    'listing_category_id' => 1, // VIP (Rs. 700)
                    'sub_category_id' => null,
                    'post_date' => now(),
                    'views_count' => rand(20, 65),
                    'likes_count' => rand(4, 15),
                ]);

                AdvertisementImage::create([
                    'advertisement_id' => $ad->id,
                    'path' => $dbImagePath,
                ]);

                $results[] = [
                    'num' => $num,
                    'status' => 'Newly Created',
                    'id' => $ad->id,
                    'code' => $ad->code,
                    'title' => $ad->title,
                    'phone' => $ad->phone_number,
                    'whatsapp' => $ad->whatsapp_number,
                    'location' => $ad->location,
                    'category' => $item['category_name'],
                    'price' => $ad->price,
                    'url' => url('/ad/' . $ad->id),
                ];
            }
        }

        // Return HTML
        $totalCount = count($results);
        $html = '<!DOCTYPE html><html><head><meta charset="utf-8"><title>TinTinAds 60 Batch Importer</title>';
        $html .= '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">';
        $html .= '</head><body class="bg-gray-900 text-white p-6">';
        $html .= '<div class="max-w-6xl mx-auto">';
        $html .= '<div class="bg-green-800 text-white p-6 rounded-lg mb-6 shadow-lg flex justify-between items-center">';
        $html .= '<div><h1 class="text-2xl font-bold">✅ TinTinAds දැන්වීම් ' . $totalCount . 'ම සාර්ථකව Live Database එකට ඇතුළත් විය!</h1>';
        $html .= '<p class="text-green-200 mt-1">දැන්වීම් සියල්ලම රු. 700 VIP Golden Highlight කාණ්ඩය යටතේ සක්‍රිය කර ඇත.</p></div>';
        $html .= '<a href="/tintin_all_60_contacts.vcf" class="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg shadow transition">📥 Contacts ' . $totalCount . 'ම එකවර Save කරගන්න (VCF)</a>';
        $html .= '</div>';

        $html .= '<div class="overflow-x-auto bg-gray-800 rounded-lg shadow">';
        $html .= '<table class="min-w-full divide-y divide-gray-700 text-sm">';
        $html .= '<thead class="bg-gray-700 text-gray-200 uppercase"><tr>';
        $html .= '<th class="p-3 text-left">#</th>';
        $html .= '<th class="p-3 text-left">Ad ID</th>';
        $html .= '<th class="p-3 text-left">නම / විස්තරය</th>';
        $html .= '<th class="p-3 text-left">පළාත</th>';
        $html .= '<th class="p-3 text-left">දුරකථන / WA</th>';
        $html .= '<th class="p-3 text-center">සජීවී Link</th>';
        $html .= '<th class="p-3 text-center">WhatsApp පණිවිඩය</th>';
        $html .= '</tr></thead><tbody class="divide-y divide-gray-700">';

        foreach ($results as $r) {
            $adUrl = $r['url'];
            $cleanWa = preg_replace('/[^0-9]/', '', $r['whatsapp']);
            if (str_starts_with($cleanWa, '0')) {
                $cleanWa = '94' . substr($cleanWa, 1);
            }
            $msg = "👋 ආයුබෝවන්!\n\nඅපි ඔබගේ දැන්වීම දැක, එය ශ්‍රී ලංකාවේ ප්‍රමුඛතම TinTinAds.com වෙබ් අඩවියේ අපගේ රු. 700 VIP Golden Highlight කාණ්ඩය යටතේ නොමිලේම (FREE) පළ කළෙමු! 🌟🎉\n\n🔗 ඔබගේ දැන්වීම සජීවීව බැලීමට මෙතැනින් පිවිසෙන්න:\n👉 {$adUrl}\n\n📞 ඔබට දැන් අපගේ වෙබ් අඩවිය හරහාද වැඩි වැඩියෙන් Call සහ WhatsApp පණිවිඩ ලැබෙන්න පටන් ගනීවි!\n\n━━━━━━━━━━━━━━━━━━━━━━\n🔥 අපගේ සීමිත කාලීන විශේෂ දීමනාව (Limited Offer):\n⭐ Platinum Package (දින 30 පුරාම ඉහළින්ම): රු. 1,500/= පමණි!\n(දින 30ක් පුරා ඔබේ දැන්වීම දහස් ගණනක් ගැණුම්කරුවන්ට මුලින්ම පෙන්වයි)\n\n💡 ඇයි ඔබ TinTinAds.com තෝරාගත යුත්තේ?\n✅ දිනපතා සැබෑ Active පාරිභෝගිකයින් දහස් ගණනක් පිවිසෙන ලංකාවේ වේගවත්ම අඩවිය වීම.\n✅ Google හි ඉහළින්ම Rank වීම නිසා වැඩිම Calls & Leads ප්‍රමාණයක් ලැබීම.\n\n📲 දැන්වීමේ විස්තර වෙනස් කරගැනීමට හෝ දින 30 Platinum පැකේජය සක්‍රිය කරගැනීමට අප අමතන්න / WhatsApp කරන්න:\n📞 070 616 1617\n💬 WhatsApp: https://wa.me/94706161617\n🌐 https://tintinads.com";
            $waUrl = "https://wa.me/{$cleanWa}?text=" . rawurlencode($msg);

            $html .= '<tr class="hover:bg-gray-750">';
            $html .= '<td class="p-3 font-bold text-yellow-400">#' . $r['num'] . '</td>';
            $html .= '<td class="p-3 font-semibold text-green-400">#' . $r['id'] . '</td>';
            $html .= '<td class="p-3"><div class="font-bold text-white">' . htmlspecialchars(mb_substr($r['title'], 0, 40)) . '...</div><div class="text-xs text-gray-400">' . htmlspecialchars($r['category']) . ' | රු. ' . number_format($r['price']) . '</div></td>';
            $html .= '<td class="p-3 text-gray-300">' . htmlspecialchars(mb_substr($r['location'], 0, 25)) . '</td>';
            $html .= '<td class="p-3 text-blue-300">' . htmlspecialchars($r['whatsapp']) . '</td>';
            $html .= '<td class="p-3 text-center"><a href="' . $adUrl . '" target="_blank" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold inline-block">Ad බලන්න ↗</a></td>';
            $html .= '<td class="p-3 text-center"><a href="' . $waUrl . '" target="_blank" class="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold inline-block">💬 WhatsApp යවන්න</a></td>';
            $html .= '</tr>';
        }

        $html .= '</tbody></table></div></div></body></html>';

        return response($html);
    }
}
