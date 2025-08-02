<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\AsalBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class AsalBarangController extends Controller
{
    public function index(Request $request)
    {
        $asalBarang = AsalBarang::latest()->paginate(10);

        return Inertia::render('master/asal-barang/index', [
            'asal' => $asalBarang,
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:asal_barang,nama',
        ]);

        AsalBarang::create($request->only('nama'));

        return Redirect::route('asal-barang.index')->with('message', 'Asal Barang berhasil ditambahkan.');
    }

    public function update(Request $request, AsalBarang $asalBarang)
    {

        $request->validate([
            'nama' => 'required|string|max:255|unique:asal_barang,nama,' . $asalBarang->id,
        ]);

        $asalBarang->update($request->only('nama'));

        return Redirect::route('asal-barang.index')->with('message', 'Asal Barang berhasil diperbarui.');
    }

    public function destroy(AsalBarang $asalBarang)
    {
        $asalBarang->delete();

        return Redirect::back()->with('message', 'Asal Barang berhasil dihapus.');
    }
}

