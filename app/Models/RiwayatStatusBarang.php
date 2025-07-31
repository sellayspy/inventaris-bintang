<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RiwayatStatusBarang extends Model
{
    protected $fillable = ['barang_id', 'tanggal', 'status', 'catatan'];

    public function barang()
    {
        return $this->belongsTo(Barang::class);
    }
}
