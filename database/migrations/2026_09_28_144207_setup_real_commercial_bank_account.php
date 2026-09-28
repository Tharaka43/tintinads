<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\BankAccount;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Delete all existing dummy bank accounts
        BankAccount::truncate();

        // 2. Add the real bank account
        BankAccount::create([
            'bank_name' => 'Commercial Bank (Kandy Main Branch) - G.A.H.W.M.C.V. HERATH',
            'account_number' => '8029867857',
            'is_active' => true,
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        BankAccount::truncate();
    }
};
