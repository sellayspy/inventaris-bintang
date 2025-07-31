<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AsalBarang extends Model
{
    protected $table = 'asal_barang';
    protected $fillable = ['nama'];

    public function barang()
    {
        return $this->hasMany(Barang::class, 'asal_id');
    }
}
