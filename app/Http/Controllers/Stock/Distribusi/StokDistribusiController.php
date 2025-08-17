<?php

namespace App\Http\Controllers\Stock\Distribusi;

use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\Lokasi;
use App\Models\ModelBarang;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StokDistribusiController extends Controller
{
    public function index()
    {
        $stokDistribusi = RekapStokBarang::with([
                'lokasi' => function ($q) {
                    $q->where('is_gudang', false); // Hanya lokasi selain gudang
                },
                'modelBarang.kategori',
                'modelBarang.merek',
            ])
            ->whereHas('lokasi', function ($q) {
                $q->where('is_gudang', false); // Filter hanya lokasi non-gudang
            })
            ->where('jumlah_tersedia', '>', 0) // Hanya stok tersedia
            ->get()
            ->map(function ($item) {
                return [
                    'lokasi_id' => $item->lokasi->id,
                    'model_id' => $item->modelBarang->id,
                    'lokasi' => $item->lokasi->nama,
                    'kategori' => $item->modelBarang->kategori->nama ?? '-',
                    'merek' => $item->modelBarang->merek->nama ?? '-',
                    'model' => $item->modelBarang->nama,
                    'jumlah_tersedia' => $item->jumlah_tersedia,
                ];
            });

        return Inertia::render('stock/distribusi/index', [
            'stokDistribusi' => $stokDistribusi,
        ]);
    }

    public function getDetailAsJson(ModelBarang $modelBarang, Lokasi $lokasi)
    {
        $barangList = Barang::query()
            ->where('model_id', $modelBarang->id)
            ->where('lokasi_id', $lokasi->id)
            ->select('id', 'serial_number', 'status') // Pilih kolom yang relevan
            ->latest('created_at')
            ->get();

        return response()->json($barangList);
    }
}
