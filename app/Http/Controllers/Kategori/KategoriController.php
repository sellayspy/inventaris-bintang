<?php

namespace App\Http\Controllers\Kategori;

use App\Http\Controllers\Controller;
use App\Models\KategoriBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class KategoriController extends Controller
{
    public function index(Request $request)
    {
        $kategori = KategoriBarang::latest()->paginate(10);

        return Inertia::render('kategori/index', [
            'kategori' => $kategori,
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:kategori_barang,nama',
        ]);

        KategoriBarang::create($request->only('nama'));

        return Redirect::route('kategori.index')->with('message', 'Kategori Barang berhasil ditambahkan.');
    }

    public function update(Request $request, KategoriBarang $kategori)
    {

        $request->validate([
            'nama' => 'required|string|max:255|unique:kategori_barang,nama,' . $kategori->id,
        ]);

        $kategori->update($request->only('nama'));

        return Redirect::route('kategori.index')->with('message', 'Kategori Barang berhasil diperbarui.');
    }

    public function destroy(KategoriBarang $kategori)
    {
        $kategori->delete();

        return Redirect::back()->with('message', 'Kategori Barang berhasil dihapus.');
    }
}
