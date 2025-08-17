<?php

namespace App\Models;

use App\Traits\HasCaseInsensitiveSearch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModelBarang extends Model
{
     use HasCaseInsensitiveSearch;

    use HasFactory;
    protected $table = 'model_barang';
    protected $fillable = ['kategori_id', 'merek_id', 'nama', 'jenis_id', 'deskripsi', 'label'];

    public function kategori()
    {
        return $this->belongsTo(KategoriBarang::class, 'kategori_id');
    }

    public function merek()
    {
        return $this->belongsTo(MerekBarang::class, 'merek_id');
    }

   public function jenis()
    {
        return $this->belongsTo(JenisBarang::class, 'jenis_id');
    }

    public function barang()
    {
        return $this->hasMany(Barang::class, 'model_id');
    }

}
