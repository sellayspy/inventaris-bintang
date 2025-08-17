<?php

namespace App\Models;

use App\Traits\HasCaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Model;

class AsalBarang extends Model
{
    use HasCaseInsensitiveSearch;

    protected $table = 'asal_barang';
    protected $fillable = ['nama'];

    public function barang()
    {
        return $this->hasMany(Barang::class, 'asal_id');
    }
}
