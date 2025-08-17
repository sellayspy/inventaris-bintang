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
        Schema::create('barang_pemusnahan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pemusnahan_id')->references('id')->on('pemusnahan')->onDelete('cascade');
            $table->foreignId('barang_id')->references('id')->on('barang')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('barang_pemusnahan');
    }
};
