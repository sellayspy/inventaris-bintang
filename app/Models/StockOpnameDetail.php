<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockOpnameDetail extends Model
{
    use HasFactory;

    protected $table = 'stock_opname_detail';

    protected $fillable = [
        'stock_opname_id',
        'model_id',
        'jumlah_sistem',
        'jumlah_fisik',
        'selisih',
        'catatan',
        'serial_hilang',
        'serial_baru'
    ];

    // Relasi ke induk stock opname
    public function stockOpname()
    {
        return $this->belongsTo(StockOpname::class, 'stock_opname_id');
    }

    // Relasi ke model barang
    public function modelBarang()
    {
        return $this->belongsTo(ModelBarang::class, 'model_id');
    }
}
