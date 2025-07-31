<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangKeluar extends Model
{
    use HasFactory;

    protected $table = 'barang_keluar';

    protected $fillable = ['tanggal', 'lokasi_id'];

    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class);
    }

    public function details()
    {
        return $this->hasMany(BarangKeluarDetail::class);
    }
}
