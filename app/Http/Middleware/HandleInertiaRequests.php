<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        // Check if request is from agent routes
        $isAgentRoute = $request->routeIs('agent.*');
        $authenticatedUser = $isAgentRoute 
            ? $request->user('agent') 
            : $request->user();

        // Get saved ads count for guest users
        
        // --- SUBDOMAIN LOGIC ---
        $host = $request->getHost();
        
        $siteConfig = [
            'name' => 'Tintin Ads',
            'logo' => '/assets/sitelogo.png',
            'primaryColor' => '#FF69B4',
            'secondaryColor' => '#ADD8E6',
            'defaultCategory' => 'All Categories',
            'seoTitle' => 'Tintin Ads | Best Classifieds in Sri Lanka',
            'seoDescription' => 'Find the best classified ads in Sri Lanka. Cars, Jobs, Real Estate, and more.',
            'canonicalUrl' => 'https://tintinads.com' . $request->getRequestUri(),
        ];

        if (str_contains($host, 'hela')) {
            $siteConfig['name'] = 'Hela Ads';
            $siteConfig['primaryColor'] = '#8B5CF6'; // Purple
            $siteConfig['seoTitle'] = 'Hela Ads | Best Sri Lanka Classifieds';
            $siteConfig['seoDescription'] = 'Browse local classified listings across the country on Hela Ads.';
        } elseif (str_contains($host, 'spa')) {
            $siteConfig['name'] = 'Spa Ads Lanka';
            $siteConfig['primaryColor'] = '#EC4899'; // Pink
            $siteConfig['defaultCategory'] = 'Spa'; 
            $siteConfig['seoTitle'] = 'Spa Ads | Top VIP Profiles in Sri Lanka';
            $siteConfig['seoDescription'] = 'Find the best Spa and VIP ads in Sri Lanka.';
        } elseif (str_contains($host, 'sl')) {
            $siteConfig['name'] = 'SL Ads';
            $siteConfig['primaryColor'] = '#3B82F6'; // Blue
            $siteConfig['seoTitle'] = 'SL Ads - Sri Lanka\'s No 1 Ad Platform';
        } elseif (str_contains($host, 'personal')) {
            $siteConfig['name'] = 'Personal Ads';
            $siteConfig['primaryColor'] = '#EF4444'; // Red
            $siteConfig['defaultCategory'] = 'Personal';
            $siteConfig['seoTitle'] = 'Personal Ads Sri Lanka | VIP Profiles';
        }

        // -------------------------

        $savedAdsCount = 0;
        if (!$isAgentRoute && !$request->user()) {
            $savedAdsCount = count($request->session()->get('saved_ads', []));
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $authenticatedUser,
                'agent' => $isAgentRoute ? $authenticatedUser : null,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
            'savedAdsCount' => $savedAdsCount,
            'siteConfig' => $siteConfig,
        ];
    }
}
