<?php

use App\Http\Controllers\AsalBarang\AsalBarangController;
use App\Http\Controllers\JenisBarang\JenisBarangController;
use App\Http\Controllers\Kategori\KategoriController;
use App\Http\Controllers\Lokasi\LokasiController;
use App\Http\Controllers\Stock\StockController;
use App\Http\Controllers\Transaksi\BarangKeluarController;
use App\Http\Controllers\Transaksi\BarangKembaliController;
use App\Http\Controllers\Transaksi\BarangMasukController;
use App\Models\Barang;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('kategori', KategoriController::class);
    Route::resource('lokasi', LokasiController::class);
    Route::resource('jenis-barang', JenisBarangController::class);
    Route::resource('asal-barang', AsalBarangController::class);

    Route::get('/transaksi', function () {
        return Inertia::render('transaksi/index');
    })->name('transaksi.index');

    Route::resource('barang-masuk', BarangMasukController::class);
    Route::get('/api/jenis-barang/{kategoriId}', [BarangMasukController::class, 'getJenisByKategori']);
    Route::post('/api/cek-serial', function (Request $request) {
    return Barang::whereIn('serial_number', $request->serial_numbers)->pluck('serial_number');
    });

    Route::resource('barang-keluar', BarangKeluarController::class);
    Route::resource('barang-kembali', BarangKembaliController::class);
    Route::get('/serial-by-lokasi/{lokasiId}', [BarangKembaliController::class, 'getSerialByLokasi']);

    Route::get('/stok', function () {
        return Inertia::render('stock/index');
    })->name('stok.index');

    Route::prefix('/stok')->controller(StockController::class)->group(function () {
        Route::get('/gudang', 'gudang');
        Route::get('/distribusi', 'distribusi');
        Route::get('/perbaikan', 'perbaikan');
        Route::get('/rusak', 'rusak');
        Route::get('/total', 'total');
    });

    Route::resource('stok', StockController::class);


});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
