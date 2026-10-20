<?php
header('Content-Type: text/plain');

if (($_GET['key'] ?? '') !== 'tintin2026') {
    http_response_code(403);
    die('Unauthorized access key.');
}

// 1. Manually delete compiled views in storage/framework/views
$viewPath = __DIR__ . '/../storage/framework/views';
$deletedViews = 0;
if (is_dir($viewPath)) {
    $files = glob($viewPath . '/*');
    foreach ($files as $file) {
        if (is_file($file) && basename($file) !== '.gitignore') {
            @unlink($file);
            $deletedViews++;
        }
    }
}
echo "Deleted {$deletedViews} cached view files.\n";

// 2. Clear bootstrap cache files
$bootstrapCache = __DIR__ . '/../bootstrap/cache';
$deletedBoot = 0;
if (is_dir($bootstrapCache)) {
    $files = glob($bootstrapCache . '/*');
    foreach ($files as $file) {
        if (is_file($file) && basename($file) !== '.gitignore') {
            @unlink($file);
            $deletedBoot++;
        }
    }
}
echo "Deleted {$deletedBoot} bootstrap cache files.\n";

// 3. Inspect server git status
$headPath = __DIR__ . '/../.git/HEAD';
if (file_exists($headPath)) {
    $gitHead = trim(file_get_contents($headPath));
    echo "Git HEAD: {$gitHead}\n";
    if (strpos($gitHead, 'ref: ') === 0) {
        $ref = trim(substr($gitHead, 5));
        $refFile = __DIR__ . '/../.git/' . $ref;
        if (file_exists($refFile)) {
            echo "Current Commit: " . trim(file_get_contents($refFile)) . "\n";
        }
    }
}

// 4. Try git pull if shell_exec is enabled
if (function_exists('shell_exec')) {
    $output = @shell_exec('cd ' . escapeshellarg(__DIR__ . '/..') . ' && git pull origin main 2>&1');
    echo "Git Pull Output:\n" . ($output ?: 'No output or shell_exec disabled') . "\n";
}

// 5. Ensure TELEGRAM_BOT_TOKEN is set in server .env
$envPath = __DIR__ . '/../.env';
if (file_exists($envPath)) {
    $envContent = file_get_contents($envPath);
    if (strpos($envContent, 'TELEGRAM_BOT_TOKEN=8756972370') === false) {
        $botConfig = "\n\nTELEGRAM_BOT_TOKEN=8756972370:AAH2RjKzHg2L9rpuQOFsJekBRjYRjS9CbdY\nTELEGRAM_CHANNEL_ID=@tintinadsvip\nTELEGRAM_AUTO_POST=true\n";
        file_put_contents($envPath, $envContent . $botConfig);
        echo "Configured TELEGRAM_BOT_TOKEN in server .env!\n";
    } else {
        echo "TELEGRAM_BOT_TOKEN is active in server .env.\n";
    }
}

echo "Cache wipe completed!\n";
