<?php

namespace App\Console\Commands;

use App\Http\Controllers\OutreachController;
use App\Models\Advertisement;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class SendExpiredRenewalMessagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ads:send-renewals 
                            {--dry-run : Only show which expired ads would be notified without sending}
                            {--force : Send even if already marked as sent}
                            {--limit=0 : Limit number of messages to process}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Detect expired advertisements and dispatch Message 3 (Platinum Renewal & Upsell Pitch) via WhatsApp Gateway';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        $force = $this->option('force');
        $limit = (int)$this->option('limit');

        $this->info("=================================================");
        $this->info("   TinTinAds Expired Ads WhatsApp Renewal Bot   ");
        $this->info("=================================================");

        $trackerFile = storage_path('app/outreach_tracker.json');
        $tracker = [];
        if (File::exists($trackerFile)) {
            $tracker = json_decode(File::get($trackerFile), true) ?: [];
        }

        $now = now();
        $ads = Advertisement::with('commonCategory', 'listingCategory')
            ->orderBy('id', 'asc')
            ->get();

        $expiredAds = [];
        foreach ($ads as $ad) {
            $catId = $ad->listing_category_id;
            $days = 1;
            if ($catId == 4) {
                $days = 30; // Platinum
            } elseif ($catId == 1) {
                $days = 3;  // VIP
            } elseif ($catId == 2) {
                $days = 2;  // Premium
            }

            $postDate = $ad->post_date ?? $ad->created_at ?? $now;
            $expireDate = (clone $postDate)->addDays($days);

            if ($now->greaterThan($expireDate)) {
                $alreadySent = !empty($tracker[$ad->id]['msg3']);
                if (!$alreadySent || $force) {
                    $expiredAds[] = [
                        'ad' => $ad,
                        'expired_at' => $expireDate,
                        'days_expired' => $now->diffInDays($expireDate),
                    ];
                }
            }
        }

        $totalExpired = count($expiredAds);
        $this->info("Found {$totalExpired} expired ads pending Message 3 renewal notification.");

        if ($totalExpired === 0) {
            $this->info("No expired ads pending renewal messages at this time.");
            return 0;
        }

        if ($limit > 0) {
            $expiredAds = array_slice($expiredAds, 0, $limit);
            $this->info("Processing first {$limit} expired ads as requested.");
        }

        $gatewayUrl = env('WHATSAPP_GATEWAY_URL');
        $gatewayToken = env('WHATSAPP_GATEWAY_TOKEN');

        if (!$gatewayUrl && !$isDryRun) {
            $this->warn("NOTICE: WHATSAPP_GATEWAY_URL is not set in .env.");
            $this->warn("You can either:");
            $this->warn(" 1. Configure WHATSAPP_GATEWAY_URL & WHATSAPP_GATEWAY_TOKEN in .env for fully automatic server dispatch.");
            $this->warn(" 2. Open https://tintinads.com/tintin_connect.html and use the interactive 'Auto-Send Queue' runner.");
            $this->newLine();
        }

        $sentCount = 0;
        $failedCount = 0;

        foreach ($expiredAds as $item) {
            $ad = $item['ad'];
            $cleanWa = preg_replace('/[^0-9]/', '', $ad->whatsapp_number ?? $ad->phone_number ?? '');
            $waIntl = str_starts_with($cleanWa, '0') ? ('94' . substr($cleanWa, 1)) : $cleanWa;

            $message = OutreachController::getTemplateText(3, $ad);

            $this->line("-------------------------------------------------");
            $this->info("Ad #{$ad->id} | {$ad->title}");
            $this->line("Phone: {$ad->phone_number} | WhatsApp: +{$waIntl}");
            $this->line("Post Date: {$ad->post_date} | Expired: {$item['expired_at']->toDateTimeString()}");

            if ($isDryRun) {
                $this->comment("[DRY RUN] Would send Message 3 to +{$waIntl}");
                $sentCount++;
                continue;
            }

            if ($gatewayUrl) {
                try {
                    $res = Http::timeout(15)->post($gatewayUrl, [
                        'token' => $gatewayToken,
                        'to' => $waIntl,
                        'body' => $message,
                    ]);

                    if ($res->successful()) {
                        $this->info("✔ WhatsApp renewal dispatched successfully to +{$waIntl}");
                        $tracker[$ad->id]['msg3'] = now()->toDateTimeString();
                        $sentCount++;
                    } else {
                        $this->error("✖ Gateway error: " . $res->body());
                        $failedCount++;
                    }
                } catch (\Throwable $e) {
                    $this->error("✖ Dispatch exception: " . $e->getMessage());
                    $failedCount++;
                }

                // Respect rate limits: pause 2 seconds between dispatches
                sleep(2);
            } else {
                // If no gateway, just mark preview
                $this->line("URL: " . url('/ad/' . $ad->id));
            }
        }

        if (!$isDryRun) {
            File::put($trackerFile, json_encode($tracker, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        }

        $this->newLine();
        $this->info("Summary: {$sentCount} processed, {$failedCount} failed.");
        return 0;
    }
}
