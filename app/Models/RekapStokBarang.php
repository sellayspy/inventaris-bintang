<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RekapStokBarang extends Model
{
    protected $table = 'rekap_stok_barang';
    protected $fillable = [
        'model_id',
        'lokasi_id',
        'jumlah_total',
        'jumlah_tersedia',
        'jumlah_terjual',
        'jumlah_rusak',
        'jumlah_perbaikan',
        'jumlah_terdistribusi'
    ];


    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id');
    }

    public function modelBarang()
    {
        return $this->belongsTo(ModelBarang::class, 'model_id');
    }
}
