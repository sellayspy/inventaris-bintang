<?php

namespace App\Helpers;

use App\Models\RekapStokBarang;
use Illuminate\Support\Facades\DB;

class StockHelpers
{
    /**
     * Tambah stok baru ke sistem (barang masuk awal).
     */
    public static function barangMasuk(int $modelId, int $lokasiId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::firstOrCreate([
            'model_id' => $modelId,
            'lokasi_id' => $lokasiId,
        ]);

        $rekap->jumlah_total += $jumlah;
        $rekap->jumlah_tersedia += $jumlah;
        $rekap->save();
    }

    /**
     * Terima barang hasil distribusi (lokasi tujuan).
     * Tidak mengubah total karena hanya pindah lokasi.
     */
    public static function distribusiMasuk(int $modelId, int $lokasiTujuanId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::firstOrCreate([
            'model_id' => $modelId,
            'lokasi_id' => $lokasiTujuanId,
        ]);

        $rekap->jumlah_tersedia += $jumlah;
        $rekap->save();
    }

    /**
     * Mengurangi stok total dan tersedia, contoh untuk musnah, hilang, rusak parah, dll.
     */
    public static function musnahkanStok(int $modelId, int $lokasiId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::where('model_id', $modelId)
            ->where('lokasi_id', $lokasiId)
            ->first();

        if ($rekap) {
            $rekap->jumlah_total = max(0, $rekap->jumlah_total - $jumlah);
            $rekap->jumlah_tersedia = max(0, $rekap->jumlah_tersedia - $jumlah);
            $rekap->save();
        }
    }

    /**
     * Barang kembali ke gudang, dari lokasi distribusi (bagus, rusak, atau diperbaiki).
     */
    public static function kembalikanStok(int $modelId, int $lokasiId, string $kondisi = 'bagus'): void
    {
        $rekap = RekapStokBarang::firstOrCreate([
            'model_id' => $modelId,
            'lokasi_id' => $lokasiId,
        ]);

        switch ($kondisi) {
            case 'bagus':
                $rekap->jumlah_tersedia += 1;
                break;
            case 'rusak':
                $rekap->jumlah_rusak += 1;
                break;
            case 'diperbaiki':
                $rekap->jumlah_perbaikan += 1;
                break;
            default:
                $rekap->jumlah_tersedia += 1;
                break;
        }

        $rekap->save();
    }

    /**
     * Mengurangi jumlah tersedia saat barang didistribusikan.
     */
    public static function kurangiStokDistribusi(int $modelId, int $lokasiId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::where('model_id', $modelId)
            ->where('lokasi_id', $lokasiId)
            ->first();

        if ($rekap) {
            $rekap->jumlah_tersedia = max(0, $rekap->jumlah_tersedia - $jumlah);
            $rekap->save();
        }
    }

    /**
     * Proses distribusi: kurangi dari asal, tambah ke tujuan.
     */
    public static function pindahkanStok(int $modelId, int $lokasiAsalId, int $lokasiTujuanId, int $jumlah = 1): void
    {
        self::kurangiStokDistribusi($modelId, $lokasiAsalId, $jumlah);
        self::distribusiMasuk($modelId, $lokasiTujuanId, $jumlah);
    }
}
