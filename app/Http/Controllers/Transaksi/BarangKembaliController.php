<?php

namespace App\Http\Controllers\Transaksi;

use App\Helpers\StockHelpers;
use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangKembali;
use App\Models\BarangKembaliDetail;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use App\Models\Lokasi;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BarangKembaliController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangKembali::with([
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

        $barangKembali = $query->latest()->paginate(20)->withQueryString();

        $flattened = $barangKembali->getCollection()
            ->flatMap(function ($kembali) {
                return $kembali->details->map(function ($detail) use ($kembali) {
                    return [
                        'id' => $kembali->id,
                        'tanggal' => $kembali->tanggal,
                        'serial_number' => $detail->barang->serial_number ?? '-',
                        'merek' => $detail->barang->jenisBarang->merek ?? '-',
                        'model' => $detail->barang->jenisBarang->model ?? '-',
                        'kategori' => $detail->barang->jenisBarang->kategori->nama ?? '-',
                        'lokasi' => $kembali->lokasi?->nama ?? '-',
                        'kondisi' => $detail->barang->status ?? '-', // jika ingin menampilkan kondisi
                    ];
                });
            });

        $barangKembali->setCollection($flattened);

        return Inertia::render('transaksi/barang-kembali/BarangKembaliIndex', [
            'barangKembali' => $barangKembali,
            'filters' => $request->only('tanggal', 'kategori_id', 'lokasi_id'),
            'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
            'lokasiOptions' => Lokasi::select('id', 'nama')->get(),
        ]);
    }

    public function getSerialByLokasi($lokasiId)
    {
        $serials = Barang::whereIn('id', function ($query) use ($lokasiId) {
            $query->select('barang_id')
                ->from('barang_keluar_detail')
                ->whereIn('barang_keluar_id', function ($sub) use ($lokasiId) {
                    $sub->select('id')
                        ->from('barang_keluar')
                        ->where('lokasi_id', $lokasiId);
                })
                ->whereNotIn('barang_id', function ($q) {
                    $q->select('barang_id')->from('barang_kembali_detail');
                });
        })->pluck('serial_number')->filter()->values();

        return response()->json($serials);
    }

    public function create()
    {
        $lokasiDenganStok = RekapStokBarang::where('jumlah_tersedia', '>', 0)
            ->pluck('lokasi_id')
            ->unique();

        $lokasiList = Lokasi::where('is_gudang', false)
            ->whereIn('id', $lokasiDenganStok)
            ->get();

        return Inertia::render('transaksi/barang-kembali/BarangKembaliCreate', [
            'lokasiList' => $lokasiList,
            'kategoriList' => KategoriBarang::all(),
            'merekList' => JenisBarang::distinct()->pluck('merek'),
            'modelList' => JenisBarang::distinct()->pluck('model'),
            'serialNumberList' => [], // akan diambil via fetch saat lokasi dipilih
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
            'lokasi' => 'required|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|exists:barang,serial_number',
            'kondisi_map' => 'required|array',
        ]);

        DB::transaction(function () use ($request) {
            $lokasiDistribusi = Lokasi::firstOrCreate(['nama' => $request->lokasi]);

            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            $barangKembali = BarangKembali::create([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasiDistribusi->id,
            ]);

            foreach ($request->serial_numbers as $serial) {
                $barang = Barang::where('serial_number', $serial)->firstOrFail();

                $status = $request->kondisi_map[$serial] ?? 'bagus'; // default bagus jika tidak ada
                $kondisiAwal = 'second'; // karena barang sudah pernah keluar

                // Simpan kondisi terbaru ke tabel barang
                $barang->status = $status;
                $barang->kondisi_awal = $kondisiAwal;
                $barang->save();

                // Catat kondisi saat kembali ke detail
                BarangKembaliDetail::create([
                    'barang_kembali_id' => $barangKembali->id,
                    'barang_id' => $barang->id,
                    'status_saat_kembali' => $status,
                    'kondisi_awal_saat_kembali' => $kondisiAwal,
                ]);

                // Update stok sesuai kondisi
                StockHelpers::kembalikanStok($barang->jenis_barang_id, $lokasiGudang->id, $status);

                // Kurangi stok dari lokasi distribusi
                StockHelpers::kurangiStokDistribusi($barang->jenis_barang_id, $lokasiDistribusi->id, 1);
            }
        });

        return redirect()->route('barang-kembali.index')->with('success', 'Barang berhasil dikembalikan.');
    }

}
