<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RekapStokBarang extends Model
{
    protected $table = 'rekap_stok_barang';
    protected $fillable = [
        'jenis_barang_id',
        'lokasi_id',
        'jumlah_total',
        'jumlah_tersedia',
        'jumlah_rusak',
        'jumlah_perbaikan',
        'jumlah_terdistribusi'
    ];

    public function jenisBarang()
    {
        return $this->belongsTo(JenisBarang::class, 'jenis_barang_id');
    }

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id');
    }
}
