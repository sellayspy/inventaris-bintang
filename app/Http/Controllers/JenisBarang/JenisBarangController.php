<?php

namespace App\Http\Controllers\JenisBarang;

use App\Http\Controllers\Controller;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class JenisBarangController extends Controller
{
    public function index()
    {
        return Inertia::render('jenis-barang/index', [
            'data' => JenisBarang::with('kategori')->latest()->get(),
            'kategoriList' => KategoriBarang::select('id', 'nama')->get(),
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori_barang,id',
            'merek' => 'required|string|max:255',
            'model' => 'required|string|max:255',
        ]);

        JenisBarang::create($request->only('kategori_id', 'merek', 'model'));
        return Redirect::route('jenis-barang.index')->with('message', 'Jenis Barang berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'kategori_id' => 'required|exists:kategori_barang,id',
            'merek' => 'required|string|max:255',
            'model' => 'required|string|max:255',
        ]);

        JenisBarang::findOrFail($id)->update($request->only('kategori_id', 'merek', 'model'));
        return Redirect::route('jenis-barang.index')->with('message', 'Jenis Barang berhasil diperbarui.');
    }

    public function destroy($id)
    {
        JenisBarang::findOrFail($id)->delete();
        return Redirect::back()->with('message', 'Jenis Barang berhasil dihapus.');
    }
}
