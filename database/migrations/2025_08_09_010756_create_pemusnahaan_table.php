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
        Schema::create('pemusnahan', function (Blueprint $table) {
            $table->id();
            $table->string('kode_pemusnahaan')->unique();

            // Buat kolom + foreign key langsung
            $table->foreignId('user_id')
                ->constrained('users')
                ->onDelete('cascade');

            $table->date('tanggal_pemusnahaan')->nullable();
            $table->text('alasan')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            // Buat kolom approved_by + foreign key
            $table->foreignId('approved_by')
                ->nullable()
                ->constrained('users')
                ->onDelete('set null');

            $table->string('dokumen_bukti')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pemusnahan');
    }
};
