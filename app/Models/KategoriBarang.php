<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KategoriBarang extends Model
{
    protected $table = 'kategori_barang';
    protected $fillable = ['nama'];

    public function jenisBarang()
    {
        return $this->hasMany(JenisBarang::class, 'kategori_id');
    }
}
