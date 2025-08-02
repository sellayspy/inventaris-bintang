<?php

use App\Http\Controllers\Barang\BarangController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\MasterData\AsalBarangController;
use App\Http\Controllers\MasterData\JenisBarangController;
use App\Http\Controllers\MasterData\KategoriBarangController;
use App\Http\Controllers\MasterData\LokasiBarangController;
use App\Http\Controllers\MasterData\MerekBarangController;
use App\Http\Controllers\MasterData\ModelBarangController;
use App\Http\Controllers\MasterData\RakBarangController;
use App\Http\Controllers\Stock\Distribusi\StokDistribusiController;
use App\Http\Controllers\Stock\Gudang\StokGudangController;
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
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/fast-search', [DashboardController::class, 'fastSearchSuggestions']);
    Route::get('/dashboard/barang-detail/{id}', [DashboardController::class, 'getBarangDetail']);


    Route::resource('kategori', KategoriBarangController::class);
    Route::resource('merek', MerekBarangController::class);
    Route::resource('model', ModelBarangController::class);
    Route::resource('lokasi', LokasiBarangController::class);
    Route::resource('jenis-barang', JenisBarangController::class);
    Route::resource('asal-barang', AsalBarangController::class);
    Route::resource('rak-barang', RakBarangController::class);
    Route::resource('barang', BarangController::class);
    Route::get('/barang/search/autocomplete', [BarangController::class, 'autocomplete']);
    Route::get('/kategori/{id}/jenis', [BarangController::class, 'getJenis']);
    Route::get('/barang/{id}/json', [BarangController::class, 'showJson']);



    Route::get('/transaksi', function () {
        return Inertia::render('transaksi/index');
    })->name('transaksi.index');

    Route::resource('barang-masuk', BarangMasukController::class);
    Route::get('/ajax/model-barang', [BarangMasukController::class, 'getModelByKategoriMerek']);
    Route::get('/ajax/jenis-barang', [BarangMasukController::class, 'getJenisByKategori']);
    Route::post('/api/cek-serial', function (Request $request) {
    return Barang::whereIn('serial_number', $request->serial_numbers)->pluck('serial_number');
    });

    Route::resource('barang-keluar', BarangKeluarController::class);

    Route::resource('barang-kembali', BarangKembaliController::class);
    Route::get('/serial-by-lokasi/{lokasiId}', [BarangKembaliController::class, 'getSerialByLokasi']);
    Route::get('/api/kategori-by-lokasi/{lokasiId}', [BarangKembaliController::class, 'getKategoriByLokasi']);
    Route::get('/api/merek-by-kategori/{lokasiId}/{kategoriNama}', [BarangKembaliController::class, 'getMerekByKategoriDanLokasi']);
    Route::get('/api/model-by-merek/{lokasiId}/{merekNama}', [BarangKembaliController::class, 'getModelByMerekDanLokasi']);
    Route::get('/api/serial-by-model/{lokasiId}/{modelNama}', [BarangKembaliController::class, 'getSerialByModelDanLokasi']);

    Route::get('/stok', function () {
        return Inertia::render('stock/index');
    })->name('stok.index');

    Route::resource('stok', StockController::class);
    Route::get('/stok-gudang', [StokGudangController::class, 'index'])->name('stok.gudang.index');
    Route::get('/rusak', [StokGudangController::class, 'rusak'])->name('stok.gudang.rusak');
    Route::get('/perbaikan', [StokGudangController::class, 'perbaikan'])->name('stok.gudang.perbaikan');
    Route::get('/stok-distribusi', [StokDistribusiController::class, 'index'])->name('stok.distribusi.index');


    });

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
