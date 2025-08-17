<?php

namespace App\Exports;

use App\Models\View\ViewBarangMasuk;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class BarangMasukExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function headings(): array
    {
        return [
            'Tanggal Transaksi',
            'Serial Number',
            'Model',
            'Merek',
            'Kategori',
            'Asal Barang',
            'Diterima oleh (User)',
        ];
    }

    public function map($row): array
    {
        return [
            $row->tanggal,
            $row->serial_number,
            $row->model,
            $row->merek,
            $row->kategori,
            $row->asal_barang,
            $row->nama_user,
        ];
    }

    public function query()
    {
        $query = ViewBarangMasuk::query();
        $filters = $this->filters;

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('tanggal', [$filters['start_date'], $filters['end_date']]);
        } elseif (!empty($filters['start_date'])) {
            $query->whereDate('tanggal', '>=', $filters['start_date']);
        } elseif (!empty($filters['end_date'])) {
            $query->whereDate('tanggal', '<=', $filters['end_date']);
        }

        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(merek) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(asal_barang) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->orderBy('tanggal', 'desc');
    }
}
