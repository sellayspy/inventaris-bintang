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
        Schema::table('barang_keluar_detail', function (Blueprint $table) {
            $table->enum('status_keluar', ['dipinjamkan', 'dijual'])->default('dipinjamkan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang_keluar_detail', function (Blueprint $table) {
            $table->dropColumn('status_keluar');
        });
    }
};
