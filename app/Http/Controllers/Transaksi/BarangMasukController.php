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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BarangMasukController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangMasuk::with([
            'details.barang.jenisBarang.kategori',
            'asal'
        ]);

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        if ($request->filled('kategori_id')) {
            $query->whereHas('details.barang.jenisBarang.kategori', function ($q) use ($request) {
                $q->where('id', $request->kategori_id);
            });
        }

        if ($request->filled('asal_barang_id')) {
            $query->where('asal_barang_id', $request->asal_barang_id);
        }

        $barangMasuk = $query->latest()->paginate(20)->withQueryString();

        $flattened = $barangMasuk->getCollection()
            ->flatMap(function ($masuk) {
                return $masuk->details->map(function ($detail) use ($masuk) {
                    return [
                        'id' => $masuk->id,
                        'tanggal' => $masuk->tanggal,
                        'serial_number' => $detail->barang->serial_number ?? '-',
                        'merek' => $detail->barang->jenisBarang->merek ?? '-',
                        'model' => $detail->barang->jenisBarang->model ?? '-',
                        'kategori' => $detail->barang->jenisBarang->kategori->nama ?? '-',
                        'asal' => $masuk->asal?->nama ?? '-',
                    ];
                });
            });

        $barangMasuk->setCollection($flattened);

        return Inertia::render('transaksi/barang-masuk-index', [
            'barangMasuk' => $barangMasuk,
            'filters' => $request->only('tanggal', 'kategori_id', 'asal_barang_id'),
            'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
            'asalOptions' => AsalBarang::select('id', 'nama')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('transaksi/barang-masuk-create', [
            'kategoriList' => KategoriBarang::all(),
            'asalList' => AsalBarang::all(),
            'merekList' => JenisBarang::distinct()->pluck('merek'),
            'modelList' => JenisBarang::distinct()->pluck('model'),
        ]);
    }

    public function getJenisByKategori($kategoriId)
    {
        return JenisBarang::where('kategori_id', $kategoriId)->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'merek' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'name' => 'required|string|max:255',
            'asal_barang' => 'nullable|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|unique:barang,serial_number',
        ]);

        DB::transaction(function () use ($request) {

            $kategori = KategoriBarang::firstOrCreate(['nama' => $request->kategori]);


            $asal = null;
            if ($request->filled('asal_barang')) {
                $asal = AsalBarang::firstOrCreate(['nama' => $request->asal_barang]);
            }

            $jenis = JenisBarang::firstOrCreate([
                'kategori_id' => $kategori->id,
                'merek' => $request->merek,
                'model' => $request->model,
            ]);

            $barangMasuk = BarangMasuk::create([
                'tanggal' => $request->tanggal,
                'asal_barang_id' => $asal?->id,
            ]);

            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            foreach ($request->serial_numbers as $serial) {
                $barang = Barang::create([
                    'jenis_barang_id' => $jenis->id,
                    'name' => $request->name,
                    'asal_id' => $asal?->id,
                    'serial_number' => $serial,
                    'status' => 'baik',
                    'kondisi_awal' => 'baru',
                ]);

                BarangMasukDetail::create([
                    'barang_masuk_id' => $barangMasuk->id,
                    'barang_id' => $barang->id,
                ]);

                StockHelpers::barangMasuk($jenis->id, $lokasiGudang->id, 1);
            }
        });

        return redirect()->route('barang-masuk.index')->with('success', 'Barang berhasil dicatat.');
    }
}
