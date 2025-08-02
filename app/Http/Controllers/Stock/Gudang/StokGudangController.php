<?php

namespace App\Http\Controllers\Stock\Gudang;

use App\Http\Controllers\Controller;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokGudangController extends Controller
{
    public function index()
    {
        $stokBarang = RekapStokBarang::with([
            'modelBarang.merek',
            'modelBarang.kategori',
            'lokasi'
        ])
        ->whereHas('lokasi', function ($query) {
            $query->where('is_gudang', true);
        })
        ->get()
        ->map(function ($item) {
            return [
                'kategori' => $item->modelBarang->kategori->nama ?? '-',
                'merek' => $item->modelBarang->merek->nama ?? '-',
                'model' => $item->modelBarang->nama ?? '-',
                'jumlah_rusak' => $item->jumlah_rusak,
                'jumlah_perbaikan' => $item->jumlah_perbaikan,
                'jumlah_tersedia' => $item->jumlah_tersedia,
                'jumlah_total' => $item->jumlah_rusak + $item->jumlah_perbaikan + $item->jumlah_tersedia,
            ];
        });

        return Inertia::render('stock/gudang/index', [
            'stokBarang' => $stokBarang
        ]);
    }

    public function rusak()
    {
        $stokRusak = RekapStokBarang::with([
                'lokasi' => fn($q) => $q->where('is_gudang', true),
                'modelBarang.kategori',
                'modelBarang.merek',
            ])
            ->whereHas('lokasi', fn($q) => $q->where('is_gudang', true))
            ->where('jumlah_rusak', '>', 0)
            ->get()
            ->map(fn($item) => [
                'lokasi' => $item->lokasi->nama,
                'kategori' => $item->modelBarang->kategori->nama ?? '-',
                'nama_barang' => trim(($item->modelBarang->merek->nama ?? '') . ' ' . $item->modelBarang->nama),
                'jumlah_rusak' => $item->jumlah_rusak,
            ]);

        return Inertia::render('stock/gudang/rusak', [
            'stokRusak' => $stokRusak,
        ]);
    }

    public function perbaikan()
    {
        $stokPerbaikan = RekapStokBarang::with([
                'lokasi' => fn($q) => $q->where('is_gudang', true),
                'modelBarang.kategori',
                'modelBarang.merek',
            ])
            ->whereHas('lokasi', fn($q) => $q->where('is_gudang', true))
            ->where('jumlah_perbaikan', '>', 0)
            ->get()
            ->map(fn($item) => [
                'lokasi' => $item->lokasi->nama,
                'kategori' => $item->modelBarang->kategori->nama ?? '-',
                'nama_barang' => trim(($item->modelBarang->merek->nama ?? '') . ' ' . $item->modelBarang->nama),
                'jumlah_perbaikan' => $item->jumlah_perbaikan,
            ]);

        return Inertia::render('stock/gudang/perbaikan', [
            'stokPerbaikan' => $stokPerbaikan,
        ]);
    }
}
