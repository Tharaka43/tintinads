<?php

namespace App\Services;

use App\Models\Advertisement;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TelegramChannelService
{
    protected ?string $botToken;
    protected string $channelId;
    protected bool $autoPostEnabled;

    public function __construct()
    {
        $this->botToken = config('services.telegram.bot_token') ?: env('TELEGRAM_BOT_TOKEN');
        $this->channelId = config('services.telegram.channel_id') ?: env('TELEGRAM_CHANNEL_ID', '@tintinadsvip');
        $this->autoPostEnabled = (bool) (config('services.telegram.auto_post') ?? env('TELEGRAM_AUTO_POST', true));
    }

    /**
     * Check if Telegram service is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->botToken) && !empty($this->channelId);
    }

    /**
     * Post a single advertisement to the Telegram VIP Channel.
     */
    public function postAdvertisement(Advertisement $ad, bool $force = false): array
    {
        if (!$this->isConfigured()) {
            Log::warning('Telegram auto-post skipped: Bot token or channel ID not configured.');
            return [
                'success' => false,
                'message' => 'TELEGRAM_BOT_TOKEN or TELEGRAM_CHANNEL_ID is not configured in .env',
            ];
        }

        // Avoid posting the same ad multiple times unless forced
        $cacheKey = "tg_ad_posted_{$ad->id}";
        $postedFile = storage_path('app/telegram_posted_ads.json');
        $postedIds = [];
        if (file_exists($postedFile)) {
            $postedIds = json_decode(@file_get_contents($postedFile), true) ?: [];
        }

        if (!$force && (Cache::has($cacheKey) || in_array($ad->id, $postedIds))) {
            return [
                'success' => true,
                'skipped' => true,
                'message' => "Ad #{$ad->id} was already posted to Telegram.",
            ];
        }

        try {
            $caption = $this->buildCaption($ad);
            $replyMarkup = $this->buildReplyMarkup($ad);

            // Attempt to find a primary image
            $imagePath = $this->resolveAdImage($ad);

            $response = null;
            if ($imagePath && file_exists($imagePath)) {
                try {
                    $response = $this->sendPhotoWithLocalFile($imagePath, $caption, $replyMarkup);
                } catch (\Throwable $photoEx) {
                    Log::warning("Telegram sendPhoto exception for ad #{$ad->id}: " . $photoEx->getMessage() . ", falling back to text message.");
                    $response = null;
                }
            }

            if (!$response || !$response->successful()) {
                $response = $this->sendMessage($caption, $replyMarkup);
            }

            if ($response && $response->successful()) {
                Cache::put($cacheKey, true, now()->addDays(60));
                if (!in_array($ad->id, $postedIds)) {
                    $postedIds[] = $ad->id;
                    @file_put_contents($postedFile, json_encode(array_values(array_unique($postedIds))));
                }
                Log::info("Ad #{$ad->id} successfully posted to Telegram Channel {$this->channelId}");
                return [
                    'success' => true,
                    'message' => "Ad #{$ad->id} posted to Telegram channel.",
                    'response' => $response->json(),
                ];
            }

            Log::error("Failed to post ad #{$ad->id} to Telegram: " . ($response ? $response->body() : 'No response'));
            return [
                'success' => false,
                'message' => 'Telegram API error: ' . ($response ? $response->body() : 'No response'),
            ];

        } catch (\Throwable $e) {
            Log::error("Exception while posting ad #{$ad->id} to Telegram: " . $e->getMessage());
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send test message to confirm bot has permission in the channel.
     */
    public function sendTestMessage(): array
    {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'message' => 'Telegram Bot Token or Channel ID is not configured.',
            ];
        }

        $text = "🎉 <b>TinTinAds.com Telegram Bot Connected!</b>\n\n"
              . "✅ Bot Token: Verified\n"
              . "✅ Channel: {$this->channelId}\n"
              . "🚀 දැන්වීම් ස්වයංක්‍රීයව (Auto-Post) මෙම චැනලයට එකතු වනු ඇත.\n\n"
              . "🌐 <a href=\"https://tintinads.com\">TinTinAds.com</a>";

        $markup = [
            'inline_keyboard' => [
                [
                    ['text' => '🌐 Visit TinTinAds.com', 'url' => 'https://tintinads.com'],
                    ['text' => '💬 VIP Support', 'url' => 'https://wa.me/94706161617'],
                ],
            ],
        ];

        try {
            $res = $this->sendMessage($text, $markup);
            return [
                'success' => $res->successful(),
                'status' => $res->status(),
                'response' => $res->json(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Format the ad description into a clean HTML caption for Telegram.
     */
    protected function buildCaption(Advertisement $ad): string
    {
        $cleanTitle = htmlspecialchars(strip_tags($ad->title), ENT_QUOTES, 'UTF-8');
        $location = htmlspecialchars($ad->location ?: 'All Sri Lanka', ENT_QUOTES, 'UTF-8');
        
        $catName = 'General';
        if ($ad->commonCategory) {
            $catName = $ad->commonCategory->name;
        } elseif ($ad->subCategory) {
            $catName = $ad->subCategory->name;
        }
        $catName = htmlspecialchars($catName, ENT_QUOTES, 'UTF-8');

        $priceStr = $ad->price > 0 ? 'Rs ' . number_format($ad->price, 0) : 'Call / Negotiable';

        // Clean & truncate description to ~350 chars
        $rawDesc = strip_tags($ad->description ?: '');
        $rawDesc = preg_replace('/\s+/', ' ', $rawDesc);
        if (mb_strlen($rawDesc) > 350) {
            $rawDesc = mb_substr($rawDesc, 0, 350) . '...';
        }
        $cleanDesc = htmlspecialchars($rawDesc, ENT_QUOTES, 'UTF-8');

        $phone = $ad->phone_number ? htmlspecialchars($ad->phone_number, ENT_QUOTES, 'UTF-8') : 'See on Website';
        $whatsapp = $ad->whatsapp_number ?: $ad->phone_number;

        $caption = "🔥 <b>{$cleanTitle}</b>\n\n";
        $caption .= "📍 <b>ස්ථානය (Location):</b> {$location}\n";
        $caption .= "📂 <b>වර්ගය (Category):</b> {$catName}\n";
        $caption .= "💰 <b>ගාස්තුව (Price):</b> <b>{$priceStr}</b>\n\n";

        if ($cleanDesc) {
            $caption .= "📝 <b>විස්තරය (Details):</b>\n{$cleanDesc}\n\n";
        }

        $caption .= "📞 <b>Call:</b> {$phone}\n";
        if ($whatsapp) {
            $cleanWa = preg_replace('/[^0-9]/', '', $whatsapp);
            if (str_starts_with($cleanWa, '0')) {
                $cleanWa = '94' . substr($cleanWa, 1);
            }
            $caption .= "💬 <b>WhatsApp:</b> https://wa.me/{$cleanWa}\n";
        }

        $caption .= "\n━━━━━━━━━━━━━━━━━━━\n";
        $caption .= "✨ <b>TinTinAds.com</b> නිල VIP දැන්වීම් සේවාව";

        return $caption;
    }

    /**
     * Build inline action buttons.
     */
    protected function buildReplyMarkup(Advertisement $ad): array
    {
        $adUrl = "https://tintinads.com/ad/{$ad->id}";
        $buttons = [
            [
                ['text' => '🌐 සම්පූර්ණ දැන්වීම බලන්න (View Ad)', 'url' => $adUrl],
            ],
        ];

        $whatsapp = $ad->whatsapp_number ?: $ad->phone_number;
        $row2 = [];

        if ($whatsapp) {
            $cleanWa = preg_replace('/[^0-9]/', '', $whatsapp);
            if (str_starts_with($cleanWa, '0')) {
                $cleanWa = '94' . substr($cleanWa, 1);
            }
            $row2[] = [
                'text' => '💬 WhatsApp Chat',
                'url' => "https://wa.me/{$cleanWa}?text=" . urlencode("Hi, I saw your ad on TinTinAds: {$ad->title}"),
            ];
        }

        $row2[] = [
            'text' => '✈️ VIP Channel',
            'url' => 'https://t.me/tintinadsvip',
        ];

        $buttons[] = $row2;

        return [
            'inline_keyboard' => $buttons,
        ];
    }

    /**
     * Resolve the local absolute path for the ad's main image.
     */
    protected function resolveAdImage(Advertisement $ad): ?string
    {
        // Try relation if loaded or query
        $image = $ad->images()->first();
        if ($image && !empty($image->path)) {
            $storagePath = storage_path('app/public/' . $image->path);
            if (file_exists($storagePath)) {
                return $storagePath;
            }
            $publicPath = public_path('storage/' . $image->path);
            if (file_exists($publicPath)) {
                return $publicPath;
            }
        }

        // Check if there is a default fallback promo image
        $promoImage = public_path('assets/telegram_vip_ad.jpg');
        if (file_exists($promoImage)) {
            return $promoImage;
        }

        return null;
    }

    /**
     * Send photo using Telegram Bot sendPhoto endpoint.
     */
    protected function sendPhotoWithLocalFile(string $filePath, string $caption, array $replyMarkup)
    {
        $url = "https://api.telegram.org/bot{$this->botToken}/sendPhoto";

        return Http::timeout(35)
            ->attach('photo', file_get_contents($filePath), basename($filePath))
            ->post($url, [
                'chat_id' => $this->channelId,
                'caption' => $caption,
                'parse_mode' => 'HTML',
                'reply_markup' => json_encode($replyMarkup),
            ]);
    }

    /**
     * Send text message using Telegram Bot sendMessage endpoint.
     */
    protected function sendMessage(string $text, array $replyMarkup)
    {
        $url = "https://api.telegram.org/bot{$this->botToken}/sendMessage";

        return Http::timeout(25)->post($url, [
            'chat_id' => $this->channelId,
            'text' => $text,
            'parse_mode' => 'HTML',
            'disable_web_page_preview' => false,
            'reply_markup' => json_encode($replyMarkup),
        ]);
    }
}
