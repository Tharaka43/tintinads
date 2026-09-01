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
        if (!Schema::hasTable('bank_accounts')) {
            // Table doesn't exist, create it with all columns
            Schema::create('bank_accounts', function (Blueprint $table) {
                $table->id();
                $table->string('bank_name');
                $table->text('account_number'); // Encrypted account number
                $table->boolean('is_active')->default(true);
                $table->timestamps();
            });
        } else {
            // Table exists, check and add missing columns
            Schema::table('bank_accounts', function (Blueprint $table) {
                if (!Schema::hasColumn('bank_accounts', 'bank_name')) {
                    $table->string('bank_name')->after('id');
                }
                if (!Schema::hasColumn('bank_accounts', 'account_number')) {
                    $table->text('account_number')->after('bank_name');
                }
                if (!Schema::hasColumn('bank_accounts', 'is_active')) {
                    $table->boolean('is_active')->default(true)->after('account_number');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Only drop if we created it in this migration
        // Don't drop if it was created by previous migrations
        if (Schema::hasTable('bank_accounts')) {
            Schema::dropIfExists('bank_accounts');
        }
    }
};
