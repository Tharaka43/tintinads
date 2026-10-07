<!DOCTYPE html>
<html >
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>TinTinAds - Best SL Ads, Lanka Ads & Spa Ads in Sri Lanka</title>
        <meta name="description" content="TintinAds is the best alternative to SL Ads and Hitad in Sri Lanka. Post and find personal ads, spa services, job vacancies, and classifieds quickly and securely.">
        <meta name="keywords" content="TintinAds, Sri Lanka Ads, SL Ads, Hitad, spa ads, personal ads sri lanka, classifieds, massage colombo, jobs">
        <meta property="og:title" content="TintinAds - Sri Lanka's Best Classified Ads">
        <meta property="og:description" content="Discover the best personal ads, spa services, and job vacancies in Sri Lanka. The perfect alternative to SL Ads.">
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
