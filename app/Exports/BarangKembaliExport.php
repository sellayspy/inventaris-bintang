<?php

namespace App\Exports;

use App\Models\View\ViewBarangKembali;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class BarangKembaliExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function headings(): array
    {
        return [
            'Tanggal Kembali',
            'Serial Number',
            'Model',
            'Merek',
            'Kategori',
            'Kondisi Saat Kembali',
            'Status Saat Kembali',
            'Dikembalikan oleh (User)',
            'Lokasi Kembali',
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
            $row->kondisi,
            $row->status_saat_kembali,
            $row->nama_user,
            $row->lokasi_nama,
        ];
    }

    public function query()
    {
        $query = ViewBarangKembali::query();
        $filters = $this->filters;

        // Terapkan filter tanggal
        if (!empty($filters['start_date']) && !empty($filters['end_date'])) {
            $query->whereBetween('tanggal', [$filters['start_date'], $filters['end_date']]);
        }

        // Terapkan filter pencarian
        if (!empty($filters['search'])) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(kondisi) LIKE ?', ["%{$search}%"])
                  ->orWhereRaw('LOWER(lokasi_nama) LIKE ?', ["%{$search}%"]);
            });
        }

        return $query->orderBy('tanggal', 'desc');
    }
}
