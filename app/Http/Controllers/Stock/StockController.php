<?php

namespace App\Http\Controllers\Stock;

use App\Http\Controllers\Controller;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        $rekap = RekapStokBarang::with(['modelBarang.kategori', 'lokasi'])->get();

        $summary = [
            'gudang' => $rekap->filter(fn($i) => $i->lokasi?->is_gudang)->sum('jumlah_tersedia'),
            'distribusi' => $rekap->filter(fn($i) => !$i->lokasi?->is_gudang)->sum('jumlah_tersedia'),
            'terjual' => $rekap->filter(fn($i) => $i->lokasi?->is_gudang)->sum('jumlah_terjual'),
            'rusak' => $rekap->sum('jumlah_rusak'),
            'perbaikan' => $rekap->sum('jumlah_perbaikan'),
            'total' => $rekap->sum('jumlah_total'),

        ];

        return Inertia::render('stock/index', [
            'summary' => $summary
        ]);
    }


}
