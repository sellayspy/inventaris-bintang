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
        Schema::create('stock_opname', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->foreignId('lokasi_id')->constrained('lokasi')->onDelete('restrict');
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('catatan')->nullable();
            $table->timestamps();
        });

        Schema::create('stock_opname_detail', function (Blueprint $table) {
            $table->id();
            $table->foreignId('stock_opname_id')->constrained('stock_opname')->onDelete('cascade');
            $table->foreignId('model_id')->constrained('model_barang')->onDelete('cascade');
            $table->integer('jumlah_sistem');
            $table->integer('jumlah_fisik');
            $table->integer('selisih');
            $table->string('catatan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_opname');
        Schema::dropIfExists('stock_opname_detail');
    }
};
