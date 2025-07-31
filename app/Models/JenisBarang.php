<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisBarang extends Model
{
    protected $table = 'jenis_barang';
    protected $fillable = ['kategori_id', 'merek', 'model'];

    public function kategori()
    {
        return $this->belongsTo(KategoriBarang::class, 'kategori_id');
    }

    public function barang()
    {
        return $this->hasMany(Barang::class, 'jenis_barang_id');
    }

    public function rekapStok()
    {
        return $this->hasMany(RekapStokBarang::class, 'jenis_barang_id');
    }
}
