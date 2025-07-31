<?php

namespace App\Http\Controllers\Lokasi;

use App\Http\Controllers\Controller;
use App\Models\Lokasi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class LokasiController extends Controller
{
    public function index(Request $request)
    {
        $lokasi = Lokasi::latest()->paginate(10);

        return Inertia::render('lokasi/index', [
            'lokasi' => $lokasi,
            'flash' => [
                'message' => session('message'),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255|unique:lokasi,nama',
            'alamat' => 'required|string|max:255',
        ]);

        Lokasi::create($request->only(['nama', 'alamat']));

        return Redirect::route('lokasi.index')->with('message', 'Lokasi berhasil ditambahkan.');
    }

    public function update(Request $request, Lokasi $lokasi)
    {

        $request->validate([
            'nama' => 'required|string|max:255|unique:lokasi,nama,' . $lokasi->id,
            'alamat' => 'nullable|string|max:255',
        ]);

        $lokasi->update($request->only(['nama', 'alamat']));

        return Redirect::route('lokasi.index')->with('message', 'Lokasi berhasil diperbarui.');
    }

    public function destroy(Lokasi $lokasi)
    {
        $lokasi->delete();

        return Redirect::back()->with('message', 'Lokasi berhasil dihapus.');
    }
}

