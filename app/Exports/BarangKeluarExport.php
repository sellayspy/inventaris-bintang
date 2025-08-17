<?php

namespace App\Exports;

use App\Models\View\ViewBarangKeluar;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class BarangKeluarExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function headings(): array
    {
        return [
            'Tanggal', 'Serial Number', 'Model', 'Merek', 'Kategori', 'Lokasi Tujuan', 'Status Keluar', 'Diberikan kepada (User)'
        ];
    }

    public function map($row): array
    {
        return [
            $row->tanggal, $row->serial_number, $row->model, $row->merek, $row->kategori, $row->lokasi_tujuan, $row->status_keluar, $row->nama_user,
        ];
    }

    public function query()
    {
        $query = ViewBarangKeluar::query();
        $filters = $this->filters;

        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('tanggal', [$filters['start_date'], $filters['end_date']]);
        }

        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(lokasi_tujuan) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->orderBy('tanggal', 'desc');
    }
}
