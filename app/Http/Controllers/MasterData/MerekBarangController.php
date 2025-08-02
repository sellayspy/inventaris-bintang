<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\MerekBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MerekBarangController extends Controller
{
    public function index(Request $request)
    {
        $merek = MerekBarang::latest()->paginate(10);

        return Inertia::render('master/merek/index', [
            'merek' => $merek,
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:merek_barang,nama',
        ]);

        MerekBarang::create($request->only('nama'));

        return Redirect::route('merek.index')->with('message', 'Merek Barang berhasil ditambahkan.');
    }

    public function update(Request $request, MerekBarang $merek)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:merek_barang,nama,' . $merek->id,
        ]);

        $merek->update($request->only('nama'));

        return Redirect::route('merek.index')->with('message', 'Merek Barang berhasil diperbarui.');
    }

    public function destroy(MerekBarang $merek)
    {
        $merek->delete();

        return Redirect::back()->with('message', 'Merek Barang berhasil dihapus.');
    }
}
