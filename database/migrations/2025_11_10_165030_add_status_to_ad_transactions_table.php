<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ad_transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('ad_transactions', 'status')) {
                $table->string('status')->default('Pending Review')->after('notes');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ad_transactions', function (Blueprint $table) {
            if (Schema::hasColumn('ad_transactions', 'status')) {
                $table->dropColumn('status');
            }
        });
    }
};
