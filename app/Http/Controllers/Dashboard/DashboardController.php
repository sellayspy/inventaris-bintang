<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\BarangKeluar;
use App\Models\BarangKembali;
use App\Models\BarangMasuk;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Ringkasan total stok
        $stokSummary = RekapStokBarang::selectRaw('
                SUM(jumlah_tersedia) as tersedia,
                SUM(jumlah_rusak) as rusak,
                SUM(jumlah_perbaikan) as perbaikan,
                SUM(jumlah_total) as total
            ')
            ->first();

        // Stok per lokasi
        $stokPerLokasi = RekapStokBarang::with('lokasi')
            ->select('lokasi_id')
            ->selectRaw('
                SUM(jumlah_tersedia) as tersedia,
                SUM(jumlah_rusak) as rusak,
                SUM(jumlah_perbaikan) as perbaikan,
                SUM(jumlah_total) as total
            ')
            ->groupBy('lokasi_id')
            ->get()
            ->map(function ($item) {
                return [
                    'lokasi' => $item->lokasi->nama ?? 'Tidak diketahui',
                    'tersedia' => $item->tersedia,
                    'rusak' => $item->rusak,
                    'perbaikan' => $item->perbaikan,
                    'total' => $item->total,
                ];
            });

        // Aktivitas terakhir
        $latestMasuk = BarangMasuk::with('lokasi')->latest()->take(5)->get()
            ->map(fn($item) => [
                'tanggal' => $item->tanggal,
                'keterangan' => 'Barang masuk ke ' . ($item->lokasi->nama ?? '-'),
            ]);

        $latestKeluar = BarangKeluar::with('lokasi')->latest()->take(5)->get()
            ->map(fn($item) => [
                'tanggal' => $item->tanggal,
                'keterangan' => 'Barang keluar ke ' . ($item->lokasi->nama ?? '-'),
            ]);

        $latestKembali = BarangKembali::with('lokasi')->latest()->take(5)->get()
            ->map(fn($item) => [
                'tanggal' => $item->tanggal,
                'keterangan' => 'Barang kembali dari ' . ($item->lokasi->nama ?? '-'),
            ]);

        // Stok kritis (tersedia < 5)
        $stokKritis = RekapStokBarang::where('jumlah_tersedia', '<', 5)
                    ->with(['lokasi', 'jenisBarang'])
                    ->get()
                    ->map(function ($item) {
                        return [
                            'nama' => $item->jenisBarang->nama ?? 'Tidak diketahui',
                            'lokasi' => $item->lokasi->nama ?? 'Tidak diketahui',
                            'tersedia' => $item->jumlah_tersedia,
                        ];
                    });

        $totalKategori = KategoriBarang::count();
        $totalJenisBarang = JenisBarang::count();

        return Inertia::render('Dashboard', [
            'stokSummary' => $stokSummary,
            'stokPerLokasi' => $stokPerLokasi,
            'latestMasuk' => $latestMasuk,
            'latestKeluar' => $latestKeluar,
            'latestKembali' => $latestKembali,
            'stokKritis' => $stokKritis,

            // Ini tambahan
            'totalKategori' => $totalKategori,
            'totalJenisBarang' => $totalJenisBarang,
        ]);
    }
}
