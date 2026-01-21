<?php

namespace App\Models;

use App\Traits\HasCaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SubLokasi extends Model
{
    use HasFactory, HasCaseInsensitiveSearch;

    protected $table = 'sub_lokasi';

    protected $fillable = [
        'lokasi_id',
        'nama',
        'kode',
        'lantai',
        'keterangan',
    ];

    /**
     * Relasi ke Lokasi (parent)
     */
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class);
    }

    /**
     * Relasi ke Barang yang ada di sub-lokasi ini
     */
    public function barang()
    {
        return $this->hasMany(Barang::class, 'sub_lokasi_id');
    }
}
