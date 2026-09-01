<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\AdsPrice;
use App\Models\Advertisement;
use App\Models\Agent;
use App\Models\CommonCategory;
use App\Models\ListingCategory;
use App\Models\SubCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Ensure the default factory user exists for testing if needed
        User::updateOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        // Seed super admin account
        Admin::updateOrCreate(
            ['username' => 'admin'],
            [
                'username' => 'admin',
                'password' => Hash::make('password123admin'),
                'name' => 'Super Admin',
                'email' => 'admin@tintinads.com',
                'is_active' => true,
            ]
        );

        // Seed a known agent account for logging into the agent dashboard
        $agent = Agent::updateOrCreate(
            ['email' => 'agent@example.com'],
            [
                'name' => 'Sample Agent',
                'password' => Hash::make('agent1234'),
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        // Seed base categories for posting advertisements
        $commonCategories = [
            ['name' => 'Girls Personal', 'description' => 'Girls Personal'],
            ['name' => 'Boys Personal', 'description' => 'Boys Personal'],
            ['name' => 'Shemale Personal', 'description' => 'Shemale Personal'],
            ['name' => 'Marriage Proposals', 'description' => 'Marriage Proposals'],
            ['name' => 'Live Cam', 'description' => 'Live Cam Services'],
            ['name' => 'Spa & Wellness Services', 'description' => 'Spa & Wellness Services'],
            ['name' => 'Rooms', 'description' => 'Rooms'],
            ['name' => 'Rent', 'description' => 'Rent'],
            ['name' => 'Real Estate', 'description' => 'Real Estate'],
            ['name' => 'Sales', 'description' => 'Sales'],
            ['name' => 'Toys & Accessories', 'description' => 'Toys & Accessories'],
            ['name' => 'Electronics', 'description' => 'Electronics'],
            ['name' => 'Vehicles', 'description' => 'Vehicles'],
            ['name' => 'Digital Products', 'description' => 'Digital Products'],
            ['name' => 'Professional Services', 'description' => 'Professional Services'],
        ];

        foreach ($commonCategories as $category) {
            CommonCategory::updateOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }

        $listingCategories = [
            ['name' => 'VIP', 'price' => 49.99, 'sort_order' => 1],
            ['name' => 'Super', 'price' => 29.99, 'sort_order' => 2],
            ['name' => 'NAR', 'price' => 9.99, 'sort_order' => 3],
        ];

        foreach ($listingCategories as $category) {
            ListingCategory::updateOrCreate(
                ['name' => $category['name']],
                ['price' => $category['price'], 'sort_order' => $category['sort_order']]
            );
        }

        $subCategories = [
            ['name' => 'Cash Back', 'description' => 'Eligible for cash back offers'],
            ['name' => 'Super Service', 'description' => 'Premium concierge services'],
        ];

        foreach ($subCategories as $category) {
            SubCategory::updateOrCreate(
                ['name' => $category['name']],
                ['description' => $category['description']]
            );
        }

        // Seed payment price options for ads
        $adsPrices = [
            ['name' => 'Basic Package', 'price' => 1000.00],
            ['name' => 'Standard Package', 'price' => 2500.00],
            ['name' => 'Premium Package', 'price' => 5000.00],
            ['name' => 'VIP Package', 'price' => 10000.00],
        ];

        foreach ($adsPrices as $priceOption) {
            AdsPrice::updateOrCreate(
                ['name' => $priceOption['name']],
                ['price' => $priceOption['price']]
            );
        }

        $defaultCommon = CommonCategory::first();

        if ($agent && $defaultCommon) {
            $listingId = ListingCategory::value('id');
            $subId = SubCategory::value('id');

            Advertisement::updateOrCreate(
                [
                    'agent_id' => $agent->id,
                    'title' => 'Sample Agent Listing',
                ],
                [
                    'code' => 'AD-DEMO1',
                    'status' => 'activated',
                    'payment_status' => 'paid',
                    'description' => 'This is a sample advertisement seeded for demonstration. Replace or delete it as you publish real ads.',
                    'price' => 199.99,
                    'location' => 'Colombo, Sri Lanka',
                    'common_category_id' => $defaultCommon->id,
                    'listing_category_id' => $listingId,
                    'sub_category_id' => $subId,
                    'post_date' => now()->subDay(),
                ]
            );
        }
    }
}
