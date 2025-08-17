<?php

namespace App\Http\Controllers\Laporan;

use App\Exports\MutasiBarangExport;
use App\Http\Controllers\Controller;
use App\Models\MutasiBarang;
use App\Models\View\ViewMutasiBarang;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class MutasiBarangController extends Controller
{
    public function index(Request $request)
    {
       $query = ViewMutasiBarang::query();


        if ($request->filled('start_date') && $request->filled('end_date')) {
            $query->whereBetween('tanggal', [$request->start_date, $request->end_date]);
        } elseif ($request->filled('start_date')) {
            $query->whereDate('tanggal', '>=', $request->start_date);
        } elseif ($request->filled('end_date')) {
            $query->whereDate('tanggal', '<=', $request->end_date);
        }

        // Filter Pencarian Umum
        if ($request->filled('search')) {
            $search = strtolower($request->search);
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(serial_number) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(merek) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(lokasi_asal) LIKE ?', ["%{$search}%"])
                ->orWhereRaw('LOWER(lokasi_tujuan) LIKE ?', ["%{$search}%"]);
            });
        }

        $mutasiData = $query->orderBy('tanggal', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('laporan/mutasi/index', [
            'mutasiData' => $mutasiData,
            'filters' => $request->only('start_date', 'end_date', 'search'),
        ]);
    }

    public function exportMutasi(Request $request)
    {
        // Ambil semua filter dari request
        $filters = $request->all();

        // Buat nama file yang dinamis dengan tanggal
        $fileName = 'laporan_mutasi_barang_' . now()->format('Y-m-d') . '.xlsx';

        // Panggil class Export dengan filter dan trigger download
        return Excel::download(new MutasiBarangExport($filters), $fileName);
    }

    public function exportMutasiPdf(Request $request)
    {
        $query = ViewMutasiBarang::query();
        $filters = $request->all();

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
                   ->orWhereRaw('LOWER(model) LIKE ?', ["%{$search}%"]);
             });
        }

        $mutasiData = $query->orderBy('tanggal', 'desc')->get();

        $pdf = Pdf::loadView('reports.mutasi_pdf', [
            'mutasiData' => $mutasiData,
            'filters' => $filters
        ]);

        // 3. Download PDF
        return $pdf->download('laporan_mutasi_barang_' . now()->format('Y-m-d') . '.pdf');
    }

}
