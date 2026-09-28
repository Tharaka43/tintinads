<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update VIP
        DB::table('listing_categories')->updateOrInsert(
            ['id' => 1],
            ['name' => 'VIP', 'price' => 700.00, 'sort_order' => 1]
        );

        // Update Premium (was Super)
        DB::table('listing_categories')->updateOrInsert(
            ['id' => 2],
            ['name' => 'Premium', 'price' => 500.00, 'sort_order' => 2]
        );

        // Update Normal (was NAR)
        DB::table('listing_categories')->updateOrInsert(
            ['id' => 3],
            ['name' => 'Normal', 'price' => 300.00, 'sort_order' => 3]
        );

        // Update Platinum
        DB::table('listing_categories')->updateOrInsert(
            ['id' => 4],
            ['name' => 'Platinum', 'price' => 1500.00, 'sort_order' => 0]
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Not necessary for this data update
    }
};
