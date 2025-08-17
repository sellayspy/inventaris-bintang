<?php

namespace App\Http\Controllers\Stock\Gudang;

use App\Helpers\StockOpnameHelper;
use App\Http\Controllers\Controller;
use App\Models\Barang;
use App\Models\KategoriBarang;
use App\Models\Lokasi;
use App\Models\MerekBarang;
use App\Models\ModelBarang;
use App\Models\RekapStokBarang;
use App\Models\StockOpname;
use App\Models\StockOpnameDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockOpnameController extends Controller
{
    public function index()
    {
        $data = StockOpname::with('lokasi', 'user')->latest()->paginate(10);
        return inertia('stock/stock-opname/index', ['data' => $data]);
    }

    public function create()
    {
        $lokasi = Lokasi::all();
        $modelBarang = ModelBarang::with(['kategori:id,nama', 'merek:id,nama'])->get();

        $kategori = KategoriBarang::select('id', 'nama')->get();
        $merek = MerekBarang::select('id', 'nama')->get();
        $serialPerModel = ModelBarang::with('barang')
            ->get()
            ->mapWithKeys(fn($m) => [
                $m->id => $m->barang->pluck('serial_number')->toArray(),
            ]);

        return inertia('stock/stock-opname/create', [
            'lokasi' => $lokasi,
            'modelBarang' => $modelBarang,
            'kategori' => $kategori,
            'merek' => $merek,
            'serialPerModel' => $serialPerModel,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'required|date',
            'lokasi_id' => 'required|exists:lokasi,id',
            'catatan' => 'nullable|string',
            'details' => 'required|array',
            'details.*.model_id' => 'required|exists:model_barang,id',
            'details.*.serial_numbers' => 'required|array|min:1',
            'details.*.serial_numbers.*' => 'required|string|max:255',
            'details.*.catatan' => 'nullable|string',
        ]);

        $stockOpname = null;

        DB::transaction(function () use ($validated, &$stockOpname) {
            $stockOpname = StockOpname::create([
                'tanggal' => $validated['tanggal'],
                'lokasi_id' => $validated['lokasi_id'],
                'catatan' => $validated['catatan'] ?? null,
                'user_id' => auth()->id(),
            ]);

            foreach ($validated['details'] as $item) {
                $modelId = $item['model_id'];
                $serialFisik = array_map('trim', $item['serial_numbers']);

                $serialSistem = Barang::where('model_id', $modelId)
                    ->where('lokasi_id', $validated['lokasi_id'])
                    ->pluck('serial_number')
                    ->map(fn($sn) => trim($sn))
                    ->toArray();

                $hilang = array_values(array_diff($serialSistem, $serialFisik));
                $baruMuncul = array_values(array_diff($serialFisik, $serialSistem));

                StockOpnameDetail::create([
                    'stock_opname_id' => $stockOpname->id,
                    'model_id' => $modelId,
                    'jumlah_sistem' => count($serialSistem),
                    'jumlah_fisik' => count($serialFisik),
                    'selisih' => count($serialFisik) - count($serialSistem),
                    'catatan' => $item['catatan'] ?? null,
                    'serial_hilang' => json_encode($hilang),
                    'serial_baru' => json_encode($baruMuncul),
                ]);
            }
        });

        return redirect()->route('stock-opname.show', $stockOpname->id ?? null)
        ->with('success', 'Stock Opname berhasil disimpan. Periksa dan approve jika sudah sesuai.');

    }

    public function approve($id)
    {
        $stockOpname = StockOpname::with('details')->findOrFail($id);

        if ($stockOpname->approved_at) {
            return back()->with('error', 'Stock Opname sudah di-approve sebelumnya.');
        }

        DB::transaction(function () use ($stockOpname) {
            foreach ($stockOpname->details as $detail) {
                StockOpnameHelper::syncBarangDenganOpname($detail, $stockOpname->lokasi_id);
            }

            $stockOpname->update([
                'approved_by' => auth()->id(),
                'approved_at' => now(),
            ]);
        });

        return back()->with('success', 'Stock Opname berhasil di-approve.');
    }

    public function show($id)
    {
        $stockOpname = StockOpname::with([
            'user', 'lokasi',
            'details.modelBarang.kategori',
            'details.modelBarang.merek'
        ])->findOrFail($id);

        return inertia('stock/stock-opname/show', [
            'data' => $stockOpname,
        ]);
    }


}
