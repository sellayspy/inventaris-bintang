<?php

namespace App\Http\Controllers\Transaksi;

use App\Helpers\StockHelpers;
use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangKeluar;
use App\Models\BarangKeluarDetail;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use App\Models\Lokasi;
use App\Models\MerekBarang;
use App\Models\ModelBarang;
use App\Models\MutasiBarang;
use App\Models\View\ViewBarangKeluar;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class BarangKeluarController extends Controller
{
    public function index(Request $request)
    {
        $query = ViewBarangKeluar::query();

        // Filter tanggal
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        // Filter kategori
        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }

        // Filter lokasi
        if ($request->filled('lokasi_id')) {
            $query->where('lokasi_id', $request->lokasi_id);
        }

        $barangKeluar = $query->latest('tanggal')->paginate(20)->withQueryString();

        return Inertia::render('transaksi/barang-keluar/BarangKeluarIndex', [
            'barangKeluar' => $barangKeluar,
            'filters' => $request->only('tanggal', 'kategori_id', 'lokasi_id'),
            'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
            'lokasiOptions' => Lokasi::select('id', 'nama')->get(),
        ]);
    }

    public function getModelByKategoriMerek(Request $request)
    {
        $kategori = $request->input('kategori');
        $merek = $request->input('merek');

        $kategoriModel = KategoriBarang::where('nama', $kategori)->first();
        $merekModel = MerekBarang::where('nama', $merek)->first();

        if (!$kategoriModel || !$merekModel) {
            return response()->json([]);
        }

        $models = ModelBarang::where('kategori_id', $kategoriModel->id)
            ->where('merek_id', $merekModel->id)
            ->pluck('nama');

        return response()->json($models);
    }

    public function create()
    {
        $barang = Barang::with(['jenisBarang.kategori', 'modelBarang.merek'])
            ->whereNotIn('id', function ($query) {
                $query->select('barang_id')->from('barang_keluar_detail');
            })
            ->get();

        $serialNumberList = $barang->filter(fn($item) =>$item->modelBarang && $item->modelBarang->merek
            )->groupBy(function ($item) {
                $merek = $item->modelBarang->merek->nama ?? '-';
                $model = $item->modelBarang->nama ?? '-';
                return $merek . '|' . $model;
            })->map(fn($group) =>
                $group->pluck('serial_number')->filter()->values()
            );

        return Inertia::render('transaksi/barang-keluar/barang-keluar-create', [
            'kategoriList' => KategoriBarang::all(),
            'lokasiList' => Lokasi::where('is_gudang', false)->get(),
            'merekList' => MerekBarang::with(['modelBarang.jenis'])->get(),
            'modelList' => ModelBarang::with(['merek', 'jenis.kategori'])->get(),
            'serialNumberList' => $serialNumberList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'merek' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'lokasi' => 'required|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|exists:barang,serial_number',
        ]);

        DB::transaction(function () use ($request) {
            // Buat kategori jika belum ada
            $kategori = KategoriBarang::firstOrCreate(['nama' => $request->kategori]);

            // Buat merek jika belum ada
            $merek = MerekBarang::firstOrCreate(['nama' => $request->merek]);

            // Buat model barang jika belum ada
            $model = ModelBarang::firstOrCreate([
                'nama' => $request->model,
                'kategori_id' => $kategori->id,
                'merek_id' => $merek->id,
            ]);

            // Buat jenis barang jika belum ada
            $jenis = JenisBarang::firstOrCreate([
                'kategori_id' => $kategori->id,
            ]);

            // Lokasi distribusi
            $lokasi = Lokasi::firstOrCreate(['nama' => $request->lokasi]);

            // Buat data barang keluar
            $barangKeluar = BarangKeluar::create([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasi->id,
                'user_id' => auth()->id(),
            ]);

            $statusMap = $request->input('status_keluar', []);
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            foreach ($request->serial_numbers as $serial) {
                $barang = Barang::where('serial_number', $serial)->firstOrFail();

                $status = $statusMap[$serial] ?? 'dipinjamkan';

                // Update lokasi dan status barang
                $barang->update([
                    'lokasi_id' => $lokasi->id,
                    'status' => $status,
                ]);

                // Tambah ke detail barang keluar
                BarangKeluarDetail::create([
                    'barang_keluar_id' => $barangKeluar->id,
                    'barang_id' => $barang->id,
                    'status_keluar' => $status,
                ]);

                // Update stok gudang
                if ($status === 'dipinjamkan') {
                    StockHelpers::pindahkanStok($barang->model_id, $lokasiGudang->id, $lokasi->id, 1);
                }

                // Catat mutasi barang
                MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => $lokasiGudang->id,
                    'lokasi_tujuan_id' => $lokasi->id,
                    'tanggal' => $request->tanggal,
                    'keterangan' => "Barang keluar dengan status: {$status}",
                ]);
            }
        });

        return redirect()->route('barang-keluar.index')->with('success', 'Barang berhasil didistribusikan.');
    }

}
