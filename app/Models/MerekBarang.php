<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MerekBarang extends Model
{
    use HasFactory;
    protected $table = 'merek_barang';
    protected $fillable = ['nama'];

    public function modelBarang()
    {
        return $this->hasMany(ModelBarang::class, 'merek_id');
    }
}
