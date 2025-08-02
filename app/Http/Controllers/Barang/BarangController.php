<?php

    namespace App\Http\Controllers\Barang;

    use App\Http\Controllers\Controller;
    use App\Models\Barang;
    use App\Models\JenisBarang;
    use App\Models\KategoriBarang;
    use App\Models\RakBarang;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\DB;
    use Illuminate\Support\Facades\Request as FacadesRequest;
    use Inertia\Inertia;

    class BarangController extends Controller
    {
        // ✅ Tampilkan semua barang
    public function index()
        {
            $query = Barang::with(['jenisBarang.kategori', 'rak'])->latest();

            // 🔍 Pencarian (case-insensitive)
            if ($search = FacadesRequest::input('search')) {
                $search = strtolower($search);
                $query->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                    ->orWhereHas('jenisBarang', function ($q) use ($search) {
                        $q->whereRaw('LOWER(model) LIKE ?', ["%{$search}%"]);
                    });
            }

            // 🧲 Filter Kategori
            if ($kategori = FacadesRequest::input('kategori_id')) {
                $query->whereHas('jenisBarang', function ($q) use ($kategori) {
                    $q->where('kategori_id', $kategori);
                });
            }

            // 🧲 Filter Rak
            if ($rak = FacadesRequest::input('rak_id')) {
                $query->where('rak_id', $rak);
            }

            $barangList = $query->paginate(10)->withQueryString();

            return Inertia::render('barang/index', [
                'barangList' => $barangList->through(fn ($barang) => [
                    'id' => $barang->id,
                    'name' => $barang->name,
                    'serial_number' => $barang->serial_number,
                    'model' => $barang->jenisBarang->model ?? '-',
                    'merek' => $barang->jenisBarang->merek ?? '-',
                    'kategori' => $barang->jenisBarang->kategori->nama ?? '-',

                    // ✅ Properti tambahan untuk keperluan form edit
                    'jenis_barang_id' => $barang->jenis_barang_id,
                    'kategori_id' => $barang->jenisBarang->kategori_id ?? null,
                    'rak_id' => $barang->rak_id,
                    'kondisi_awal' => $barang->kondisi_awal,

                    'rak' => $barang->rak->nama_rak ?? '-', // tetap untuk tampilan di index
                ]),

                'filters' => FacadesRequest::only(['search', 'kategori_id', 'rak_id']),
                'kategoriOptions' => KategoriBarang::select('id', 'nama')->get(),
                'rakOptions' => RakBarang::select('id', 'nama_rak', 'baris', 'kode_rak')->get(),
            ]);
        }

    public function getJenis($id)
    {
        $jenisList = JenisBarang::where('kategori_id', $id)
            ->select('merek', 'model')
            ->distinct()
            ->get();

        return response()->json($jenisList);
    }

    // ✅ Form edit barang
    public function edit($id)
    {
        $barang = Barang::with(['jenisBarang.kategori'])->findOrFail($id);

        dd(RakBarang::select('id', 'nama_rak', 'baris', 'kode_rak')->get());


        return Inertia::render('barang/edit', [
                        'barang' => [
                            'id' => $barang->id,
                            'name' => $barang->name,
                            'serial_number' => $barang->serial_number,
                            'rak_id' => $barang->rak_id,
                            'kondisi_awal' => $barang->kondisi_awal,
                            'kategori_id' => $barang->jenisBarang->kategori_id,
                            'merek' => $barang->jenisBarang->merek,
                            'model' => $barang->jenisBarang->model,
                        ],
                        'kategoriList' => KategoriBarang::all(),
                        'rakList' => RakBarang::select('id', 'nama_rak', 'baris', 'kode_rak')
                            ->whereNotNull('baris')
                            ->get()
                            ->map(function ($rak) {
                                return [
                                    'id' => $rak->id,
                                    'nama_rak' => $rak->nama_rak,
                                    'baris' => $rak->baris,
                                    'kode_rak' => $rak->kode_rak,
                                ];
                            })
                            ->values(), // tambahkan ini agar jadi array numerik murni
                    ]);

    }

    // ✅ Update barang
    public function update(Request $request, $id)
    {
       $request->validate(array_filter([
                'kategori_id' => 'sometimes|exists:kategori_barang,id',
                'merek' => 'sometimes|string',
                'model' => 'sometimes|string',
                'name' => 'sometimes|string',
                'serial_number' => 'sometimes|string|unique:barang,serial_number,' . $id,
                'rak_id' => 'sometimes|exists:rak_barang,id',
                'kondisi_awal' => 'sometimes|string',
            ]));

        DB::transaction(function () use ($request, $id) {
            $barang = Barang::findOrFail($id);

            $jenis = JenisBarang::firstOrCreate([
                'kategori_id' => $request->kategori_id,
                'merek' => $request->merek,
                'model' => $request->model,
            ]);

            $barang->update([
                'jenis_barang_id' => $jenis->id,
                'name' => $request->name,
                'serial_number' => $request->serial_number,
                'rak_id' => $request->rak_id,
                'kondisi_awal' => $request->kondisi_awal,
            ]);
        });

        return redirect()->route('barang.index')->with('success', 'Barang berhasil diperbarui.');
    }

    public function show($id)
    {
        $barang = Barang::with([
            'jenisBarang.kategori',
            'rak.lokasi',
            'asal',
        ])->findOrFail($id);

        return Inertia::render('barang/show', [
            'barang' => [
                'id' => $barang->id,
                'name' => $barang->name,
                'serial_number' => $barang->serial_number,
                'status' => $barang->status,
                'kondisi_awal' => $barang->kondisi_awal,

                // Jenis Barang
                'merek' => $barang->jenisBarang->merek ?? '-',
                'model' => $barang->jenisBarang->model ?? '-',
                'kategori' => $barang->jenisBarang->kategori->nama ?? '-',

                // Rak
                'rak' => $barang->rak->nama_rak ?? '-',
                'baris' => $barang->rak->baris ?? '-',
                'kode_rak' => $barang->rak->kode_rak ?? '-',
                'lokasi' => $barang->rak->lokasi->nama ?? '-',

                // Asal
                'asal' => $barang->asal->nama ?? '-',
            ]
        ]);
    }

    public function showJson($id)
    {
        $barang = Barang::with([
            'jenisBarang.kategori',
            'rak.lokasi',
            'asal',
        ])->findOrFail($id);

        return response()->json([
            'id' => $barang->id,
            'name' => $barang->name,
            'serial_number' => $barang->serial_number,
            'status' => $barang->status,
            'kondisi_awal' => $barang->kondisi_awal,

            'merek' => $barang->jenisBarang->merek ?? '-',
            'model' => $barang->jenisBarang->model ?? '-',
            'kategori' => $barang->jenisBarang->kategori->nama ?? '-',

            'rak' => $barang->rak->nama_rak ?? '-',
            'baris' => $barang->rak->baris ?? '-',
            'kode_rak' => $barang->rak->kode_rak ?? '-',
            'lokasi' => $barang->rak->lokasi->nama ?? '-',

            'asal' => $barang->asal->nama ?? '-',
        ]);
    }


    // ✅ Hapus barang
    public function destroy($id)
    {
        $barang = Barang::findOrFail($id);
        $barang->delete();

        return redirect()->route('barang.index')->with('success', 'Barang berhasil dihapus.');
    }
}
