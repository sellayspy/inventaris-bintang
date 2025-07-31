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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class BarangKeluarController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangKeluar::with([
            'details.barang.jenisBarang.kategori',
            'lokasi'
        ]);

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        if ($request->filled('kategori_id')) {
            $query->whereHas('details.barang.jenisBarang.kategori', function ($q) use ($request) {
                $q->where('id', $request->kategori_id);
            });
        }

        if ($request->filled('lokasi_id')) {
            $query->where('lokasi_id', $request->lokasi_id);
        }

        $barangKeluar = $query->latest()->paginate(20)->withQueryString();

        $flattened = $barangKeluar->getCollection()
            ->flatMap(function ($keluar) {
                return $keluar->details->map(function ($detail) use ($keluar) {
                    return [
                        'id' => $keluar->id,
                        'tanggal' => $keluar->tanggal,
                        'serial_number' => $detail->barang->serial_number ?? '-',
                        'merek' => $detail->barang->jenisBarang->merek ?? '-',
                        'model' => $detail->barang->jenisBarang->model ?? '-',
                        'kategori' => $detail->barang->jenisBarang->kategori->nama ?? '-',
                        'lokasi' => $keluar->lokasi?->nama ?? '-',
                    ];
                });
            });

        $barangKeluar->setCollection($flattened);

        return Inertia::render('transaksi/barang-keluar/BarangKeluarIndex', [
            'barangKeluar' => $barangKeluar,
            'filters' => $request->only('tanggal', 'kategori_id', 'lokasi_id'),
            'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
            'lokasiOptions' => Lokasi::select('id', 'nama')->get(),
        ]);
    }

    public function create()

    {
        return Inertia::render('transaksi/barang-keluar/barang-keluar-create', [
            'kategoriList' => KategoriBarang::all(),
            'lokasiList' => Lokasi::where('is_gudang', false)->get(),
            'merekList' => JenisBarang::distinct()->pluck('merek'),
            'modelList' => JenisBarang::distinct()->pluck('model'),
            'serialNumberList' => Barang::whereNotIn('id', function ($query) {
            $query->select('barang_id')->from('barang_keluar_detail');
                })->pluck('serial_number')->filter()->values(),

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
            'lokasi' => 'required|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|exists:barang,serial_number',
        ]);

        DB::transaction(function () use ($request) {
            $kategori = KategoriBarang::firstOrCreate(['nama' => $request->kategori]);

            $lokasi = Lokasi::firstOrCreate(['nama' => $request->lokasi]);

            $jenis = JenisBarang::firstOrCreate([
                'kategori_id' => $kategori->id,
                'merek' => $request->merek,
                'model' => $request->model,
            ]);

            $barangKeluar = BarangKeluar::create([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasi->id,
            ]);

            $statusMap = $request->input('status_keluar', []);

            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();


            foreach ($request->serial_numbers as $serial) {
                $barang = Barang::where('serial_number', $serial)->firstOrFail();

                $status = $statusMap[$serial] ?? 'dipinjamkan';

                BarangKeluarDetail::create([
                    'barang_keluar_id' => $barangKeluar->id,
                    'barang_id' => $barang->id,
                    'status_keluar' => $status,
                ]);

                if ($status === 'dipinjamkan') {
                    StockHelpers::pindahkanStok($barang->jenis_barang_id, $lokasiGudang->id, $lokasi->id, 1);
                }

            }

        });

        return redirect()->route('barang-keluar.index')->with('success', 'Barang berhasil didistribusikan.');
    }

}
