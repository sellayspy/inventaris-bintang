<?php

namespace App\Http\Controllers\MasterData;

use App\Http\Controllers\Controller;
use App\Models\JenisBarang;
use App\Models\KategoriBarang;
use App\Models\MerekBarang;
use App\Models\ModelBarang;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ModelBarangController extends Controller
{
    public function index(Request $request)
    {
        $model = ModelBarang::with(['kategori', 'merek', 'jenis'])->latest()->paginate(10);
        $kategori = KategoriBarang::all();
        $merek = MerekBarang::all();
        $jenis = JenisBarang::all();

        return Inertia::render('master/model/index', [
            'modelBarang' => $model,
            'kategori' => $kategori,
            'merek' => $merek,
            'jenis' => $jenis,
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:model_barang,nama',
            'kategori_id' => 'required|exists:kategori_barang,id',
            'merek_id' => 'required|exists:merek_barang,id',
            'jenis_id' => 'nullable|exists:jenis_barang,id',
            'deskripsi' => 'nullable|string|max:500',
        ]);

        ModelBarang::create($request->only('nama', 'kategori_id', 'merek_id', 'jenis_id', 'deskripsi'));

        return Redirect::route('model.index')->with('message', 'Model Barang berhasil ditambahkan.');
    }

    public function update(Request $request, ModelBarang $model)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:model_barang,nama,' . $model->id,
            'kategori_id' => 'required|exists:kategori_barang,id',
            'merek_id' => 'required|exists:merek_barang,id',
            'jenis_id' => 'nullable|exists:jenis_barang,id',
            'deskripsi' => 'nullable|string|max:500',
        ]);

        $model->update($request->only('nama', 'kategori_id', 'merek_id', 'jenis_id', 'deskripsi'));

        return Redirect::route('model.index')->with('message', 'Model Barang berhasil diperbarui.');
    }

    public function destroy(ModelBarang $model)
    {
        $model->delete();

        return Redirect::back()->with('message', 'Model Barang berhasil dihapus.');
    }
}
