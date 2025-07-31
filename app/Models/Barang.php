<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Barang extends Model
{
    protected $table = 'barang';
    protected $fillable = ['jenis_barang_id','name', 'asal_id', 'serial_number', 'status', 'kondisi_awal'];

    public function jenisBarang()
    {
        return $this->belongsTo(JenisBarang::class);
    }

    public function asal()
    {
        return $this->belongsTo(AsalBarang::class, 'asal_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(RiwayatStatusBarang::class);
    }

    public function mutasi()
    {
        return $this->hasMany(MutasiBarang::class);
    }

    // Transaksi
    public function barangMasukDetails()
    {
        return $this->hasMany(BarangMasukDetail::class);
    }

    public function barangKeluarDetails()
    {
        return $this->hasMany(BarangKeluarDetail::class);
    }

    public function barangKembaliDetails()
    {
        return $this->hasMany(BarangKembaliDetail::class);
    }

}
