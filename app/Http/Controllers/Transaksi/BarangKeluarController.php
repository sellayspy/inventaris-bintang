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
            'kategori' => 'required|string|max:100',
            'merek' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'lokasi' => 'required|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|exists:barang,serial_number',
        ]);

        $barangKeluar = null;

        DB::transaction(function () use ($request, &$barangKeluar) {
            $kategori = KategoriBarang::firstOrCreate(['nama' => $request->kategori]);
            $merek = MerekBarang::firstOrCreate(['nama' => $request->merek]);
            $model = ModelBarang::firstOrCreate([
                'nama' => $request->model,
                'kategori_id' => $kategori->id,
                'merek_id' => $merek->id,
            ]);
            $jenis = JenisBarang::firstOrCreate(['kategori_id' => $kategori->id]);
            $lokasi = Lokasi::firstOrCreate(['nama' => $request->lokasi]);

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

                $barang->update([
                    'lokasi_id' => $lokasi->id,
                    'status' => $status,
                ]);

                BarangKeluarDetail::create([
                    'barang_keluar_id' => $barangKeluar->id,
                    'barang_id' => $barang->id,
                    'status_keluar' => $status,
                ]);

                if ($status === 'dijual') {
                    StockHelpers::catatPenjualan($barang->model_id, $lokasiGudang->id, 1);
                } elseif ($status === 'dipinjamkan') {
                    StockHelpers::pindahkanStok($barang->model_id, $lokasiGudang->id, $lokasi->id, 1);
                }

                MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => $lokasiGudang->id,
                    'lokasi_tujuan_id' => $lokasi->id,
                    'tanggal' => $request->tanggal,
                    'keterangan' => "Barang keluar dengan status: {$status}",
                ]);
            }
        });

        return redirect()
            ->back()
            ->with([
                'success' => 'Barang berhasil didistribusikan.',
                'barang_keluar_id' => $barangKeluar?->id,
            ]);
    }

    public function edit(BarangKeluar $barangKeluar)
    {
        $barangKeluar->load('details.barang.modelBarang.merek', 'details.barang.modelBarang.kategori', 'lokasi');

        if ($barangKeluar->details->isEmpty()) {
            return redirect()->route('barang-keluar.index')->with('error', 'Transaksi tidak memiliki detail barang.');
        }

        $firstDetail = $barangKeluar->details->first()->barang;
        $kategori = $firstDetail->modelBarang->kategori->nama;
        $merek = $firstDetail->modelBarang->merek->nama;
        $model = $firstDetail->modelBarang->nama;

        $dataToEdit = [
            'id' => $barangKeluar->id,
            'tanggal' => $barangKeluar->tanggal,
            'lokasi' => $barangKeluar->lokasi->nama,
            'kategori' => $kategori,
            'merek' => $merek,
            'model' => $model,
            'serial_numbers' => $barangKeluar->details->pluck('barang.serial_number')->all(),
            'status_keluar' => $barangKeluar->details->pluck('status_keluar', 'barang.serial_number')->all(),
        ];

        $modelIds = DB::table('rekap_stok_barang')
            ->join('lokasi', 'rekap_stok_barang.lokasi_id', '=', 'lokasi.id')
            ->where('rekap_stok_barang.jumlah_tersedia', '>', 0)
            ->where('lokasi.is_gudang', true)
            ->pluck('rekap_stok_barang.model_id');

        $gudangLokasiIds = Lokasi::where('is_gudang', true)->pluck('id');
        $availableBarang = Barang::with(['jenisBarang.kategori', 'modelBarang.merek'])
                ->whereIn('model_id', $modelIds)
                ->whereIn('lokasi_id', $gudangLokasiIds)
                ->whereIn('status', ['baik', 'bagus'])
                ->get();

        $serialNumberList = $availableBarang->groupBy(function ($item) {
                $merek = $item->modelBarang->merek->nama ?? '-';
                $model = $item->modelBarang->nama ?? '-';
                return $merek . '|' . $model;
            })
            ->map(fn($group) => $group->pluck('serial_number')->filter()->values());

        return Inertia::render('transaksi/barang-keluar/barang-keluar-edit', [
            'barangKeluar' => $dataToEdit,
            'lokasiList' => Lokasi::where('is_gudang', false)->get(),
            'kategoriList' => KategoriBarang::all(),
            'merekList' => MerekBarang::with(['modelBarang.jenis'])->get(),
            'modelList' => ModelBarang::with(['merek', 'jenis.kategori'])->get(),
            'serialNumberList' => $serialNumberList,
        ]);
    }


    public function update(Request $request, BarangKeluar $barangKeluar)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'lokasi' => 'required|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => 'required|string|distinct|exists:barang,serial_number',
        ]);

        DB::transaction(function () use ($request, $barangKeluar) {
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();
            $lokasiTujuan = Lokasi::firstOrCreate(['nama' => $request->lokasi, 'is_gudang' => false]);

            $barangKeluar->update([
                'tanggal' => $request->tanggal,
                'lokasi_id' => $lokasiTujuan->id,
            ]);

            $oldDetails = $barangKeluar->details()->with('barang')->get();
            $oldSerials = $oldDetails->pluck('barang.serial_number')->all();
            $newSerials = $request->serial_numbers;
            $statusMap = $request->input('status_keluar', []);

            $serialsToReturn = array_diff($oldSerials, $newSerials);
            foreach ($serialsToReturn as $serial) {
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);
                if (!$detail) continue;

                $barang = $detail->barang;
                $lokasiAsal = $barang->lokasi_id;

                if ($detail->status_keluar === 'dijual') {
                    StockHelpers::batalJual($barang->model_id, $lokasiGudang->id, 1);
                } elseif ($detail->status_keluar === 'dipinjamkan') {
                    StockHelpers::pindahkanStok($barang->model_id, $lokasiAsal, $lokasiGudang->id, 1);
                }

                $barang->update(['lokasi_id' => $lokasiGudang->id, 'status' => 'baik']);

                MutasiBarang::create([
                    'barang_id' => $barang->id,
                    'lokasi_asal_id' => $lokasiAsal,
                    'lokasi_tujuan_id' => $lokasiGudang->id,
                    'tanggal' => now(),
                    'keterangan' => 'Dikembalikan dari transaksi keluar #' . $barangKeluar->id,
                ]);

                $detail->delete();
            }

            foreach ($newSerials as $serial) {
                $status = $statusMap[$serial] ?? 'dipinjamkan';
                $detail = $oldDetails->firstWhere('barang.serial_number', $serial);

                if ($detail) {
                    // Barang ini sudah ada, cek apakah statusnya berubah
                    if ($detail->status_keluar !== $status) {
                        $barang = $detail->barang;
                        $lokasiAsal = $barang->lokasi_id;

                        // Balikkan stok lama sesuai status sebelumnya
                        if ($detail->status_keluar === 'dijual') {
                            StockHelpers::batalJual($barang->model_id, $lokasiGudang->id, 1);
                        } elseif ($detail->status_keluar === 'dipinjamkan') {
                            StockHelpers::pindahkanStok($barang->model_id, $lokasiAsal, $lokasiGudang->id, 1);
                        }

                        // Terapkan stok baru sesuai status baru
                        if ($status === 'dijual') {
                            StockHelpers::catatPenjualan($barang->model_id, $lokasiGudang->id, 1);
                        } elseif ($status === 'dipinjamkan') {
                            StockHelpers::pindahkanStok($barang->model_id, $lokasiGudang->id, $lokasiTujuan->id, 1);
                        }

                        // Update detail & barang
                        $detail->update(['status_keluar' => $status]);
                        $barang->update(['status' => $status, 'lokasi_id' => $lokasiTujuan->id]);

                        // Catat mutasi perubahan status
                        MutasiBarang::create([
                            'barang_id' => $barang->id,
                            'lokasi_asal_id' => $lokasiGudang->id,
                            'lokasi_tujuan_id' => $lokasiTujuan->id,
                            'tanggal' => $request->tanggal,
                            'keterangan' => "Perubahan status barang menjadi: {$status} (update transaksi)",
                        ]);
                    }
                } else {
                    // Ini barang BARU yang ditambahkan ke transaksi
                    $barang = Barang::where('serial_number', $serial)->firstOrFail();
                    $barang->update(['lokasi_id' => $lokasiTujuan->id, 'status' => $status]);

                    BarangKeluarDetail::create([
                        'barang_keluar_id' => $barangKeluar->id,
                        'barang_id' => $barang->id,
                        'status_keluar' => $status,
                    ]);

                    if ($status === 'dijual') {
                        StockHelpers::catatPenjualan($barang->model_id, $lokasiGudang->id, 1);
                    } elseif ($status === 'dipinjamkan') {
                        StockHelpers::pindahkanStok($barang->model_id, $lokasiGudang->id, $lokasiTujuan->id, 1);
                    }

                    MutasiBarang::create([
                         'barang_id' => $barang->id,
                         'lokasi_asal_id' => $lokasiGudang->id,
                         'lokasi_tujuan_id' => $lokasiTujuan->id,
                         'tanggal' => $request->tanggal,
                         'keterangan' => "Barang keluar dengan status: {$status} (diedit)",
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
