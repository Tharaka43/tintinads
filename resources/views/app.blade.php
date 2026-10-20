<!DOCTYPE html>
<html >
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $adData = $page['props']['ad'] ?? null;
            $blogData = $page['props']['blog'] ?? null;

            if ($blogData && !empty($blogData['title'])) {
                $siteTitle = e($blogData['title']) . ' - TinTinAds';
                $siteDesc = !empty($blogData['meta_description']) 
                    ? e($blogData['meta_description']) 
                    : \Illuminate\Support\Str::limit(strip_tags($blogData['content'] ?? ''), 160);
                $siteImage = !empty($blogData['image']) 
                    ? (str_starts_with($blogData['image'], 'http') ? $blogData['image'] : url($blogData['image'])) 
                    : url('assets/siteicon.png');
                $ogType = 'article';
            } elseif ($adData && !empty($adData['title'])) {
                $priceStr = !empty($adData['price']) ? ' (Rs. ' . number_format($adData['price']) . ')' : '';
                $siteTitle = e($adData['title']) . $priceStr . ' - TinTinAds';

                $locationPart = !empty($adData['location']) ? '📍 ' . $adData['location'] . ' | ' : '';
                $contactPart = !empty($adData['phone_number']) ? '📞 ' . $adData['phone_number'] . ' | ' : '';
                $descClean = !empty($adData['description']) ? preg_replace('/\s+/', ' ', strip_tags($adData['description'])) : '';
                $siteDesc = \Illuminate\Support\Str::limit($locationPart . $contactPart . $descClean, 180);

                // Properly resolve image URL for WhatsApp / Facebook / Telegram previews
                $siteImage = url('assets/siteicon.png');
                if (!empty($adData['images']) && is_array($adData['images'])) {
                    $firstImg = $adData['images'][0];
                    if (is_string($firstImg) && !empty($firstImg)) {
                        $siteImage = str_starts_with($firstImg, 'http') ? $firstImg : url($firstImg);
                    } elseif (is_array($firstImg) && !empty($firstImg['path'])) {
                        $siteImage = str_starts_with($firstImg['path'], 'http') ? $firstImg['path'] : url('storage/' . $firstImg['path']);
                    }
                }
                $siteImage = str_replace(' ', '%20', $siteImage);
                if (str_starts_with($siteImage, 'http://') && str_contains($siteImage, 'tintinads.com')) {
                    $siteImage = 'https://' . substr($siteImage, 7);
                }
                $ogType = 'article';
            } else {
                $siteTitle = 'TinTinAds - Best SL Ads, Lanka Ads & Spa Ads in Sri Lanka';
                $siteDesc = 'TintinAds is the best alternative to SL Ads and Hitad in Sri Lanka. Post and find personal ads, spa services, job vacancies, and classifieds quickly and securely.';
                $siteImage = url('assets/siteicon.png');
                $ogType = 'website';
            }
        @endphp

        <title inertia>{{ $siteTitle }}</title>
        <meta name="description" content="{{ $siteDesc }}">
        <meta name="keywords" content="TintinAds, Sri Lanka Ads, SL Ads, Hitad, spa ads, personal ads sri lanka, classifieds, massage colombo, jobs">
        <meta property="og:type" content="{{ $ogType }}">
        <meta property="og:title" content="{{ $siteTitle }}">
        <meta property="og:description" content="{{ $siteDesc }}">
        <meta property="og:image" content="{{ $siteImage }}">
        <meta property="og:image:secure_url" content="{{ $siteImage }}">
        <meta property="og:image:width" content="1200">
        <meta property="og:image:height" content="630">
        <meta property="og:site_name" content="TinTinAds.com">
        <meta property="og:url" content="{{ url()->current() }}">
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $siteTitle }}">
        <meta name="twitter:description" content="{{ $siteDesc }}">
        <meta name="twitter:image" content="{{ $siteImage }}">
        <meta name="google-site-verification" content="N_8KLTWD7jm0-hsVKhurRZD6HaIgQyuUUnM_Mc3keJ8" />

        <link rel="icon" href="/assets/siteicon.png" sizes="any">
        <link rel="icon" href="/assets/siteicon.png" type="image/png">
        <link rel="apple-touch-icon" href="/assets/siteicon.png">

        <!-- Font Awesome -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
