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
        // Validasi lengkap untuk payload multi-item
        $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100|exists:lokasi,nama',
            'items' => 'required|array|min:1',
            'items.*.kategori' => 'required|string',
            'items.*.merek' => 'required|string',
            'items.*.model' => 'required|string',
            'items.*.kembali_info' => 'required|array|min:1',
            'items.*.kembali_info.*.serial_number' => 'required|string|distinct|exists:barang,serial_number',
            'items.*.kembali_info.*.kondisi' => 'required|string|in:bagus,rusak,diperbaiki',
        ]);

        DB::transaction(function () use ($request) {
            $lokasiDistribusi = Lokasi::where('nama', $request->lokasi)->firstOrFail();
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            // Buat satu header transaksi
            $barangKembali = BarangKembali::create([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasiDistribusi->id, // Lokasi asal barang
                'user_id' => auth()->id(),
            ]);

            // Loop untuk setiap jenis model barang
            foreach ($request->items as $item) {
                // Loop untuk setiap serial number di dalamnya
                foreach ($item['kembali_info'] as $info) {
                    $serial = $info['serial_number'];
                    $kondisi = $info['kondisi'];

                    $barang = Barang::where('serial_number', $serial)->firstOrFail();

                    // Pastikan barang memang sedang berada di lokasi tersebut
                    if ($barang->lokasi_id !== $lokasiDistribusi->id) {
                        throw ValidationException::withMessages([
                            'items' => "Barang dengan SN:{$serial} tidak berada di lokasi {$request->lokasi}.",
                        ]);
                    }

                    // Update kondisi & pindahkan lokasi barang ke gudang
                    $barang->update([
                        'status' => $kondisi,
                        'kondisi_awal' => 'second',
                        'lokasi_id' => $lokasiGudang->id,
                    ]);

                    // Buat detail transaksi
                    BarangKembaliDetail::create([
                        'barang_kembali_id' => $barangKembali->id,
                        'barang_id' => $barang->id,
                        'status_saat_kembali' => $kondisi,
                    ]);

                    // Perbarui stok: tambah di gudang, kurangi di distribusi
                    StockHelpers::kembalikanStok($barang->model_id, $lokasiGudang->id, $kondisi);
                    StockHelpers::kurangiStokDistribusi($barang->model_id, $lokasiDistribusi->id, 1);

                    // Catat mutasi barang
                    MutasiBarang::create([
                        'barang_id' => $barang->id,
                        'lokasi_asal_id' => $lokasiDistribusi->id,
                        'lokasi_tujuan_id' => $lokasiGudang->id,
                        'tanggal' => $request->tanggal,
                        'keterangan' => "Barang kembali dari {$lokasiDistribusi->nama} (Kondisi: {$kondisi})",
                    ]);
                }
            }
        });

        return redirect()->route('barang-kembali.index')->with('success', 'Transaksi barang kembali berhasil dicatat.');
    }

    public function edit(BarangKembali $barangKembali)
    {
        // 1. Eager load semua relasi yang dibutuhkan
        $barangKembali->load('details.barang.modelBarang.kategori', 'details.barang.modelBarang.merek', 'lokasi');

        if ($barangKembali->details->isEmpty()) {
            return redirect()->route('barang-kembali.index')->with('error', 'Transaksi tidak memiliki detail.');
        }

        // 2. Kelompokkan detail berdasarkan model_id barangnya
        $groupedDetails = $barangKembali->details->groupBy('barang.model_id');

        // 3. Transformasi data ke struktur 'items' yang baru
        $items = $groupedDetails->map(function ($details) {
            $modelBarang = $details->first()->barang->modelBarang;
            $kembaliInfo = $details->map(function ($detail) {
                return [
                    'serial_number' => $detail->barang->serial_number,
                    'kondisi' => $detail->status_saat_kembali,
                ];
            });

            return [
                'kategori' => $modelBarang->kategori->nama,
                'merek' => $modelBarang->merek->nama,
                'model' => $modelBarang->nama,
                'kembali_info' => $kembaliInfo->values()->all(),
            ];
        });

        // 4. Siapkan data utama untuk form
        $dataToEdit = [
            'id' => $barangKembali->id,
            'tanggal' => $barangKembali->tanggal,
            'lokasi' => $barangKembali->lokasi->nama,
            'items' => $items->values()->all(),
        ];

        // 5. Ambil SEMUA LIST yang dibutuhkan oleh form (bagian yang sebelumnya terlewat)
        $lokasiDenganStok = RekapStokBarang::where('jumlah_tersedia', '>', 0)->pluck('lokasi_id')->unique();
        $lokasiList = Lokasi::where('is_gudang', false)->whereIn('id', $lokasiDenganStok)->get(['id', 'nama']);

        $kategoriList = KategoriBarang::all(['id', 'nama']);
        $merekList = MerekBarang::with('modelBarang.jenis')->get(); // Mengambil relasi untuk filter di frontend
        $modelList = ModelBarang::with('jenis')->get();

        // Ambil daftar serial number yang sedang keluar (untuk suggestion di form)
        $barangDiLuar = Barang::with('modelBarang.merek')
            ->whereHas('lokasi', function ($query) {
                $query->where('is_gudang', false);
            })
            ->get();

        $serialNumberList = $barangDiLuar->groupBy(function ($item) {
            $merek = $item->modelBarang->merek->nama ?? 'Tanpa Merek';
            $model = $item->modelBarang->nama ?? 'Tanpa Model';
            return $merek . '|' . $model;
        })->map(fn($group) => $group->pluck('serial_number')->filter()->values());

        // 6. Kirim semua data ke view
        return Inertia::render('transaksi/barang-kembali/BarangKembaliEdit', [
            'barangKembali' => $dataToEdit,
            'lokasiList' => $lokasiList,
            'serialNumberList' => $serialNumberList,
            'kategoriList' => $kategoriList,
            'merekList' => $merekList,
            'modelList' => $modelList,
        ]);
    }

    public function update(Request $request, BarangKembali $barangKembali)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100|exists:lokasi,nama',
            'items' => 'required|array|min:1',
            'items.*.kategori' => 'required|string',
            'items.*.merek' => 'required|string',
            'items.*.model' => 'required|string',
            'items.*.kembali_info' => 'required|array|min:1',
            'items.*.kembali_info.*.serial_number' => 'required|string|distinct|exists:barang,serial_number',
            'items.*.kembali_info.*.kondisi' => 'required|string|in:bagus,rusak,diperbaiki',
        ]);

        DB::transaction(function () use ($request, $barangKembali) {
            $lokasiDistribusi = Lokasi::where('nama', $request->lokasi)->firstOrFail();
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            // Update header transaksi
            $barangKembali->update([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasiDistribusi->id,
            ]);

            $oldDetails = $barangKembali->details()->with('barang')->get();
            $oldSerials = $oldDetails->pluck('barang.serial_number')->all();

            // Ekstrak data dari payload baru yang nested
            $newItemsCollection = collect($request->items)->pluck('kembali_info')->flatten(1);
            $newSerials = $newItemsCollection->pluck('serial_number')->all();
            $newKondisiMap = $newItemsCollection->pluck('kondisi', 'serial_number')->all();

            // 1. Barang yang DIBATALKAN KEMBALI (dihapus dari form edit)
            $serialsToUndo = array_diff($oldSerials, $newSerials);
            foreach ($serialsToUndo as $serial) {
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);
                if (!$detail) continue;

                $barang = $detail->barang;

                // Reverse stok gudang (kurangi stok di gudang)
                StockHelpers::kurangiStokKembali($barang->model_id, $lokasiGudang->id, $detail->status_saat_kembali);
                // Kembalikan ke stok distribusi (tambah stok di distribusi)
                StockHelpers::distribusiMasuk($barang->model_id, $lokasiDistribusi->id, 1);

                // Kembalikan status & lokasi barang ke kondisi 'dipinjamkan' di lokasi distribusi
                $barang->update(['lokasi_id' => $lokasiDistribusi->id, 'status' => 'dipinjamkan']);

                $detail->delete();
            }

            // 2. Barang BARU atau yang KONDISINYA BERUBAH
            foreach ($newSerials as $serial) {
                $kondisi = $newKondisiMap[$serial];
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);

                if ($detail) {
                    // Barang sudah ada, cek perubahan kondisi
                    if ($detail->status_saat_kembali !== $kondisi) {
                        $barang = $detail->barang;
                        // Reverse stok kondisi LAMA, lalu tambah stok kondisi BARU
                        StockHelpers::kurangiStokKembali($barang->model_id, $lokasiGudang->id, $detail->status_saat_kembali);
                        StockHelpers::kembalikanStok($barang->model_id, $lokasiGudang->id, $kondisi);

                        // Update detail dan status barang
                        $detail->update(['status_saat_kembali' => $kondisi]);
                        $barang->update(['status' => $kondisi]);
                    }
                } else {
                    // Barang baru ditambahkan ke transaksi kembali
                    $barang = Barang::where('serial_number', $serial)->firstOrFail();

                    // Proses seperti di fungsi store
                    $barang->update(['status' => $kondisi, 'kondisi_awal' => 'second', 'lokasi_id' => $lokasiGudang->id]);

                    BarangKembaliDetail::create([
                        'barang_kembali_id' => $barangKembali->id,
                        'barang_id' => $barang->id,
                        'status_saat_kembali' => $kondisi,
                    ]);

                    StockHelpers::kembalikanStok($barang->model_id, $lokasiGudang->id, $kondisi);
                    StockHelpers::kurangiStokDistribusi($barang->model_id, $lokasiDistribusi->id, 1);

                    MutasiBarang::create([
                        'barang_id' => $barang->id,
                        'lokasi_asal_id' => $lokasiDistribusi->id,
                        'lokasi_tujuan_id' => $lokasiGudang->id,
                        'tanggal' => $request->tanggal,
                        'keterangan' => "Barang kembali via update (Kondisi: {$kondisi})",
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
