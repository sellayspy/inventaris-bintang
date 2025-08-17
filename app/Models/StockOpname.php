<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOpname extends Model
{
    use HasFactory;

    protected $table = 'stock_opname';

    protected $fillable = [
        'tanggal',
        'lokasi_id',
        'user_id',
        'catatan',
    ];

    protected $casts = [
        'tanggal' => 'date',
    ];

    // Relasi ke lokasi
    public function lokasi()
    {
        return $this->belongsTo(Lokasi::class, 'lokasi_id');
    }

    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function details()
    {
        return $this->hasMany(StockOpnameDetail::class, 'stock_opname_id');
    }
}
