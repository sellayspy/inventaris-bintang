<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Lokasi;
use App\Models\RakBarang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RakBarangController extends Controller
{
    public function index()
    {
        $rakList = RakBarang::with('lokasi')->latest()->get();
        $lokasiList = Lokasi::where('is_gudang', true)->get();
        return Inertia::render('master/rak-barang/index', [
            'rakList' => $rakList,
            'lokasiList' => $lokasiList,
             'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function create()
    {
        $lokasiList = Lokasi::where('is_gudang', true)->get();
        return Inertia::render('gudang/rak-barang/Create', [
            'lokasiList' => $lokasiList,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'lokasi_id' => 'required|exists:lokasi,id',
            'nama_rak' => 'required|string',
            'baris' => 'nullable|string',
            'kode_rak' => 'required|string|unique:rak_barang,kode_rak',
        ]);

        RakBarang::create($request->all());

        return redirect()->route('rak-barang.index')->with('success', 'Rak berhasil ditambahkan.');
    }

    public function edit($id)
    {
        $rak = RakBarang::findOrFail($id);
        $lokasiList = Lokasi::where('is_gudang', true)->get();

        return Inertia::render('gudang/rak-barang/Edit', [
            'rak' => $rak,
            'lokasiList' => $lokasiList,
        ]);
    }

    public function update(Request $request, $id)
    {
        $rak = RakBarang::findOrFail($id);

        $request->validate([
            'lokasi_id' => 'required|exists:lokasi,id',
            'nama_rak' => 'required|string',
            'baris' => 'nullable|string',
            'kode_rak' => 'required|string|unique:rak_barang,kode_rak,' . $rak->id,
        ]);

        $rak->update($request->all());

        return redirect()->route('rak-barang.index')->with('success', 'Rak berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $rak = RakBarang::findOrFail($id);
        $rak->delete();

        return redirect()->route('rak-barang.index')->with('success', 'Rak berhasil dihapus.');
    }
}
