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
            'rusak' => $rekap->sum('jumlah_rusak'),
            'perbaikan' => $rekap->sum('jumlah_perbaikan'),
            'total' => $rekap->sum('jumlah_total'),
        ];

        return Inertia::render('stock/index', [
            'summary' => $summary
        ]);
    }

    private function sharedFilters(Request $request): array
    {
        return [
            'filters' => [
                'kategori_id' => $request->kategori_id,
                'lokasi_id' => $request->lokasi_id,
                'search' => $request->search,
            ],
            'kategoriList' => \App\Models\KategoriBarang::select('id', 'nama')->get(),
            'lokasiList' => \App\Models\Lokasi::select('id', 'nama')->get(),
        ];
    }

    private function baseQuery(Request $request)
    {
        return RekapStokBarang::with(['jenisBarang.kategori', 'lokasi'])
            ->when($request->kategori_id, fn($q) =>
                $q->whereHas('jenisBarang', fn($q2) =>
                    $q2->where('kategori_id', $request->kategori_id)
                )
            )
            ->when($request->lokasi_id, fn($q) => $q->where('lokasi_id', $request->lokasi_id))
            ->when($request->search, fn($q) =>
                $q->whereHas('jenisBarang', fn($q2) =>
                    $q2->where('merek', 'like', '%' . $request->search . '%')
                        ->orWhere('model', 'like', '%' . $request->search . '%')
                )
            );
    }

    private function formatResult($data, string $field)
    {
        return $data->filter(fn($i) => $i->$field > 0)->map(fn($item) => [
            'id' => $item->id,
            'jenis_barang' => $item->jenisBarang->merek . ' ' . $item->jenisBarang->model,
            'kategori' => $item->jenisBarang->kategori->nama ?? '-',
            'lokasi' => $item->lokasi->nama ?? '-',
            'jumlah' => $item->$field,
        ])->values();
    }


    public function gudang(Request $request)
    {
        $query = $this->baseQuery($request)
            ->whereHas('lokasi', fn($q) => $q->where('is_gudang', true))
            ->get();

        return Inertia::render('stock/gudang', array_merge([
            'items' => $this->formatResult($query, 'jumlah_tersedia'),
        ], $this->sharedFilters($request)));
    }

    public function distribusi(Request $request)
    {
        $query = $this->baseQuery($request)
            ->whereHas('lokasi', fn($q) => $q->where('is_gudang', false))
            ->get();

        return Inertia::render('stock/distribusi', array_merge([
            'items' => $this->formatResult($query, 'jumlah_tersedia'),
        ], $this->sharedFilters($request)));
    }

    public function perbaikan(Request $request)
    {
        $query = $this->baseQuery($request)->get();
        return Inertia::render('stock/perbaikan', array_merge([
            'items' => $this->formatResult($query, 'jumlah_perbaikan'),
        ], $this->sharedFilters($request)));
    }

    public function rusak(Request $request)
    {
        $query = $this->baseQuery($request)->get();
        return Inertia::render('stock/rusak', array_merge([
            'items' => $this->formatResult($query, 'jumlah_rusak'),
        ], $this->sharedFilters($request)));
    }

    public function total(Request $request)
    {
        $query = $this->baseQuery($request)->get();
        return Inertia::render('stock/total', array_merge([
            'items' => $this->formatResult($query, 'jumlah_total'),
        ], $this->sharedFilters($request)));
    }

}
