<?php

namespace App\Http\Controllers\Transaksi;

use App\Helpers\StockHelpers;
use App\Http\Controllers\Controller;
use App\Models\AsalBarang;
use App\Models\Barang;
use App\Models\BarangMasuk;
use App\Models\BarangMasukDetail;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use App\Models\Lokasi;
use App\Models\MerekBarang;
use App\Models\ModelBarang;
use App\Models\MutasiBarang;
use App\Models\RakBarang;
use App\Models\View\ViewBarangMasuk;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BarangMasukController extends Controller
{
    public function index(Request $request)
    {
        $query = ViewBarangMasuk::query();

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        if ($request->filled('kategori_id')) {
            $query->where('kategori_id', $request->kategori_id);
        }

        if ($request->filled('asal_barang_id')) {
            $query->where('asal_barang_id', $request->asal_barang_id);
        }

        if ($request->filled('merek')) {
            $query->whereRaw('LOWER(merek) LIKE ?', ['%' . strtolower($request->merek) . '%']);
        }

        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(merek) LIKE ?', ["%{$search}%"]);
            });
        }

        $sort = $request->input('sort_by', 'desc');
        if (!in_array($sort, ['asc', 'desc'])) {
            $sort = 'desc';
        }

        $barangMasuk = $query->orderBy('tanggal', $sort)->paginate(20)->withQueryString();

        return Inertia::render('transaksi/barang-masuk/barang-masuk-index', [
            'barangMasuk' => $barangMasuk,
            'filters' => $request->only('tanggal', 'kategori_id', 'asal_barang_id', 'merek', 'search', 'sort_by'),
            'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
            'asalOptions' => AsalBarang::select('id', 'nama')->get(),
            'merekOptions' => MerekBarang::select('id', 'nama')->get(),
            'modelOptions' => ModelBarang::select('id', 'nama')->get(),
            'jenisOptions' => JenisBarang::select('id', 'nama')->get(),
            'rakOptions' => RakBarang::select('id', 'nama_rak', 'kode_rak')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('transaksi/barang-masuk/barang-masuk-create', [
            'kategoriList' => KategoriBarang::all(),
            'asalList' => AsalBarang::all(),
            'merekList' => MerekBarang::all(),
            'modelList' => ModelBarang::all(),
            'jenisList' => JenisBarang::all(),
            'rakList' => RakBarang::all(),
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

    public function getJenisByKategori(Request $request)
    {
        $kategori = $request->input('kategori');

        $kategoriModel = KategoriBarang::where('nama', $kategori)->first();

        if (!$kategoriModel) {
            return response()->json([]);
        }

        $jenisList = JenisBarang::where('kategori_id', $kategoriModel->id)->pluck('nama');

        return response()->json($jenisList);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'merek' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'asal_barang' => 'nullable|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|unique:barang,serial_number',
        ]);

        DB::transaction(function () use ($request) {
            $kategori = KategoriBarang::firstOrCreate(['nama' => $request->kategori]);
            $merek = MerekBarang::firstOrCreate(['nama' => $request->merek]);

            $jenis = JenisBarang::firstOrCreate([
                'kategori_id' => $kategori->id,
                'nama' => $request->jenis_barang,
            ]);

            $model = ModelBarang::firstOrCreate([
                'kategori_id' => $kategori->id,
                'merek_id' => $merek->id,
                'jenis_id' => $jenis->id,
                'nama' => $request->model,
            ]);

            $asal = null;
            if ($request->filled('asal_barang')) {
                $asal = AsalBarang::firstOrCreate(['nama' => $request->asal_barang]);
            }

            $barangMasuk = BarangMasuk::create([
                'tanggal' => $request->tanggal,
                'asal_barang_id' => $asal?->id,
                'user_id' => auth()->id(),
            ]);

            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            foreach ($request->serial_numbers as $serial) {
                $barang = Barang::create([
                    'model_id' => $model->id,
                    'jenis_barang_id' => $jenis->id,
                    'asal_id' => $asal?->id,
                    'lokasi_id' => $lokasiGudang->id,
                    'serial_number' => $serial,
                    'kondisi_awal' => 'baru',
                    'status' => 'baik',
                ]);

                BarangMasukDetail::create([
                    'barang_masuk_id' => $barangMasuk->id,
                    'barang_id' => $barang->id,
                ]);

                MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => null,
                    'lokasi_tujuan_id' => $lokasiGudang->id,
                    'tanggal' => $request->tanggal,
                    'keterangan' => 'Barang masuk dari sumber ' . ($asal?->nama ?? 'manual'),
                ]);

                StockHelpers::barangMasuk($model->id, $lokasiGudang->id, 1);
            }
        });
        return redirect()->route('barang-masuk.index')->with('success', 'Barang berhasil dicatat.');
    }
}
