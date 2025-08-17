<?php

namespace App\Http\Controllers\Laporan;

use App\Exports\BarangKembaliExport;
use App\Http\Controllers\Controller;
use App\Models\View\ViewBarangKembali;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class LaporanBarangKembaliController extends Controller
{
    public function index(Request $request)
    {
        $query = ViewBarangKembali::query();
        $filters = $request->only('start_date', 'end_date', 'search');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        } elseif ($request->filled('end_date')) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }

        if ($request->filled('search')) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                 $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                   ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                   ->orWhereRaw('LOWER(merek) LIKE ?', ["%{$search}%"])
                   ->orWhereRaw('LOWER(asal_barang) LIKE ?', ["%{$search}%"]);
            });
        }

        $barangKembaliData = $query->orderBy('tanggal', 'desc')->paginate(10)->withQueryString();

        return Inertia::render('laporan/barang-kembali/index', [
            'barangKembaliData' => $barangKembaliData,
            'filters' => $filters,
        ]);
    }

    public function exportBarangKembaliExcel(Request $request)
    {
        return Excel::download(
            new BarangKembaliExport($request->all()),
            'laporan_barang_kembali_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    public function exportBarangKembaliPdf(Request $request)
    {
        $query = ViewBarangKembali::query();
        $filters = $request->only('start_date', 'end_date', 'search');

        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        } elseif ($request->filled('end_date')) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }

        if ($request->filled('search')) {
            $search = strtolower($filters['search']);
            $query->where(function ($q) use ($search) {
                 $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                   ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                   ->orWhereRaw('LOWER(merek) LIKE ?', ["%{$search}%"])
                   ->orWhereRaw('LOWER(asal_barang) LIKE ?', ["%{$search}%"]);
            });
        }

        $barangKembaliData = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('reports.barang_kembali_pdf', [
            'barangKembaliData' => $barangKembaliData,
            'filters' => $request->all()
        ]);

        return $pdf->download('laporan_barang_kembali_' . now()->format('Y-m-d') . '.pdf');
    }
}
