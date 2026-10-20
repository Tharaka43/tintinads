<?php

namespace App\Console\Commands;

use App\Models\Advertisement;
use App\Services\TelegramChannelService;
use Illuminate\Console\Command;

class TelegramPostAdCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'telegram:post-ad 
                            {id? : ID of the advertisement to post, or "latest"}
                            {--test : Send a test connection message to the Telegram VIP Channel}
                            {--latest= : Post the N most recent activated ads}
                            {--force : Force post even if already posted before}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Post advertisements to the official Telegram VIP Channel (@tintinadsvip)';

    /**
     * Execute the console command.
     */
    public function handle(TelegramChannelService $telegramService)
    {
        $this->info("🚀 TinTinAds Telegram Channel Auto-Poster");

        if (!$telegramService->isConfigured()) {
            $this->error("❌ Telegram Bot Token is not configured!");
            $this->warn("Please add TELEGRAM_BOT_TOKEN to your .env file.");
            $this->line("Example:");
            $this->line("TELEGRAM_BOT_TOKEN=1234567890:ABCdefGhIJKlmNoPQRsTUVwxyZ");
            $this->line("TELEGRAM_CHANNEL_ID=@tintinadsvip");
            return 1;
        }

        // Test mode
        if ($this->option('test')) {
            $this->info("Sending test message to channel...");
            $res = $telegramService->sendTestMessage();
            if ($res['success']) {
                $this->info("✅ Test message successfully sent to Telegram Channel!");
                return 0;
            } else {
                $this->error("❌ Failed to send test message: " . ($res['message'] ?? 'Unknown error'));
                return 1;
            }
        }

        $force = (bool) $this->option('force');

        // Batch ads (--all or --latest=N)
        if ($this->option('all') || $this->option('latest')) {
            if ($latestCount = $this->option('latest')) {
                $count = max(1, (int) $latestCount);
                $this->info("Fetching latest {$count} active advertisements...");
                $ads = Advertisement::where('status', 'activated')
                    ->latest('id')
                    ->take($count)
                    ->get()
                    ->reverse();
            } else {
                $this->info("Fetching ALL active advertisements...");
                $ads = Advertisement::where('status', 'activated')
                    ->orderBy('id', 'asc')
                    ->get();
            }

            if ($ads->isEmpty()) {
                $this->warn("No active ads found.");
                return 0;
            }

            $total = $ads->count();
            $index = 0;

            foreach ($ads as $ad) {
                $index++;
                $this->line("[{$index}/{$total}] Posting Ad #{$ad->id}: {$ad->title}...");
                $res = $telegramService->postAdvertisement($ad, $force);
                if ($res['success']) {
                    $this->info("  -> " . ($res['message'] ?? 'Posted'));
                } else {
                    $this->error("  -> Failed: " . ($res['message'] ?? 'Error'));
                }
                // Sleep 2s to strictly respect Telegram rate limits
                sleep(2);
            }

            $this->info("✅ Batch posting finished for {$total} ads.");
            return 0;
        }

        // Single ad by ID or "latest"
        $idArg = $this->argument('id');

        if (!$idArg || $idArg === 'latest') {
            $ad = Advertisement::where('status', 'activated')->latest('id')->first();
            if (!$ad) {
                $this->error("No active advertisement found to post.");
                return 1;
            }
        } else {
            $ad = Advertisement::find($idArg);
            if (!$ad) {
                $this->error("Advertisement with ID {$idArg} not found.");
                return 1;
            }
        }

        $this->info("Posting Ad #{$ad->id}: {$ad->title}...");
        $res = $telegramService->postAdvertisement($ad, $force);

        if ($res['success']) {
            $this->info("✅ " . ($res['message'] ?? 'Posted successfully.'));
            return 0;
        } else {
            $this->error("❌ " . ($res['message'] ?? 'Failed to post ad.'));
            return 1;
        }
    }
}
