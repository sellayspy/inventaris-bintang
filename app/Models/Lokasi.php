<?php

namespace App\Models;

use App\Traits\HasCaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Model;

class Lokasi extends Model
{
    use HasCaseInsensitiveSearch;

    protected $table = 'lokasi';
    protected $fillable = ['nama', 'alamat', 'is_gudang'];

    public function stok()
    {
        return $this->hasMany(RekapStokBarang::class, 'lokasi_id');
    }
}
