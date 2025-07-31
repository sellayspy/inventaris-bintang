<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // --- Referensi dasar ---
        Schema::create('kategori_barang', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->timestamps();
        });

        Schema::create('lokasi', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->text('alamat')->nullable();
            $table->timestamps();
        });

        Schema::create('asal_barang', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->timestamps();
        });

        // --- Jenis barang (merek & model) ---
        Schema::create('jenis_barang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kategori_id')->constrained('kategori_barang')->onDelete('cascade');
            $table->string('merek');
            $table->string('model');
            $table->timestamps();
        });

        // --- Unit barang individual ---
        Schema::create('barang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenis_barang_id')->constrained('jenis_barang')->onDelete('cascade');
            $table->foreignId('asal_id')->nullable()->constrained('asal_barang')->onDelete('set null');
            $table->string('serial_number')->unique();
            $table->enum('kondisi_awal', ['baru', 'second'])->default('baru');
            $table->enum('status', ['baik', 'rusak', 'diperbaiki'])->default('baik');
            $table->timestamps();
        });

        // --- Rekap stok per lokasi ---
        Schema::create('rekap_stok_barang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenis_barang_id')->constrained('jenis_barang')->onDelete('cascade');
            $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('cascade');
            $table->integer('jumlah_total')->default(0);
            $table->integer('jumlah_tersedia')->default(0);
            $table->integer('jumlah_rusak')->default(0);
            $table->integer('jumlah_perbaikan')->default(0);
            $table->integer('jumlah_terdistribusi')->default(0);
            $table->timestamps();
        });

        // --- Barang Masuk ---
        Schema::create('barang_masuk', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('asal_barang_id')->nullable()->constrained('asal_barang')->onDelete('set null');
            $table->timestamps();
        });

        Schema::create('barang_masuk_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_masuk_id')->constrained('barang_masuk')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
        });

        // --- Barang Keluar / Distribusi ---
        Schema::create('barang_keluar', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('restrict');
            $table->timestamps();
        });

        Schema::create('barang_keluar_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_keluar_id')->constrained('barang_keluar')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
        });

        // --- Barang Kembali ---
        Schema::create('barang_kembali', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('restrict');
            $table->timestamps();
        });

        Schema::create('barang_kembali_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_kembali_id')->constrained('barang_kembali')->onDelete('cascade');
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
            $table->enum('kondisi', ['bagus', 'rusak', 'diperbaiki'])->default('bagus');
        });

        // --- Mutasi lokasi barang ---
        Schema::create('mutasi_barang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
            $table->foreignId('lokasi_asal_id')->nullable()->constrained('lokasi')->onDelete('set null');
            $table->foreignId('lokasi_tujuan_id')->nullable()->constrained('lokasi')->onDelete('set null');
            $table->date('tanggal');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });

        // --- Riwayat perubahan status barang ---
        Schema::create('riwayat_status_barang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('barang_id')->constrained('barang')->onDelete('cascade');
            $table->date('tanggal');
            $table->enum('status', ['baik', 'rusak', 'diperbaiki']);
            $table->string('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('riwayat_status_barang');
        Schema::dropIfExists('mutasi_barang');
        Schema::dropIfExists('barang_kembali_detail');
        Schema::dropIfExists('barang_kembali');
        Schema::dropIfExists('barang_keluar_detail');
        Schema::dropIfExists('barang_keluar');
        Schema::dropIfExists('barang_masuk_detail');
        Schema::dropIfExists('barang_masuk');
        Schema::dropIfExists('rekap_stok_barang');
        Schema::dropIfExists('barang');
        Schema::dropIfExists('jenis_barang');
        Schema::dropIfExists('asal_barang');
        Schema::dropIfExists('lokasi');
        Schema::dropIfExists('kategori_barang');
    }
};
