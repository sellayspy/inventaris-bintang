<?php

namespace App\Models;

use App\Traits\HasCaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Model;

class KategoriBarang extends Model
{
    use HasCaseInsensitiveSearch;

    protected $table = 'kategori_barang';
    protected $fillable = ['nama'];

    public function jenisBarang()
    {
        return $this->hasMany(JenisBarang::class, 'kategori_id');
    }
}
