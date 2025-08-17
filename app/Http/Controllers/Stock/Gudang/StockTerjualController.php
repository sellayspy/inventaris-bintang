<?php

namespace App\Http\Controllers\Stock\Gudang;

use App\Http\Controllers\Controller;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockTerjualController extends Controller
{
    public function index()
    {
        $stokTerjual = RekapStokBarang::with([
                'lokasi' => fn($q) => $q->where('is_gudang', false),
                'modelBarang.kategori',
                'modelBarang.merek',
            ])
            ->whereHas('lokasi', fn($q) => $q->where('is_gudang', false))
            ->where('jumlah_terjual', '>', 0)
            ->get()
            ->map(fn($item) => [
                'lokasi' => $item->lokasi->nama,
                'kategori' => $item->modelBarang->kategori->nama ?? '-',
                'nama_barang' => trim(($item->modelBarang->merek->nama ?? '') . ' ' . $item->modelBarang->nama),
                'jumlah_terjual' => $item->jumlah_terjual,
            ]);

        return Inertia::render('stock/terjual/index', [
            'stokTerjual' => $stokTerjual,
        ]);
    }
}
