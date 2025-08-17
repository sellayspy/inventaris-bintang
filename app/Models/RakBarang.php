<?php

namespace App\Models;

use App\Traits\HasCaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RakBarang extends Model
{
    use HasCaseInsensitiveSearch;

    use HasFactory;

    protected $table = 'rak_barang';

    protected $fillable = [
        'lokasi_id',
        'nama_rak',
        'baris',
        'kode_rak',
    ];

    // Relasi ke lokasi (gudang)
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class);
    }

    // Relasi ke semua barang yang ada di rak ini
    public function barang()
    {
        return $this->hasMany(Barang::class, 'rak_id');
    }
}
