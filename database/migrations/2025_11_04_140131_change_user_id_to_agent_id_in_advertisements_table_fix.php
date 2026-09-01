<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            // Drop existing foreign key constraint
            $table->dropForeign(['user_id']);
        });

        Schema::table('advertisements', function (Blueprint $table) {
            $table->renameColumn('user_id', 'agent_id');
            // Add new foreign key constraint pointing to agents table
            $table->foreign('agent_id')->references('id')->on('agents')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            // Drop foreign key constraint
            $table->dropForeign(['agent_id']);
        });

        // Rename column back using raw SQL for MySQL compatibility
        DB::statement('ALTER TABLE advertisements CHANGE agent_id user_id BIGINT UNSIGNED NOT NULL');

        Schema::table('advertisements', function (Blueprint $table) {
            // Re-add foreign key constraint pointing to users table
            $table->foreign('user_id')->references('id')->on('users')->cascadeOnUpdate()->cascadeOnDelete();
        });
    }
};
