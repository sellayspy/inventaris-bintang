<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_opname_detail', function (Blueprint $table) {
            $table->json('serial_hilang')->nullable()->after('catatan');
            $table->json('serial_baru')->nullable()->after('serial_hilang');
        });
    }

    public function down(): void
    {
        Schema::table('stock_opname_detail', function (Blueprint $table) {
            $table->dropColumn(['serial_hilang', 'serial_baru']);
        });
    }
};
