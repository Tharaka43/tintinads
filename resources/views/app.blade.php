<!DOCTYPE html>
<html >
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @php
            $adData = $page['props']['ad'] ?? null;
            $siteTitle = $adData && !empty($adData['title']) 
                ? e($adData['title']) . ' - TinTinAds' 
                : 'TinTinAds - Best SL Ads, Lanka Ads & Spa Ads in Sri Lanka';
            $siteDesc = $adData && !empty($adData['description']) 
                ? \Illuminate\Support\Str::limit(preg_replace('/\s+/', ' ', strip_tags($adData['description'])), 160) 
                : 'TintinAds is the best alternative to SL Ads and Hitad in Sri Lanka. Post and find personal ads, spa services, job vacancies, and classifieds quickly and securely.';
            $siteImage = ($adData && !empty($adData['images']) && !empty($adData['images'][0]['path'])) 
                ? url('storage/' . $adData['images'][0]['path']) 
                : url('assets/siteicon.png');
        @endphp

        <title inertia>{{ $siteTitle }}</title>
        <meta name="description" content="{{ $siteDesc }}">
        <meta name="keywords" content="TintinAds, Sri Lanka Ads, SL Ads, Hitad, spa ads, personal ads sri lanka, classifieds, massage colombo, jobs">
        <meta property="og:type" content="{{ $adData ? 'article' : 'website' }}">
        <meta property="og:title" content="{{ $siteTitle }}">
        <meta property="og:description" content="{{ $siteDesc }}">
        <meta property="og:image" content="{{ $siteImage }}">
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
