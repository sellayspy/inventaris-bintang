<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BarangMasuk extends Model
{
    use HasFactory;

    protected $table = 'barang_masuk';

    protected $fillable = ['tanggal', 'asal_barang_id', 'user_id'];

    public function asal()
    {
        return $this->belongsTo(AsalBarang::class, 'asal_barang_id');
    }

    public function details()
    {
        return $this->hasMany(BarangMasukDetail::class);
    }

    public function isGudang(): bool
    {
        return $this->is_gudang === true;
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

}

