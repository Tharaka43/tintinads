<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ad_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->foreignId('advertisement_id')->constrained()->cascadeOnUpdate()->cascadeOnDelete();
            $table->string('account_number');
            $table->string('bank_reference_number');
            $table->decimal('amount', 12, 2);
            $table->decimal('commission', 12, 2)->default(100);
            $table->timestamp('payment_datetime');
            $table->string('receipt_path')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ad_transactions');
    }
};


