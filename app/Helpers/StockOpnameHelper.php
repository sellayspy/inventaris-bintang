<?php

namespace App\Helpers;

use App\Models\Barang;
use App\Models\RekapStokBarang;
use App\Models\StockOpnameDetail;

class StockOpnameHelper
{
    public static function syncBarangDenganOpname(StockOpnameDetail $detail, int $lokasiId): void
    {
        $modelId = $detail->model_id;

        $serialHilang = json_decode($detail->serial_hilang ?? '[]', true);
        $serialBaru = json_decode($detail->serial_baru ?? '[]', true);

        if (!empty($serialHilang)) {
            Barang::where('model_id', $modelId)
                ->where('lokasi_id', $lokasiId)
                ->whereIn('serial_number', $serialHilang)
                ->delete();
        }

        if (!empty($serialBaru)) {
            foreach ($serialBaru as $serial) {
                Barang::create([
                    'serial_number' => $serial,
                    'model_id' => $modelId,
                    'lokasi_id' => $lokasiId,
                    'status' => 'perlu_verifikasi',
                ]);
            }
        }

        RekapStokBarang::updateOrCreate(
            [
                'model_id' => $modelId,
                'lokasi_id' => $lokasiId,
            ],
            [
                'jumlah_tersedia' => $detail->jumlah_fisik
            ]
        );
    }

}
