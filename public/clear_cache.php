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

echo "Cache wipe completed!\n";
