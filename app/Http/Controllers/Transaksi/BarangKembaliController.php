<?php

namespace App\Http\Controllers\Transaksi;

use App\Helpers\StockHelpers;
use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\BarangKeluar;
use App\Models\BarangKembali;
use App\Models\BarangKembaliDetail;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use App\Models\Lokasi;
use App\Models\MerekBarang;
use App\Models\ModelBarang;
use App\Models\MutasiBarang;
use App\Models\RekapStokBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class BarangKembaliController extends Controller
{
   public function index(Request $request)
    {
        $query = BarangKembali::with([
            'details.barang.modelBarang.merek',
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
                        'merek' => $detail->barang->modelBarang->merek->nama ?? '-',
                        'model' => $detail->barang->modelBarang->nama ?? '-',
                        'kategori' => $detail->barang->jenisBarang->kategori->nama ?? '-',
                        'lokasi' => $kembali->lokasi?->nama ?? '-',
                        'kondisi' => $detail->barang->status ?? '-',
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
        $barangKeluarIds = BarangKeluar::where('lokasi_id', $lokasiId)->pluck('id');

                    $serials = Barang::whereIn('id', function ($query) use ($barangKeluarIds) {
                            $query->select('barang_id')
                                ->from('barang_keluar_detail')
                                ->whereIn('barang_keluar_id', $barangKeluarIds)
                                ->whereNotIn('barang_id', function ($q) {
                                    $q->select('barang_id')->from('barang_kembali_detail');
                                });
                        })
                        ->pluck('serial_number')
                        ->filter()
                        ->values();
        return response()->json($serials);
    }

    public function getKategoriByLokasi($lokasiId)
    {
        $kategori = DB::table('barang')
            ->join('jenis_barang', 'barang.jenis_barang_id', '=', 'jenis_barang.id')
            ->join('kategori_barang', 'jenis_barang.kategori_id', '=', 'kategori_barang.id')
            ->where('barang.lokasi_id', $lokasiId)
            ->select('kategori_barang.id', 'kategori_barang.nama')
            ->distinct()
            ->get();

        return response()->json($kategori);
    }

    public function getMerekByKategoriDanLokasi($lokasiId, $kategoriNama)
    {
        $kategoriId = KategoriBarang::where('nama', $kategoriNama)->value('id');

        $merek = DB::table('barang')
            ->join('jenis_barang', 'barang.jenis_barang_id', '=', 'jenis_barang.id')
            ->join('model_barang', 'barang.model_id', '=', 'model_barang.id')
            ->join('merek_barang', 'model_barang.merek_id', '=', 'merek_barang.id')
            ->where('barang.lokasi_id', $lokasiId)
            ->where('jenis_barang.kategori_id', $kategoriId)
            ->select('merek_barang.id', 'merek_barang.nama')
            ->distinct()
            ->get();

        return response()->json($merek);
    }

    public function getModelByMerekDanLokasi($lokasiId, $merekNama)
    {
        $merekId = MerekBarang::where('nama', $merekNama)->value('id');

        $model = DB::table('barang')
            ->join('model_barang', 'barang.model_id', '=', 'model_barang.id')
            ->where('barang.lokasi_id', $lokasiId)
            ->where('model_barang.merek_id', $merekId)
            ->select('model_barang.id', 'model_barang.nama')
            ->distinct()
            ->get();

        return response()->json($model);
    }

    public function getSerialByModelDanLokasi($lokasiId, $modelNama)
    {
        $serials = DB::table('barang')
            ->join('model_barang', 'barang.model_id', '=', 'model_barang.id')
            ->where('barang.lokasi_id', $lokasiId)
            ->where('model_barang.nama', $modelNama)
            ->whereNotNull('barang.serial_number')
            ->select('barang.serial_number')
            ->distinct()
            ->pluck('serial_number');

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

        // Ambil semua kategori
        $kategoriList = KategoriBarang::all();

        // Ambil merek unik dari tabel merek_barang
        $merekList = MerekBarang::select('id', 'nama')->distinct()->get();

        // Ambil model unik dari tabel model_barang
        $modelList = ModelBarang::select('id', 'nama')->distinct()->get();

        return Inertia::render('transaksi/barang-kembali/BarangKembaliCreate', [
            'lokasiList' => $lokasiList,
            'kategoriList' => $kategoriList,
            'merekList' => $merekList,
            'modelList' => $modelList,
            'serialNumberList' => [],
            ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100',
            'kategori' => 'required|string|max:100',
            'merek' => 'required|string|max:100',
            'model' => 'required|string|max:100',
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
                'user_id' => auth()->id(),
            ]);

            foreach ($request->serial_numbers as $serial) {
                $barang = Barang::where('serial_number', $serial)->firstOrFail();

                // Validasi jika barang belum keluar
                if ($barang->lokasi_id === $lokasiGudang->id) {
                    throw ValidationException::withMessages([
                        'serial_numbers' => "Barang dengan serial {$serial} belum keluar dari gudang.",
                    ]);
                }

                $status = $request->kondisi_map[$serial] ?? 'bagus';
                $kondisiAwal = 'second';

                // Update kondisi & lokasi
                $barang->update([
                    'status' => $status,
                    'kondisi_awal' => $kondisiAwal,
                    'lokasi_id' => $lokasiGudang->id,
                ]);

                // Catat kondisi saat kembali ke detail
                BarangKembaliDetail::create([
                    'barang_kembali_id' => $barangKembali->id,
                    'barang_id' => $barang->id,
                    'status_saat_kembali' => $status,
                    'kondisi_awal_saat_kembali' => $kondisiAwal,
                ]);

                // Update stok sesuai kondisi
                StockHelpers::kembalikanStok($barang->model_id, $lokasiGudang->id, $status);

                // Kurangi stok dari lokasi distribusi
                StockHelpers::kurangiStokDistribusi($barang->model_id, $lokasiDistribusi->id, 1);

                MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => $lokasiDistribusi->id,
                    'lokasi_tujuan_id' => $lokasiGudang->id,
                    'tanggal' => $request->tanggal,
                    'keterangan' => "Barang kembali dengan status: {$status}",
                ]);
            }
        });

        return redirect()->route('barang-kembali.index')->with('success', 'Barang berhasil dikembalikan.');
    }

}
