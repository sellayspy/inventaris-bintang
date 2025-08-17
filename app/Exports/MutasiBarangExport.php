<?php

namespace App\Exports;

use App\Models\View\ViewMutasiBarang;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class MutasiBarangExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    // Terima filter dari controller melalui constructor
    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    /**
     * Menentukan header untuk kolom Excel.
     */
    public function headings(): array
    {
        return [
            'Tanggal Mutasi',
            'Serial Number',
            'Model',
            'Merek',
            'Kategori',
            'Lokasi Asal',
            'Lokasi Tujuan',
            'User',
            'Keterangan',
        ];
    }

    /**
    * Mapping data dari query ke format yang diinginkan di Excel.
    */
    public function map($row): array
    {
        return [
            $row->tanggal,
            $row->serial_number,
            $row->model,
            $row->merek,
            $row->kategori,
            $row->lokasi_asal,
            $row->lokasi_tujuan,
            $row->nama_user,
            $row->keterangan,
        ];
    }

    public function query()
    {
        $query = ViewMutasiBarang::query();
        $filters = $this->filters;

        // Filter Rentang Tanggal
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('tanggal', [$filters['start_date'], $filters['end_date']]);
        } elseif (!empty($filters['start_date'])) {
            $query->whereDate('tanggal', '>=', $filters['start_date']);
        } elseif (!empty($filters['end_date'])) {
            $query->whereDate('tanggal', '<=', $filters['end_date']);
        }

        // Filter Pencarian Umum
        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(merek) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(lokasi_asal) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(lokasi_tujuan) LIKE ?', ["%{$search}%"]);
            });
        }

        // Selalu urutkan hasil ekspor
        return $query->orderBy('tanggal', 'desc');
    }
}
