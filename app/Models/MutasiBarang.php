<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MutasiBarang extends Model
{
    protected $table = 'mutasi_barang';

    protected $fillable = ['barang_id','user_id', 'lokasi_asal_id', 'lokasi_tujuan_id', 'tanggal', 'keterangan'];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }

    public function lokasiAsal()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_asal_id');
    }

    public function lokasiTujuan()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_tujuan_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
