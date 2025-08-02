<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class JenisBarangController extends Controller
{
    public function index(Request $request)
    {
        $jenis = JenisBarang::with('kategori')->latest()->paginate(10);
        $kategori = KategoriBarang::select('id', 'nama')->get();

        return Inertia::render('master/jenis-barang/index', [
            'jenisBarang' => $jenis,
            'kategoriBarang' => $kategori,
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:jenis_barang,nama',
            'kategori_id' => 'required|exists:kategori_barang,id',
        ]);

        JenisBarang::create($request->only('nama', 'kategori_id'));

        return Redirect::route('jenis-barang.index')->with('message', 'Jenis Barang berhasil ditambahkan.');
    }

    public function update(Request $request, JenisBarang $jenisBarang)
    {
        $request->validate([
            'nama' => [
                'required',
                'string',
                'max:255',
                Rule::unique('jenis_barang', 'nama')->ignore($jenisBarang->id),
            ],
            'kategori_id' => 'required|exists:kategori_barang,id',
        ]);

        $jenisBarang->update($request->only('nama', 'kategori_id'));

        return redirect()->route('jenis-barang.index')->with('message', 'Jenis Barang berhasil diperbarui.');
    }

    public function destroy(JenisBarang $jenisBarang)
    {
        $jenisBarang->delete();

        return Redirect::back()->with('message', 'Jenis Barang berhasil dihapus.');
    }
}
