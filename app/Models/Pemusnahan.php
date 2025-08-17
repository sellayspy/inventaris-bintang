<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pemusnahan extends Model
{
    protected $table = 'pemusnahan';
    protected $fillable = [
        'kode_pemusnahaan',
        'user_id',
        'tanggal_pemusnahaan',
        'alasan',
        'status',
        'approved_by',
        'dokumen_bukti'
    ];

    public function barang()
    {
        return $this->belongsToMany(Barang::class, 'barang_pemusnahan');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

}
