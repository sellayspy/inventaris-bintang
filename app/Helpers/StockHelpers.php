<?php

namespace App\Helpers;

use App\Models\RekapStokBarang;
use Illuminate\Support\Facades\DB;

class StockHelpers
{
    /**
     * Tambah stok (biasanya saat barang masuk baru ke sistem)
     */
    public static function barangMasuk(int $jenisBarangId, int $lokasiId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::firstOrCreate([
            'jenis_barang_id' => $jenisBarangId,
            'lokasi_id' => $lokasiId,
        ]);

        $rekap->jumlah_total += $jumlah;
        $rekap->jumlah_tersedia += $jumlah;

        $rekap->save();
    }


    /**
     * Terima barang di lokasi tujuan (hasil distribusi)
     * TIDAK mengubah jumlah_total karena barang hanya pindah
     */
    public static function distribusiMasuk(int $jenisBarangId, int $lokasiTujuanId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::firstOrCreate([
            'jenis_barang_id' => $jenisBarangId,
            'lokasi_id' => $lokasiTujuanId,
        ]);

        $rekap->jumlah_tersedia += $jumlah;
        $rekap->save();
    }

    /**
     * Pemusnahan atau kehilangan barang (pengurangan permanen dari stok total)
     */
    public static function musnahkanStok(int $jenisBarangId, int $lokasiId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::where('jenis_barang_id', $jenisBarangId)
            ->where('lokasi_id', $lokasiId)
            ->first();

        if ($rekap) {
            $rekap->jumlah_total -= $jumlah;
            $rekap->jumlah_tersedia -= $jumlah;
            $rekap->save();
        }
    }

    /**
     * Barang kembali dari lokasi (dengan kondisi tertentu)
     */
    public static function kembalikanStok(int $jenisBarangId, int $lokasiId, string $kondisi = 'bagus'): void
    {
        $rekap = RekapStokBarang::firstOrCreate([
            'jenis_barang_id' => $jenisBarangId,
            'lokasi_id' => $lokasiId,
        ]);

        if ($kondisi === 'bagus') {
            $rekap->jumlah_tersedia += 1;
        } elseif ($kondisi === 'rusak') {
            $rekap->jumlah_rusak += 1;
        } elseif ($kondisi === 'diperbaiki') {
            $rekap->jumlah_perbaikan += 1;
        }

        $rekap->save();
    }


    public static function kurangiStokDistribusi(int $jenisBarangId, int $lokasiId, int $jumlah = 1): void
    {
        $rekap = RekapStokBarang::where('jenis_barang_id', $jenisBarangId)
            ->where('lokasi_id', $lokasiId)
            ->first();

        if ($rekap) {
            $rekap->jumlah_tersedia -= $jumlah;
            if ($rekap->jumlah_tersedia < 0) {
                $rekap->jumlah_tersedia = 0; // jaga-jaga
            }
            $rekap->save();
        }
    }

    /**
     * Proses distribusi antar dua lokasi: kurangi dari asal, tambah ke tujuan
     */
    public static function pindahkanStok(int $jenisBarangId, int $lokasiAsalId, int $lokasiTujuanId, int $jumlah = 1): void
    {
        // Kurangi stok dari lokasi asal
        $rekapAsal = RekapStokBarang::where('jenis_barang_id', $jenisBarangId)
            ->where('lokasi_id', $lokasiAsalId)
            ->first();

        if ($rekapAsal) {
            $rekapAsal->jumlah_tersedia -= $jumlah;
            $rekapAsal->save();
        }

        // Tambah stok ke lokasi tujuan
        self::distribusiMasuk($jenisBarangId, $lokasiTujuanId, $jumlah);
    }

}
