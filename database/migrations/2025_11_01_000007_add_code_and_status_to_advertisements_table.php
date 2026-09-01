<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            if (!Schema::hasColumn('advertisements', 'code')) {
                $table->string('code')->unique()->after('user_id');
            }

            if (!Schema::hasColumn('advertisements', 'status')) {
                $table->string('status')->default('deactivated')->after('code');
            }
        });

        // Ensure existing records have a code and status
        $records = DB::table('advertisements')->whereNull('code')->orWhereNull('status')->get();

        foreach ($records as $record) {
            DB::table('advertisements')
                ->where('id', $record->id)
                ->update([
                    'code' => $record->code ?? ('AD-' . strtoupper(bin2hex(random_bytes(3)))),
                    'status' => $record->status ?? 'deactivated',
                ]);
        }
    }

    public function down(): void
    {
        Schema::table('advertisements', function (Blueprint $table) {
            if (Schema::hasColumn('advertisements', 'status')) {
                $table->dropColumn('status');
            }

            if (Schema::hasColumn('advertisements', 'code')) {
                $table->dropColumn('code');
            }
        });
    }
};

