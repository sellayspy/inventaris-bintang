<?php

namespace App\Http\Controllers\Laporan;

use App\Exports\BarangMasukExport;
use App\Http\Controllers\Controller;
use App\Models\View\ViewBarangMasuk;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class LaporanBarangMasukController extends Controller
{
    public function index(Request $request)
    {
        $query = ViewBarangMasuk::query();
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

        $barangMasukData = $query->orderBy('tanggal', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('laporan/barang-masuk/index', [
            'barangMasukData' => $barangMasukData,
            'filters' => $filters,
        ]);
    }

    public function exportBarangMasukExcel(Request $request)
    {
        return Excel::download(
            new BarangMasukExport($request->all()),
            'laporan_barang_masuk_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    public function exportBarangMasukPdf(Request $request)
    {
        $filters = $request->all();
        $query = ViewBarangMasuk::query();

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

        $barangMasukData = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('reports.barang_masuk_pdf', [
            'barangMasukData' => $barangMasukData,
            'filters' => $filters
        ]);

        return $pdf->download('laporan_barang_masuk_' . now()->format('Y-m-d') . '.pdf');
    }
}
