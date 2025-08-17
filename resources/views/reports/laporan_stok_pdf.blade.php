<!DOCTYPE html>
<html>
<head>
    <title>Laporan Stok Gudang</title>
    <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 10px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #777;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }
        .header-section {
            text-align: center;
            margin-bottom: 20px;
        }
        .header-section h2 {
            margin: 0;
        }
        .header-section p {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="header-section">
        <h2>Laporan Stok Barang Gudang</h2>
        <p>Dicetak pada tanggal: {{ $tanggalCetak }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>No</th>
                <th>Kategori</th>
                <th>Merek</th>
                <th>Model Barang</th>
                <th>Stock</th>
                <th>Perbaikan</th>
                <th>Rusak</th>
                <th>Stok Akhir</th>
            </tr>
        </thead>
        <tbody>
            @forelse($stokBarang as $item)
                <tr>
                    <td style="text-align: center;">{{ $loop->iteration }}</td>
                    <td>{{ $item['kategori'] }}</td>
                    <td>{{ $item['merek'] }}</td>
                    <td>{{ $item['model'] }}</td>
                    <td style="text-align: center;">{{ $item['jumlah_total'] }}</td>
                    <td style="text-align: center;">{{ $item['jumlah_perbaikan'] }}</td>
                    <td style="text-align: center;">{{ $item['jumlah_rusak'] }}</td>
                    <td style="text-align: center;">{{ $item['jumlah_tersedia'] }}</td>

                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Tidak ada data yang cocok dengan filter yang diterapkan.</td>
                </tr>
            @endforelse
        </tbody>
         @if($stokBarang->isNotEmpty())
        <tfoot>
            <tr class="total-row">
                <td colspan="4" style="text-align: right;">TOTAL KESELURUHAN</td>
                <td style="text-align: center;">{{ $stokBarang->sum('jumlah_total') }}</td>
                <td style="text-align: center;">{{ $stokBarang->sum('jumlah_perbaikan') }}</td>
                <td style="text-align: center;">{{ $stokBarang->sum('jumlah_rusak') }}</td>
                <td style="text-align: center;">{{ $stokBarang->sum('jumlah_tersedia') }}</td>
            </tr>
        </tfoot>
        @endif
    </table>
</body>
</html>
