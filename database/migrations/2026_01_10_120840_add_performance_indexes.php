<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Menambahkan index untuk optimasi query performa.
     */
    public function up(): void
    {
        // Index pada tabel barang
        Schema::table('barang', function (Blueprint $table) {
            // Composite index untuk filter lokasi + status (sering digunakan bersamaan)
            $table->index(['lokasi_id', 'status'], 'idx_barang_lokasi_status');
            
            // Index untuk filter berdasarkan model
            $table->index('model_id', 'idx_barang_model');
        });

        // Index pada tabel rekap_stok_barang (sering di-query untuk stock)
        Schema::table('rekap_stok_barang', function (Blueprint $table) {
            // Composite index untuk kombinasi model + lokasi (primary lookup)
            $table->index(['model_id', 'lokasi_id'], 'idx_rekap_model_lokasi');
        });

        // Index pada tabel barang_keluar_detail
        Schema::table('barang_keluar_detail', function (Blueprint $table) {
            $table->index('barang_id', 'idx_bkd_barang');
        });

        // Index pada tabel barang_masuk_detail
        Schema::table('barang_masuk_detail', function (Blueprint $table) {
            $table->index('barang_id', 'idx_bmd_barang');
        });

        // Index pada tabel barang_kembali_detail
        Schema::table('barang_kembali_detail', function (Blueprint $table) {
            $table->index('barang_id', 'idx_bkbd_barang');
        });

        // Index pada tabel mutasi_barang
        Schema::table('mutasi_barang', function (Blueprint $table) {
            $table->index('barang_id', 'idx_mutasi_barang');
            $table->index('tanggal', 'idx_mutasi_tanggal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang', function (Blueprint $table) {
            $table->dropIndex('idx_barang_lokasi_status');
            $table->dropIndex('idx_barang_model');
        });

        Schema::table('rekap_stok_barang', function (Blueprint $table) {
            $table->dropIndex('idx_rekap_model_lokasi');
        });

        Schema::table('barang_keluar_detail', function (Blueprint $table) {
            $table->dropIndex('idx_bkd_barang');
        });

        Schema::table('barang_masuk_detail', function (Blueprint $table) {
            $table->dropIndex('idx_bmd_barang');
        });

        Schema::table('barang_kembali_detail', function (Blueprint $table) {
            $table->dropIndex('idx_bkbd_barang');
        });

        Schema::table('mutasi_barang', function (Blueprint $table) {
            $table->dropIndex('idx_mutasi_barang');
            $table->dropIndex('idx_mutasi_tanggal');
        });
    }
};
