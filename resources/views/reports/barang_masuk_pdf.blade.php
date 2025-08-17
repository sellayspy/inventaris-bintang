<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Barang Masuk</title>
   <style>
        body {
            font-family: 'Helvetica', sans-serif;
            font-size: 10px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 18px;
        }
        .header p {
            margin: 5px 0;
            font-size: 12px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 6px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        .footer {
            position: fixed;
            bottom: 0px;
            text-align: center;
            width: 100%;
            font-size: 9px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Barang Masuk</h1>
        <p>Periode: {{ $filters['start_date'] ?? 'Semua' }} s/d {{ $filters['end_date'] ?? 'Waktu' }}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Serial Number</th>
                <th>Model</th>
                <th>Merek</th>
                <th>Kategori</th>
                <th>Asal Barang</th>
                <th>User Penerima</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($barangMasukData as $item)
                <tr>
                    <td>{{ $item->tanggal }}</td>
                    <td>{{ $item->serial_number }}</td>
                    <td>{{ $item->model }}</td>
                    <td>{{ $item->merek }}</td>
                    <td>{{ $item->kategori }}</td>
                    <td>{{ $item->asal_barang }}</td>
                    <td>{{ $item->nama_user }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" style="text-align: center;">Tidak ada data ditemukan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
