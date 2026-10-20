<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OutreachController extends Controller
{
    protected string $trackerFile;

    public function __construct()
    {
        $this->trackerFile = storage_path('app/outreach_tracker.json');
    }

    /**
     * Get tracker data from JSON file
     */
    protected function getTracker(): array
    {
        if (File::exists($this->trackerFile)) {
            $content = File::get($this->trackerFile);
            $data = json_decode($content, true);
            if (is_array($data)) {
                return $data;
            }
        }
        return [];
    }

    /**
     * Save tracker data to JSON file
     */
    protected function saveTracker(array $data): void
    {
        $dir = dirname($this->trackerFile);
        if (!File::isDirectory($dir)) {
            File::makeDirectory($dir, 0755, true);
        }
        File::put($this->trackerFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    /**
     * Get all ads with calculated expiration and outreach message statuses
     */
    public function getData(Request $request)
    {
        $tracker = $this->getTracker();

        $ads = Advertisement::with('commonCategory', 'listingCategory')
            ->orderBy('id', 'desc')
            ->get();

        $now = now();

        $payload = $ads->map(function ($ad) use ($tracker, $now) {
            $catId = $ad->listing_category_id;
            $days = 1; // Default
            if ($catId == 4) {
                $days = 30; // Platinum
            } elseif ($catId == 1) {
                $days = 3;  // VIP
            } elseif ($catId == 2) {
                $days = 2;  // Premium
            }

            $postDate = $ad->post_date ?? $ad->created_at ?? $now;
            $expireDate = (clone $postDate)->addDays($days);
            $isExpired = $now->greaterThan($expireDate);
            $secondsRemaining = $expireDate->getTimestamp() - $now->getTimestamp();

            // Phone normalization
            $rawPhone = $ad->phone_number ?? '';
            $rawWa = $ad->whatsapp_number ?? $rawPhone;

            $cleanPhone = preg_replace('/[^0-9]/', '', $rawPhone);
            if (str_starts_with($cleanPhone, '94') && strlen($cleanPhone) === 11) {
                $phoneDisplay = '0' . substr($cleanPhone, 2);
            } elseif (strlen($cleanPhone) === 10 && str_starts_with($cleanPhone, '0')) {
                $phoneDisplay = $cleanPhone;
            } else {
                $phoneDisplay = $rawPhone;
            }

            $cleanWa = preg_replace('/[^0-9]/', '', $rawWa);
            if (str_starts_with($cleanWa, '0') && strlen($cleanWa) === 10) {
                $waIntl = '94' . substr($cleanWa, 1);
                $waDisplay = $cleanWa;
            } elseif (str_starts_with($cleanWa, '94') && strlen($cleanWa) === 11) {
                $waIntl = $cleanWa;
                $waDisplay = '0' . substr($cleanWa, 2);
            } else {
                $waIntl = strlen($cleanWa) >= 9 ? ('94' . substr($cleanWa, -9)) : $cleanWa;
                $waDisplay = $rawWa;
            }

            $adTrack = $tracker[$ad->id] ?? [];

            return [
                'id' => $ad->id,
                'code' => $ad->code ?? ('AD-' . $ad->id),
                'title' => $ad->title,
                'category' => optional($ad->commonCategory)->name ?? 'General',
                'listing_tier' => optional($ad->listingCategory)->name ?? ($catId == 1 ? 'VIP' : 'Normal'),
                'listing_category_id' => $catId,
                'tier_days' => $days,
                'location' => $ad->location ?? 'Colombo',
                'price' => (float)$ad->price,
                'phone' => $phoneDisplay,
                'whatsapp' => $waDisplay,
                'wa_intl' => $waIntl,
                'url' => url('/ad/' . $ad->id),
                'post_date' => $postDate->toIso8601String(),
                'expire_date' => $expireDate->toIso8601String(),
                'is_expired' => $isExpired,
                'seconds_remaining' => $secondsRemaining,
                'status' => $ad->status,
                'msg1_sent' => !empty($adTrack['msg1']),
                'msg1_sent_at' => $adTrack['msg1'] ?? null,
                'msg2_sent' => !empty($adTrack['msg2']),
                'msg2_sent_at' => $adTrack['msg2'] ?? null,
                'msg3_sent' => !empty($adTrack['msg3']),
                'msg3_sent_at' => $adTrack['msg3'] ?? null,
            ];
        });

        return response()->json([
            'success' => true,
            'total' => $payload->count(),
            'active_count' => $payload->where('is_expired', false)->count(),
            'expired_count' => $payload->where('is_expired', true)->count(),
            'ads' => $payload->values(),
        ]);
    }

    /**
     * Mark an outreach message as sent / pending
     */
    public function markMessage(Request $request)
    {
        $validated = $request->validate([
            'ad_id' => 'required|integer',
            'msg_type' => 'required|in:1,2,3',
            'sent' => 'required|boolean',
        ]);

        $adId = $validated['ad_id'];
        $msgKey = 'msg' . $validated['msg_type'];
        $isSent = $validated['sent'];

        $tracker = $this->getTracker();

        if (!isset($tracker[$adId])) {
            $tracker[$adId] = [];
        }

        if ($isSent) {
            $tracker[$adId][$msgKey] = now()->toDateTimeString();
        } else {
            unset($tracker[$adId][$msgKey]);
        }

        $this->saveTracker($tracker);

        return response()->json([
            'success' => true,
            'ad_id' => $adId,
            'msg_type' => $validated['msg_type'],
            'status' => $isSent ? 'sent' : 'pending',
            'sent_at' => $tracker[$adId][$msgKey] ?? null,
        ]);
    }

    /**
     * Optional direct dispatch via WhatsApp Gateway API (UltraMsg / GreenAPI / Wasapi etc.)
     */
    public function sendGatewayMessage(Request $request)
    {
        $validated = $request->validate([
            'ad_id' => 'required|integer',
            'msg_type' => 'required|in:1,2,3',
            'message' => 'nullable|string',
        ]);

        $ad = Advertisement::find($validated['ad_id']);
        if (!$ad) {
            return response()->json(['success' => false, 'error' => 'Ad not found'], 404);
        }

        $gatewayUrl = env('WHATSAPP_GATEWAY_URL');
        $gatewayToken = env('WHATSAPP_GATEWAY_TOKEN');

        if (!$gatewayUrl) {
            return response()->json([
                'success' => false,
                'error' => 'WHATSAPP_GATEWAY_URL is not configured in .env. Please configure WhatsApp Gateway or use the 1-Click WhatsApp Runner.',
            ], 422);
        }

        $cleanWa = preg_replace('/[^0-9]/', '', $ad->whatsapp_number ?? $ad->phone_number ?? '');
        $waIntl = str_starts_with($cleanWa, '0') ? ('94' . substr($cleanWa, 1)) : $cleanWa;

        $msgBody = $validated['message'] ?? $this->getTemplateText($validated['msg_type'], $ad);

        try {
            $response = Http::timeout(15)->post($gatewayUrl, [
                'token' => $gatewayToken,
                'to' => $waIntl,
                'body' => $msgBody,
            ]);

            if ($response->successful()) {
                $tracker = $this->getTracker();
                $tracker[$ad->id]['msg' . $validated['msg_type']] = now()->toDateTimeString();
                $this->saveTracker($tracker);

                return response()->json([
                    'success' => true,
                    'message' => 'Message successfully sent via WhatsApp Gateway!',
                ]);
            }

            return response()->json([
                'success' => false,
                'error' => 'Gateway returned error: ' . $response->body(),
            ], 500);

        } catch (\Throwable $e) {
            Log::error('WhatsApp Gateway Error: ' . $e->getMessage());
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Default Sinhala message templates
     */
    public static function getTemplateText(int $type, Advertisement $ad): string
    {
        $adUrl = url('/ad/' . $ad->id);
        $title = $ad->title;
        $location = $ad->location ?? 'කොළඹ';

        if ($type === 1) {
            return "👋 ආයුබෝවන්!\n\n"
                . "අපි ඔබගේ දැන්වීම දැක, එය ශ්‍රී ලංකාවේ වේගයෙන්ම ජනප්‍රිය වන TinTinAds.com වෙබ් අඩවියේ අපගේ රු. 700 VIP Golden Package එක යටතේ කිසිදු මුදලක් අය නොකර නොමිලේම (FREE) පළ කළෙමු! 🌟🎉\n\n"
                . "🔗 ඔබගේ සජීවී දැන්වීම මෙතැනින් පරීක්ෂා කරන්න:\n👉 {$adUrl}\n\n"
                . "📝 එහි දුරකථන අංක, නගරය හෝ විස්තරවල කිසියම් අඩුපාඩුවක් ඇත්නම් අපට මෙහි Reply කරන්න. අපි එය නොමිලේම නිවැරදි කර දෙන්නෙමු. 🤝\n\n"
                . "━━━━━━━━━━━━━━━━━━━━━━\n"
                . "💡 ඇයි ඔබ TinTinAds.com තෝරාගත යුත්තේ?\n"
                . "1️⃣ 🎙️ ලංකාවේ ප්‍රථම වතාවට සිංහල Voice Note (හඬ පට) සහිත දැන්වීම්.\n"
                . "2️⃣ 🌟 VIP Golden Highlight & Top Rank.\n"
                . "3️⃣ 📲 Direct Call & WhatsApp පහසුකම්.\n\n"
                . "ස්තූතියි!\nTinTinAds.com\n💬 WhatsApp: 070 616 1617";
        }

        if ($type === 2) {
            return "👋 ආයුබෝවන්!\n\n"
                . "ඔබගේ දැන්වීම TinTinAds.com හි පළ කර මේ වන විට ක්‍රියාත්මක වෙමින් පවතී. ✨\n\n"
                . "🔗 සජීවී ලින්ක් එක:\n👉 {$adUrl}\n\n"
                . "ඔබට ලැබෙන Calls සහ ප්‍රතිචාර පිළිබඳව අපව දැනුවත් කරන්න. දැන්වීමේ තොරතුරු හෝ ඡායාරූප වෙනස් කර ගැනීමට අවශ්‍ය නම් ඕනෑම වේලාවක අප අමතන්න.\n\n"
                . "ස්තූතියි!\nTinTinAds පාරිභෝගික සත්කාරය\n💬 WhatsApp: 070 616 1617";
        }

        // Template 3 (Expired & Platinum Renewal Pitch)
        return "⏰ ආයුබෝවන්! ඔබ TinTinAds.com හි නොමිලේ පළ කළ VIP දැන්වීම අද දින කල් ඉකුත් වී ඇත (Expired).\n\n"
            . "🔗 ඔබගේ දැන්වීම:\n👉 {$adUrl}\n"
            . "📌 මාතෘකාව: {$title}\n"
            . "📍 ප්‍රදේශය: {$location}\n\n"
            . "━━━━━━━━━━━━━━━━━━━━━━\n"
            . "🔥 ඔබේ දැන්වීම නැවත සක්‍රීය කර ඉහළම ප්‍රතිචාර ලබාගන්න!\n\n"
            . "අපගේ විශේෂ රු. 1,500/= Platinum පැකේජය:\n"
            . "⭐ දින 30ක් පුරා ඔබේ දැන්වීම සයිට් එකේ ඉහළින්ම (Top 1) ප්‍රදර්ශනය වේ.\n"
            . "⭐ VIP Golden Highlight Frame & Verified Badge.\n"
            . "⭐ දිනපතා සයිට් එකට පැමිණෙන දහස් ගණනක් සැබෑ ගැණුම්කරුවන්ගෙන් උපරිම Calls & WhatsApp පණිවිඩ!\n\n"
            . "දැන්ම ඔබේ දැන්වීම Renewal කර ගැනීමට අපට WhatsApp පණිවිඩයක් එවන්න:\n"
            . "💬 WhatsApp: 070 616 1617 (ශානිකා)\n"
            . "🌐 TinTinAds.com";
    }
}
