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
        // Tabel sub-lokasi untuk tracking lokasi lebih spesifik
        // Contoh: RS Bintang -> Pendaftaran, Poli A, IGD, Farmasi
        Schema::create('sub_lokasi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('cascade');
            $table->string('nama'); // Nama sub-lokasi (Pendaftaran, Poli A, dll)
            $table->string('kode')->nullable(); // Kode singkat (REG, POLI-A, IGD)
            $table->string('lantai')->nullable(); // Lantai (1, 2, 3, B1, dll)
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // Tambahkan field sub_lokasi_id dan pic ke tabel barang
        Schema::table('barang', function (Blueprint $table) {
            $table->foreignId('sub_lokasi_id')
                ->nullable()
                ->after('lokasi_id')
                ->constrained('sub_lokasi')
                ->onDelete('set null');
            $table->string('pic')->nullable()->after('sub_lokasi_id'); // Person In Charge
            $table->text('catatan')->nullable()->after('pic'); // Catatan tambahan
        });

        // Tambahkan field sub_lokasi_id dan pic ke tabel barang_keluar_detail
        Schema::table('barang_keluar_detail', function (Blueprint $table) {
            $table->foreignId('sub_lokasi_id')
                ->nullable()
                ->after('lokasi_id')
                ->constrained('sub_lokasi')
                ->onDelete('set null');
            $table->string('pic')->nullable()->after('sub_lokasi_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('barang_keluar_detail', function (Blueprint $table) {
            $table->dropForeign(['sub_lokasi_id']);
            $table->dropColumn(['sub_lokasi_id', 'pic']);
        });

        Schema::table('barang', function (Blueprint $table) {
            $table->dropForeign(['sub_lokasi_id']);
            $table->dropColumn(['sub_lokasi_id', 'pic', 'catatan']);
        });

        Schema::dropIfExists('sub_lokasi');
    }
};
