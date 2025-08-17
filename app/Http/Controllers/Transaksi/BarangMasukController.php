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
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BarangMasukController extends Controller
{
    public function index(Request $request)
    {
        $query = BarangMasuk::with([
            'asal',
            'details.barang.modelBarang.kategori',
            'details.barang.modelBarang.merek'
        ]);

        // Filter tanggal
        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        // Filter kategori
        if ($request->filled('kategori_id')) {
            $query->whereHas('details.barang.modelBarang.kategori', function ($q) use ($request) {
                $q->where('id', $request->kategori_id);
            });
        }

        // Filter asal barang
        if ($request->filled('asal_barang_id')) {
            $query->where('asal_barang_id', $request->asal_barang_id);
        }

        // Filter merek
        if ($request->filled('merek')) {
            $query->whereHas('details.barang.modelBarang.merek', function ($q) use ($request) {
                $q->whereRaw('LOWER(nama) LIKE ?', ['%' . strtolower($request->merek) . '%']);
            });
        }

        // Pencarian umum
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->whereHas('details.barang', function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                ->orWhereHas('modelBarang', function ($q2) use ($search) {
                    $q2->whereRaw('LOWER(nama) LIKE ?', ["%{$search}%"])
                        ->orWhereHas('merek', function ($q3) use ($search) {
                            $q3->whereRaw('LOWER(nama) LIKE ?', ["%{$search}%"]);
                        });
                });
            });
        }

        // Sorting
        $sort = $request->input('sort_by', 'desc');
        if (!in_array($sort, ['asc', 'desc'])) {
            $sort = 'desc';
        }

        $barangMasuk = $query->orderBy('tanggal', $sort)
        ->paginate(15)
        ->withQueryString();

        return Inertia::render('transaksi/barang-masuk/barang-masuk-index', [
            'barangMasuk' => $barangMasuk->through(function ($bm) {
                // Ambil detail barang pertama dari relasi.
                // Asumsinya, satu baris 'barang masuk' di tabel ini mewakili satu jenis barang.
                $detail = $bm->details->first();

                return [
                    'id' => $bm->id,
                    'tanggal' => $bm->tanggal,
                    // Gunakan null-safe operator (?->) untuk menghindari error jika relasi kosong
                    'asal_barang' => $bm->asal?->nama,
                    'kategori' => $detail?->barang?->modelBarang?->kategori?->nama,
                    'merek' => $detail?->barang?->modelBarang?->merek?->nama,
                    'model' => $detail?->barang?->modelBarang?->nama,
                ];
            }),
            'filters' => $request->only('tanggal', 'kategori_id', 'asal_barang_id', 'merek', 'search', 'sort_by'),
            'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
            'asalOptions' => AsalBarang::select('id', 'nama')->get(),
            'merekOptions' => MerekBarang::select('id', 'nama')->get(),
            'modelOptions' => ModelBarang::select('id', 'nama')->get(),
            'jenisOptions' => JenisBarang::select('id', 'nama')->get(),
            'rakOptions' => RakBarang::select('id', 'nama_rak', 'kode_rak')->get(),
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

    public function edit(BarangMasuk $barangMasuk)
    {
        $barangMasuk->load('details.barang.modelBarang.kategori', 'details.barang.modelBarang.merek', 'details.barang.modelBarang.jenis', 'asal');

        $firstDetail = $barangMasuk->details->first();
        if (!$firstDetail) {
            return redirect()->route('barang-masuk.index')->with('error', 'Data detail barang tidak ditemukan.');
        }

        $modelBarang = $firstDetail->barang->modelbarang;

        $serialNumbers = $barangMasuk->details->pluck('barang.serial_number');

        return Inertia::render('transaksi/barang-masuk/barang-masuk-edit', [
            'barangMasuk' => [
                'id' => $barangMasuk->id,
                'tanggal' => $barangMasuk->tanggal,
                'kategori' => $modelBarang->kategori->nama,
                'merek' => $modelBarang->merek->nama,
                'jenis_barang' => $modelBarang->jenis->nama,
                'model' => $modelBarang->nama,
                'asal_barang' => $barangMasuk->asal?->nama,
                'serial_numbers' => $serialNumbers,
            ],
            'kategoriList' => KategoriBarang::all(),
            'asalList' => AsalBarang::all(),
            'merekList' => MerekBarang::all(),
            'modelList' => ModelBarang::all(),
            'jenisList' => JenisBarang::all(),
            'rakList' => RakBarang::all(),
        ]);
    }

    public function update(Request $request, BarangMasuk $barangMasuk)
    {
        $request->validate([
            'tanggal' => 'required|date',
            'kategori' => 'required|string|max:100',
            'merek' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'jenis_barang' => 'required|string|max:100',
            'asal_barang' => 'nullable|string|max:100',
            'serial_numbers' => 'required|array|min:1',
            'serial_numbers.*' => [
                'required',
                'string',
                'distinct',
                // Pastikan serial number unik, kecuali untuk barang yang sudah ada di transaksi ini
                Rule::unique('barang', 'serial_number')->where(function ($query) use ($barangMasuk) {
                    $barangIds = $barangMasuk->details->pluck('barang_id');
                    return $query->whereNotIn('id', $barangIds);
                }),
            ],
        ]);

        DB::transaction(function () use ($request, $barangMasuk) {
            $barangMasuk->load('details.barang.modelBarang');
            $oldBarangIds = $barangMasuk->details->pluck('barang_id');
            $oldModel = $barangMasuk->details->first()->barang->modelBarang;
            $lokasiGudang = Lokasi::where('is_gudang', true)->firstOrFail();

            $kategori = KategoriBarang::firstOrCreate(['nama' => $request->kategori]);
            $merek = MerekBarang::firstOrCreate(['nama' => $request->merek]);
            $jenis = JenisBarang::firstOrCreate(['kategori_id' => $kategori->id, 'nama' => $request->jenis_barang]);
            $model = ModelBarang::firstOrCreate(['kategori_id' => $kategori->id, 'merek_id' => $merek->id, 'jenis_id' => $jenis->id, 'nama' => $request->model]);
            $asal = $request->filled('asal_barang') ? AsalBarang::firstOrCreate(['nama' => $request->asal_barang]) : null;

            // Update data master BarangMasuk
            $barangMasuk->update([
                'tanggal' => $request->tanggal,
                'asal_barang_id' => $asal?->id,
            ]);

            $existingSerials = Barang::whereIn('id', $oldBarangIds)->pluck('serial_number', 'id')->all();
            $newSerials = $request->serial_numbers;

            // 1. Hapus barang & detail yang tidak ada lagi di request
            $serialsToDelete = array_diff($existingSerials, $newSerials);
            if (!empty($serialsToDelete)) {
                $barangIdsToDelete = array_keys($serialsToDelete);
                // Kurangi stok lama sebelum menghapus
                StockHelpers::barangKeluar($oldModel->id, $lokasiGudang->id, count($barangIdsToDelete));

                BarangMasukDetail::whereIn('barang_id', $barangIdsToDelete)->delete();
                MutasiBarang::whereIn('barang_id', $barangIdsToDelete)->delete();
                Barang::whereIn('id', $barangIdsToDelete)->delete();
            }

            // 2. Tambah barang & detail baru
            $serialsToAdd = array_diff($newSerials, $existingSerials);
            foreach ($serialsToAdd as $serial) {
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

                // Tambah stok baru
                StockHelpers::barangMasuk($model->id, $lokasiGudang->id, 1);
            }

            // 3. Update barang yang sudah ada (jika ada perubahan atribut selain serial number)
            // Cek apakah model barang berubah
            if ($oldModel->id !== $model->id) {
                $barangIdsToUpdate = array_keys(array_diff($existingSerials, $serialsToDelete));
                // Kurangi stok model lama
                StockHelpers::barangKeluar($oldModel->id, $lokasiGudang->id, count($barangIdsToUpdate));
                // Update barang ke model baru
                Barang::whereIn('id', $barangIdsToUpdate)->update([
                    'model_id' => $model->id,
                    'jenis_barang_id' => $jenis->id,
                    'asal_id' => $asal?->id,
                ]);
                // Tambah stok model baru
                StockHelpers::barangMasuk($model->id, $lokasiGudang->id, count($barangIdsToUpdate));
            }
        });

        return redirect()->route('barang-masuk.index')->with('success', 'Data barang masuk berhasil diperbarui.');
    }

    public function show(Request $request, BarangMasuk $barang_masuk)
    {
        $barang_masuk->load([
            'asal',
            'user',
            'details.barang.modelBarang.kategori',
            'details.barang.modelBarang.merek',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'barangMasuk' => $barang_masuk
            ]);
        }

        return Inertia::render('transaksi/barang-masuk/barang-masuk-detail', [
            'barangMasuk' => $barang_masuk
        ]);
    }

    public function destroy(BarangMasuk $barang_masuk)
    {
        DB::transaction(function () use ($barang_masuk) {
            foreach ($barang_masuk->details as $detail) {
                $barang = $detail->barang;

                if ($barang) {
                    MutasiBarang::where('barang_id', $barang->id)->delete();

                    // StockHelpers::barangDihapus($barang->model_id, $barang->lokasi_id, 1);

                    $barang->delete();
                }
            }

            // 4. Hapus detail barang masuk (biasanya terhapus otomatis jika ada cascade on delete)
            $barang_masuk->details()->delete();

            // 5. Hapus data utama barang masuk
            $barang_masuk->delete();
        });

        return redirect()->route('barang-masuk.index')
            ->with('success', 'Data barang masuk dan semua item terkait berhasil dihapus.');
    }

}
