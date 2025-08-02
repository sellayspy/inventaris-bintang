<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    protected $table = 'lokasi';
    protected $fillable = ['nama', 'alamat', 'is_gudang'];

    public function stok()
    {
        return $this->hasMany(RekapStokBarang::class, 'lokasi_id');
    }
}
