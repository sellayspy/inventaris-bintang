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
        $query = BarangKembali::query()
            ->with([
                'lokasi',
                'details.barang.modelBarang' => function ($query) {
                    $query->with(['merek', 'kategori']);
                },
                'details'
            ])

            ->when($request->tanggal, fn ($q) => $q->whereDate('tanggal', $request->tanggal))
            ->when($request->lokasi_id, fn ($q) => $q->where('lokasi_id', $request->lokasi_id))
            ->when($request->kategori_id, function ($q) use ($request) {
                $q->whereHas('details.barang.modelBarang', function ($subQuery) use ($request) {
                    $subQuery->where('kategori_id', $request->kategori_id);
                });
            })

            ->when($request->search, function ($q) use ($request) {
                $search = '%' . strtolower($request->search) . '%';
                $q->where(function ($query) use ($search) {
                    $query->orWhereHas('details.barang', function ($subQuery) use ($search) {
                        $subQuery->whereRaw('LOWER(serial_number) ILIKE ?', [$search]);
                    })
                    ->orWhereHas('details.barang.modelBarang', function ($subQuery) use ($search) {
                        $subQuery->whereRaw('LOWER(nama) ILIKE ?', [$search]);
                    })
                    ->orWhereHas('details.barang.modelBarang.merek', function ($subQuery) use ($search) {
                        $subQuery->whereRaw('LOWER(nama) ILIKE ?', [$search]);
                    })
                    ->orWhereHas('details.barang.modelBarang.kategori', function ($subQuery) use ($search) {
                        $subQuery->whereRaw('LOWER(nama) ILIKE ?', [$search]);
                    });
                });
            })
            ->orderByDesc('tanggal')
            ->latest()
            ->paginate(10)
            ->withQueryString();


        return Inertia::render('transaksi/barang-kembali/BarangKembaliIndex', [
            'barangKembali' => $query,
            'filters' => $request->only(['tanggal', 'kategori_id', 'lokasi_id', 'search']),
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

    public function edit(BarangKembali $barangKembali)
    {
        // Eager load relasi yang diperlukan
        $barangKembali->load('details.barang.modelBarang.merek', 'details.barang.modelBarang.kategori', 'lokasi');

        if ($barangKembali->details->isEmpty()) {
            return redirect()->route('barang-kembali.index')->with('error', 'Transaksi ini tidak memiliki detail barang.');
        }

        // Ambil referensi dari barang pertama di dalam transaksi
        $firstBarang = $barangKembali->details->first()->barang;

        // Menyiapkan data yang akan diedit
        $dataToEdit = [
            'id' => $barangKembali->id,
            'tanggal' => $barangKembali->tanggal,
            'lokasi' => $barangKembali->lokasi->nama,
            // Tambahkan data ini untuk mengisi form
            'kategori' => $firstBarang->modelBarang->kategori->nama,
            'merek' => $firstBarang->modelBarang->merek->nama,
            'model' => $firstBarang->modelBarang->nama,
            // ---
            'serial_numbers' => $barangKembali->details->pluck('barang.serial_number')->all(),
            'kondisi_map' => $barangKembali->details->pluck('status_saat_kembali', 'barang.serial_number')->all(),
        ];

        // Ambil daftar lokasi seperti di fungsi create
        $lokasiDenganStok = RekapStokBarang::where('jumlah_tersedia', '>', 0)->pluck('lokasi_id')->unique();
        $lokasiList = Lokasi::where('is_gudang', false)->whereIn('id', $lokasiDenganStok)->get();

        // Kirim juga semua list yang dibutuhkan untuk filter, sama seperti di 'create'
        $kategoriList = KategoriBarang::all();
        $merekList = MerekBarang::select('id', 'nama')->distinct()->get();
        $modelList = ModelBarang::select('id', 'nama')->distinct()->get();

        return Inertia::render('transaksi/barang-kembali/BarangKembaliEdit', [
            'barangKembali' => $dataToEdit,
            'lokasiList' => $lokasiList,
            'kategoriList' => $kategoriList, // Kirim list ini
            'merekList' => $merekList,       // Kirim list ini
            'modelList' => $modelList,       // Kirim list ini
        ]);
    }

    public function update(Request $request, BarangKembali $barangKembali)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|exists:barang,serial_number',
            'kondisi_map' => 'required|array',
            'kondisi_map.*' => 'required|string|in:bagus,rusak,diperbaiki',
        ]);

        DB::transaction(function () use ($request, $barangKembali) {
            $lokasiDistribusi = Lokasi::where('nama', $request->lokasi)->firstOrFail();
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            // Update data utama jika ada perubahan
            $barangKembali->update(['tanggal' => $request->tanggal]);

            $oldDetails = $barangKembali->details()->with('barang')->get();
            $oldSerials = $oldDetails->pluck('barang.serial_number')->all();
            $newSerials = $request->serial_numbers;
            $kondisiMap = $request->kondisi_map;

            //
            // 1) Barang yang DIBATALKAN KEMBALI (dihapus dari form)
            //
            $serialsToUndo = array_diff($oldSerials, $newSerials);
            foreach ($serialsToUndo as $serial) {
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);
                if (!$detail) continue;

                $barang = $detail->barang;
                $oldKondisi = $detail->status_saat_kembali;

                // Reverse: kurangi stok gudang sesuai kondisi yang sebelumnya dicatat
                StockHelpers::kurangiStokKembali($barang->model_id, $lokasiGudang->id, $oldKondisi);

                // Kembalikan ke lokasi distribusi (tambah jumlah tersedia di distribusi)
                StockHelpers::distribusiMasuk($barang->model_id, $lokasiDistribusi->id, 1);

                // Update lokasi & status barang ke kondisi semula (dipinjamkan)
                $barang->update(['lokasi_id' => $lokasiDistribusi->id, 'status' => 'dipinjamkan']);

                // Catat mutasi: dari GUDANG --> DISTRIBUSI (pembatalan pengembalian)
                MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => $lokasiGudang->id,
                    'lokasi_tujuan_id' => $lokasiDistribusi->id,
                    'tanggal' => $request->tanggal,
                    'keterangan' => "Pembatalan pengembalian — kembali ke distribusi. Kondisi sebelumnya: {$oldKondisi}",
                ]);

                // Hapus detail transaksi kembali
                $detail->delete();
            }

            //
            // 2) Barang BARU atau yang KONDISINYA BERUBAH
            //
            foreach ($newSerials as $serial) {
                $barang = Barang::where('serial_number', $serial)->firstOrFail();
                $kondisi = $kondisiMap[$serial] ?? 'bagus';
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);

                if ($detail) {
                    // Barang sudah ada di detail, cek perubahan kondisi
                    if ($detail->status_saat_kembali !== $kondisi) {
                        // Reverse stok kondisi lama di gudang
                        StockHelpers::kurangiStokKembali($barang->model_id, $lokasiGudang->id, $detail->status_saat_kembali);

                        // Tambah stok kondisi baru di gudang
                        StockHelpers::kembalikanStok($barang->model_id, $lokasiGudang->id, $kondisi);

                        // Update detail & barang
                        $detail->update(['status_saat_kembali' => $kondisi]);
                        $barang->update(['status' => $kondisi]);

                        MutasiBarang::create([
                            'barang_id' => $barang->id,
                            'lokasi_asal_id' => $lokasiGudang->id,
                            'lokasi_tujuan_id' => $lokasiGudang->id,
                            'tanggal' => $request->tanggal,
                            'keterangan' => "Perubahan kondisi pada transaksi kembali: {$kondisi}",
                        ]);
                    }
                } else {
                    // Barang baru ditambahkan ke transaksi kembali
                    // simpan kondisi awal sebelum diproses
                    $kondisiAwal = $barang->status;

                    // Pindah barang ke gudang dan set status sesuai kondisi yang dikembalikan
                    $barang->update(['status' => $kondisi, 'lokasi_id' => $lokasiGudang->id]);

                    BarangKembaliDetail::create([
                        'barang_kembali_id' => $barangKembali->id,
                        'barang_id' => $barang->id,
                        'status_saat_kembali' => $kondisi,
                        'kondisi_awal_saat_kembali' => $kondisiAwal,
                    ]);

                    // Tambah stok gudang sesuai kondisi, kurangi stok di distribusi
                    StockHelpers::kembalikanStok($barang->model_id, $lokasiGudang->id, $kondisi);
                    StockHelpers::kurangiStokDistribusi($barang->model_id, $lokasiDistribusi->id, 1);

                    MutasiBarang::create([
                        'barang_id' => $barang->id,
                        'lokasi_asal_id' => $lokasiDistribusi->id,
                        'lokasi_tujuan_id' => $lokasiGudang->id,
                        'tanggal' => $request->tanggal,
                        'keterangan' => "Barang kembali dengan kondisi: {$kondisi}",
                    ]);
                }
            }
        });

        return redirect()->route('barang-kembali.index')->with('success', 'Transaksi barang kembali berhasil diperbarui.');
    }

    public function show($id)
    {
        $barangKembali = BarangKembali::with([
            'lokasi',
            'user',
            'details.barang.modelBarang' => function ($query) {
                $query->with(['merek', 'kategori']);
            },

            'details'
        ])->findOrFail($id);


        return Inertia::render('transaksi/barang-kembali/BarangKembaliDetail', [
            'barangKembali' => $barangKembali,
        ]);
    }

}
