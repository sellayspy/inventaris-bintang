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
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class BarangKeluarController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangKeluar::query()
            ->with([
                'lokasi',
                'details.barang.modelBarang' => function ($query) {
                    $query->with(['merek', 'kategori']);
                }
            ])

            ->when($request->tanggal, fn($q) => $q->whereDate('tanggal', $request->tanggal))

            ->when($request->lokasi_id, fn($q) => $q->where('lokasi_id', $request->lokasi_id))

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

        return Inertia::render('transaksi/barang-keluar/BarangKeluarIndex', [
            'barangKeluar' => $query,
            'filters' => $request->only(['tanggal', 'kategori_id', 'lokasi_id', 'search']),
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
        $modelIds = DB::table('rekap_stok_barang')
            ->join('lokasi', 'rekap_stok_barang.lokasi_id', '=', 'lokasi.id')
            ->where('rekap_stok_barang.jumlah_tersedia', '>', 0)
            ->where('lokasi.is_gudang', true)
            ->pluck('rekap_stok_barang.model_id');

        $gudangLokasiIds = DB::table('lokasi')
            ->where('is_gudang', true)
            ->pluck('id');

        $barang = Barang::with(['jenisBarang.kategori', 'modelBarang.merek'])
            ->whereIn('model_id', $modelIds)
            ->whereIn('lokasi_id', $gudangLokasiIds)
            ->whereIn('status', ['baik', 'bagus'])
            ->get();

        $serialNumberList = $barang->filter(fn($item) => $item->modelBarang && $item->modelBarang->merek)
            ->groupBy(function ($item) {
                $merek = $item->modelBarang->merek->nama ?? '-';
                $model = $item->modelBarang->nama ?? '-';
                return $merek . '|' . $model;
            })
            ->map(fn($group) => $group->pluck('serial_number')->filter()->values());

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
            'lokasi' => 'required|string|max:100',
            'items' => 'required|array|min:1',
            // Validasi opsional untuk master data di setiap item
            'items.*.kategori' => 'required|string',
            'items.*.merek' => 'required|string',
            'items.*.model' => 'required|string',
            // Validasi untuk detail serial number
            'items.*.keluar_info' => 'required|array|min:1',
            'items.*.keluar_info.*.serial_number' => [
                'required',
                'string',
                'distinct',
                Rule::exists('barang', 'serial_number')->where(function ($query) {
                    $gudangId = Lokasi::where('is_gudang', true)->value('id');
                    $query->whereIn('status', ['baik', 'bagus'])->where('lokasi_id', $gudangId);
                }),
            ],
            'items.*.keluar_info.*.status_keluar' => 'required|string|in:dipinjamkan,dijual,maintenance',
        ]);

        $barangKeluar = null;

        DB::transaction(function () use ($request, &$barangKeluar) {
            $lokasiTujuan = Lokasi::firstOrCreate(
                ['nama' => $request->lokasi],
                ['is_gudang' => false]
            );

            // 2. Buat satu header transaksi BarangKeluar
            $barangKeluar = BarangKeluar::create([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasiTujuan->id,
                'user_id' => auth()->id(),
            ]);

            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            // 3. Looping untuk setiap JENIS BARANG (item)
            foreach ($request->items as $item) {

                // 4. Looping untuk setiap SERIAL NUMBER di dalam jenis barang tsb
                foreach ($item['keluar_info'] as $info) {
                    $serial = $info['serial_number'];
                    $status = $info['status_keluar'];

                    $barang = Barang::where('serial_number', $serial)->firstOrFail();
                    $lokasiAsalId = $barang->lokasi_id;

                    // Update lokasi dan status barang
                    $barang->update([
                        'lokasi_id' => $lokasiTujuan->id,
                        'status' => $status,
                    ]);

                    // Buat detail transaksi
                    BarangKeluarDetail::create([
                        'barang_keluar_id' => $barangKeluar->id,
                        'barang_id' => $barang->id,
                        'status_keluar' => $status,
                    ]);

                    // Update stok berdasarkan status
                    if ($status === 'dijual') {
                        StockHelpers::catatPenjualan($barang->model_id, $lokasiAsalId, 1);
                    } elseif ($status === 'dipinjamkan') {
                        StockHelpers::pindahkanStok($barang->model_id, $lokasiAsalId, $lokasiTujuan->id, 1);
                    }

                    // Catat mutasi barang
                    MutasiBarang::create([
                        'barang_id' => $barang->id,
                        'lokasi_asal_id' => $lokasiAsalId,
                        'lokasi_tujuan_id' => $lokasiTujuan->id,
                        'tanggal' => $request->tanggal,
                        'keterangan' => "Barang keluar ke {$lokasiTujuan->nama} (Status: {$status})",
                    ]);
                }
            }
        });

        return redirect()
            ->route('barang-keluar.index')
            ->with('success', 'Transaksi barang keluar berhasil dicatat.');
    }

    public function edit(BarangKeluar $barangKeluar)
    {
        // 1. Eager load semua relasi yang dibutuhkan
        $barangKeluar->load('details.barang.modelBarang.kategori', 'details.barang.modelBarang.merek', 'lokasi');

        if ($barangKeluar->details->isEmpty()) {
            return redirect()->route('barang-keluar.index')->with('error', 'Transaksi tidak memiliki detail barang.');
        }

        // 2. Kelompokkan detail berdasarkan model_id barangnya
        $groupedDetails = $barangKeluar->details->groupBy('barang.model_id');

        // 3. Transformasi data ke struktur 'items' yang baru
        $items = $groupedDetails->map(function ($details) {
            // Ambil data master dari item pertama di grup (semua sama)
            $firstDetail = $details->first();
            $modelBarang = $firstDetail->barang->modelBarang;

            // Buat array 'keluar_info' untuk setiap serial number di grup ini
            $keluarInfo = $details->map(function ($detail) {
                return [
                    'serial_number' => $detail->barang->serial_number,
                    'status_keluar' => $detail->status_keluar,
                ];
            });

            return [
                'kategori' => $modelBarang->kategori->nama,
                'merek' => $modelBarang->merek->nama,
                'model' => $modelBarang->nama,
                'keluar_info' => $keluarInfo->values()->all(),
            ];
        });

        // 4. Siapkan data final untuk dikirim ke view
        $dataToEdit = [
            'id' => $barangKeluar->id,
            'tanggal' => $barangKeluar->tanggal,
            'lokasi' => $barangKeluar->lokasi->nama,
            'items' => $items->values()->all(), // Kirim data dalam format baru
        ];

        // Logika untuk mendapatkan daftar SN yang tersedia (bisa tetap sama)
        $gudangLokasiIds = Lokasi::where('is_gudang', true)->pluck('id');
        $availableBarang = Barang::with(['modelBarang.merek', 'modelBarang.kategori'])
            ->whereIn('lokasi_id', $gudangLokasiIds)
            ->whereIn('status', ['baik', 'bagus'])
            ->get();

        $serialNumberList = $availableBarang->groupBy(function ($item) {
            $merek = $item->modelBarang->merek->nama ?? 'Tanpa Merek';
            $model = $item->modelBarang->nama ?? 'Tanpa Model';
            return $merek . '|' . $model;
        })->map(fn($group) => $group->pluck('serial_number')->filter()->values());

        return Inertia::render('transaksi/barang-keluar/barang-keluar-edit', [
            'barangKeluar' => $dataToEdit,
            'lokasiList' => Lokasi::where('is_gudang', false)->get(['id', 'nama']),
            'serialNumberList' => $serialNumberList,
            'kategoriList' => KategoriBarang::all(),
            'merekList' => MerekBarang::with(['modelBarang.jenis'])->get(),
            'modelList' => ModelBarang::with(['merek', 'jenis.kategori'])->get(),
        ]);
    }

    public function update(Request $request, BarangKeluar $barangKeluar)
    {
        // 1. Validasi LENGKAP untuk struktur data yang baru
        $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100',
            'items' => 'required|array|min:1',
            'items.*.kategori' => 'required|string', // Validasi yang terlewat
            'items.*.merek' => 'required|string',    // Validasi yang terlewat
            'items.*.model' => 'required|string',    // Validasi yang terlewat
            'items.*.keluar_info' => 'required|array|min:1',
            'items.*.keluar_info.*.serial_number' => 'required|string|distinct|exists:barang,serial_number',
            'items.*.keluar_info.*.status_keluar' => 'required|string|in:dipinjamkan,dijual,maintenance',
        ]);

        DB::transaction(function () use ($request, $barangKeluar) {
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();
            $lokasiTujuan = Lokasi::firstOrCreate(['nama' => $request->lokasi], ['is_gudang' => false]);

            $barangKeluar->update([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasiTujuan->id,
            ]);

            $oldDetails = $barangKeluar->details()->with('barang')->get();
            $oldSerials = $oldDetails->pluck('barang.serial_number')->all();

            $newItemsCollection = collect($request->items)->pluck('keluar_info')->flatten(1);
            $newSerials = $newItemsCollection->pluck('serial_number')->all();
            $newStatusMap = $newItemsCollection->pluck('status_keluar', 'serial_number')->all();

            // BAGIAN 1: Mengembalikan barang yang dihapus dari transaksi
            $serialsToReturn = array_diff($oldSerials, $newSerials);
            foreach ($serialsToReturn as $serial) {
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);
                if (!$detail) continue;

                $barang = $detail->barang;
                $lokasiAsalBarangSaatKeluar = $barang->lokasi_id;

                // Balikkan stok ke gudang
                if ($detail->status_keluar === 'dijual') {
                    StockHelpers::batalJual($barang->model_id, $lokasiGudang->id, 1);
                } elseif ($detail->status_keluar === 'dipinjamkan') {
                    StockHelpers::pindahkanStok($barang->model_id, $lokasiAsalBarangSaatKeluar, $lokasiGudang->id, 1);
                }

                $barang->update(['lokasi_id' => $lokasiGudang->id, 'status' => 'baik']);
                $detail->delete();
            }

            // BAGIAN 2: Memproses barang baru atau yang statusnya berubah
            foreach ($newSerials as $serial) {
                $status = $newStatusMap[$serial];
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);

                if ($detail) {
                    // BARANG SUDAH ADA, cek apakah statusnya berubah
                    if ($detail->status_keluar !== $status) {
                        $barang = $detail->barang;
                        $lokasiAsalBarangSaatKeluar = $barang->lokasi_id;

                        // Langkah A: Balikkan stok lama sesuai status SEBELUMNYA
                        if ($detail->status_keluar === 'dijual') {
                            StockHelpers::batalJual($barang->model_id, $lokasiGudang->id, 1);
                        } elseif ($detail->status_keluar === 'dipinjamkan') {
                            // Kembalikan dulu stoknya ke gudang
                            StockHelpers::pindahkanStok($barang->model_id, $lokasiAsalBarangSaatKeluar, $lokasiGudang->id, 1);
                        }

                        // Langkah B: Terapkan stok baru sesuai status BARU
                        if ($status === 'dijual') {
                            StockHelpers::catatPenjualan($barang->model_id, $lokasiGudang->id, 1);
                        } elseif ($status === 'dipinjamkan') {
                            // Pindahkan stok dari gudang ke tujuan
                            StockHelpers::pindahkanStok($barang->model_id, $lokasiGudang->id, $lokasiTujuan->id, 1);
                        }

                        // Langkah C: Update record
                        $detail->update(['status_keluar' => $status]);
                        $barang->update(['status' => $status, 'lokasi_id' => $lokasiTujuan->id]);
                    }
                } else {
                    // INI BARANG BARU yang ditambahkan ke transaksi
                    $barang = Barang::where('serial_number', $serial)->firstOrFail();
                    $lokasiAsalId = $barang->lokasi_id; // Ini adalah lokasi gudang

                    $barang->update(['lokasi_id' => $lokasiTujuan->id, 'status' => $status]);

                    BarangKeluarDetail::create([
                        'barang_keluar_id' => $barangKeluar->id,
                        'barang_id' => $barang->id,
                        'status_keluar' => $status,
                    ]);

                    // Terapkan pergerakan stok
                    if ($status === 'dijual') {
                        StockHelpers::catatPenjualan($barang->model_id, $lokasiAsalId, 1);
                    } elseif ($status === 'dipinjamkan') {
                        StockHelpers::pindahkanStok($barang->model_id, $lokasiAsalId, $lokasiTujuan->id, 1);
                    }

                    MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => $lokasiAsalId,
                    'lokasi_tujuan_id' => $lokasiTujuan->id,
                    'tanggal' => $request->tanggal,
                    'keterangan' => "Barang keluar via update (Status: {$status})",
                    ]);
                }
            }
        });

        return redirect()->route('barang-keluar.index')->with('success', 'Transaksi barang keluar berhasil diperbarui.');
    }

    public function show($id)
    {
        $barangKeluar = BarangKeluar::with([
            'lokasi',
            'user',
            'details.barang.modelBarang' => function ($query) {
                $query->with(['merek', 'kategori']);
            },
            'details.barang.jenisBarang.kategori'
        ])->findOrFail($id);

        return Inertia::render('transaksi/barang-keluar/BarangKeluarDetail', [
            'barangKeluar' => $barangKeluar,
        ]);
    }

    public function cetakLabel($id)
    {
        $barangKeluar = BarangKeluar::with([
            'lokasi',
            'details.barang.modelBarang.merek',
            'details.barang.modelBarang.kategori',
        ])->findOrFail($id);

        // Pastikan ada detail barang keluar
        if ($barangKeluar->details->isEmpty()) {
            abort(404, 'Transaksi ini tidak memiliki detail barang untuk dicetak.');
        }

        $labelData = $barangKeluar->details->map(function ($item) use ($barangKeluar) {
            $barang = $item->barang;
            $model = $barang->modelBarang;
            $merek = optional($model->merek)->nama ?? '-';
            $kategori = optional($model->kategori)->nama ?? '-';
            $modelName = $model->nama ?? '-';
            $sn = "SN: " . ($barang->serial_number ?? '-');

            // Uppercase semua bagian kecuali SN dan Tanggal
            $barangInfo = mb_strtoupper("$kategori : $merek $modelName", 'UTF-8');
            $lokasi = mb_strtoupper($barangKeluar->lokasi->nama ?? '-', 'UTF-8');

            // Format tanggal: hari dan tahun biasa, bulan uppercase
            $tanggalCarbon = \Carbon\Carbon::parse($barangKeluar->tanggal);
            $tanggal = $tanggalCarbon->format('d') . ' ' .
                    mb_strtoupper($tanggalCarbon->translatedFormat('F'), 'UTF-8') . ' ' .
                    $tanggalCarbon->format('Y');

            return [
                'header' => 'MILIK CV BINTANG TEKNOLOGI',
                'barang_info' => $barangInfo,
                'sn' => $sn,
                'dipinjamkan_kepada' => 'DIPINJAMKAN KEPADA',
                'lokasi' => $lokasi,
                'tanggal' => $tanggal,
                'peringatan' => '*DILARANG MEMBUKA ATAU MEREPARASI TANPA SEIZIN DARI PEMILIK*',
            ];
        });

        return Inertia::render('transaksi/barang-keluar/cetak-label', [
            'labelData' => $labelData,
        ]);
    }

    public function cetakLabelItem($id, $detailId)
    {
        $barangKeluar = BarangKeluar::with([
            'lokasi',
            'details.barang.modelBarang.merek',
            'details.barang.modelBarang.kategori',
        ])->findOrFail($id);

        $detail = $barangKeluar->details->firstWhere('id', $detailId);
        if (!$detail) {
            abort(404, 'Detail barang tidak ditemukan.');
        }

        $barang = $detail->barang;
        $model = $barang->modelBarang;
        $merek = optional($model->merek)->nama ?? '-';
        $kategori = optional($model->kategori)->nama ?? '-';
        $modelName = $model->nama ?? '-';
        $sn = "SN: " . ($barang->serial_number ?? '-');

        $barangInfo = mb_strtoupper("$kategori : $merek $modelName", 'UTF-8');
        $lokasi = mb_strtoupper($barangKeluar->lokasi->nama ?? '-', 'UTF-8');
        $tanggalCarbon = \Carbon\Carbon::parse($barangKeluar->tanggal);
        $tanggal = $tanggalCarbon->format('d') . ' ' .
                mb_strtoupper($tanggalCarbon->translatedFormat('F'), 'UTF-8') . ' ' .
                $tanggalCarbon->format('Y');

        $labelData = [[
            'header' => 'MILIK CV BINTANG TEKNOLOGI',
            'barang_info' => $barangInfo,
            'sn' => $sn,
            'dipinjamkan_kepada' => 'DIPINJAMKAN KEPADA',
            'lokasi' => $lokasi,
            'tanggal' => $tanggal,
            'peringatan' => '*DILARANG MEMBUKA ATAU MEREPARASI TANPA SEIZIN DARI PEMILIK*',
        ]];

        return Inertia::render('transaksi/barang-keluar/cetak-label', [
            'labelData' => $labelData,
        ]);
    }

    public function cetakSurat($id)
    {
        $barangKeluar = BarangKeluar::with([
            'lokasi',
            'details.barang.modelBarang.merek',
            'details.barang.modelBarang.kategori',
        ])->findOrFail($id);

        $details = $barangKeluar->details;

        // Group berdasarkan merek
        $groupedByMerek = $details->groupBy(function ($detail) {
            return $detail->barang->modelBarang->merek->nama ?? '-';
        });

        $barangList = $groupedByMerek->map(function (Collection $group, $merek) {
            // Group berdasarkan model (nama model)
            $models = $group->groupBy(function ($item) {
                return $item->barang->modelBarang->nama;
            });

            // Gabungkan nama model
            $modelLabels = $models->map(function ($items) {
                return strtoupper($items->first()->barang->modelBarang->nama);
            })->values()->implode(', ');

            // Gabungkan label jika ada lebih dari satu
            $labelSet = $models->map(function ($items) {
                return strtoupper($items->first()->barang->modelBarang->label);
            })->unique()->values()->implode(', ');

            // Gabungkan semua serial number
            $serialNumbers = $group->pluck('barang.serial_number')->implode(', ');

            return [
                'nama' => $labelSet,
                'merek_type' => strtoupper("{$merek} {$modelLabels} (" . $group->count() . " UNIT)"),
                'serial_number' => $serialNumbers,
                'kelengkapan' => 'ADAPTOR, SOFTWARE, DRIVER, TUTORIAL PRINTER',
            ];
        })->values();

        // Format tanggal surat
        $tanggal = Carbon::parse($barangKeluar->tanggal);
        $bulan = $tanggal->format('m');
        $tahun = $tanggal->format('Y');
        $bulanRomawi = $this->convertToRoman($bulan);

        // Hitung jumlah surat di bulan-tahun yang sama
        $jumlahSuratBulanIni = BarangKeluar::whereMonth('tanggal', $bulan)
            ->whereYear('tanggal', $tahun)
            ->where('tanggal', '<=', $tanggal)
            ->count();

        // Buat nomor urut 3 digit
        $nomorUrut = str_pad($jumlahSuratBulanIni, 3, '0', STR_PAD_LEFT);

        // Format nomor surat
        $nomorSurat = "{$nomorUrut}/SKKP/BINTEK/{$bulanRomawi}/{$tahun}";

        // Susun data untuk dikirim ke Inertia
        $data = [
            'nomor' => $nomorSurat,
            'tanggal_pinjam' => $barangKeluar->tanggal,
            'peminjam' => [
                'nama_lokasi' => strtoupper($barangKeluar->lokasi->nama),
                'alamat_lokasi' => strtoupper($barangKeluar->lokasi->alamat),
                'penempatan' => strtoupper($barangKeluar->lokasi->nama),
            ],
            'barang' => $barangList,
        ];

        return Inertia::render('transaksi/barang-keluar/surat-pinjaman', [
            'data' => $data,
        ]);
    }

    private function convertToRoman($month)
    {
        $romans = [
            '01' => 'I', '02' => 'II', '03' => 'III', '04' => 'IV',
            '05' => 'V', '06' => 'VI', '07' => 'VII', '08' => 'VIII',
            '09' => 'IX', '10' => 'X', '11' => 'XI', '12' => 'XII',
        ];

        return $romans[$month] ?? '';
    }

}
