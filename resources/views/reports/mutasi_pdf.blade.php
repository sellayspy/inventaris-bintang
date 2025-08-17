<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Mutasi Barang</title>
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
        <h1>Laporan Mutasi Barang</h1>
        <p>Periode: {{ $filters['start_date'] ?? 'Semua' }} s/d {{ $filters['end_date'] ?? 'Waktu' }}</p>
        <p>Dicetak pada: {{ now()->format('d M Y, H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>Serial Number</th>
                <th>Model</th>
                <th>Merek</th>
                <th>Lokasi Asal</th>
                <th>Lokasi Tujuan</th>
                <th>User</th>
                <th>Keterangan</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($mutasiData as $item)
                <tr>
                    <td>{{ $item->tanggal }}</td>
                    <td>{{ $item->serial_number }}</td>
                    <td>{{ $item->model }}</td>
                    <td>{{ $item->merek }}</td>
                    <td>{{ $item->lokasi_asal }}</td>
                    <td>{{ $item->lokasi_tujuan }}</td>
                    <td>{{ $item->nama_user }}</td>
                    <td>{{ $item->keterangan }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="8" style="text-align: center;">Tidak ada data ditemukan.</td>
                </tr>
            @endforelse
        </tbody>
    </table>
    
    <div class="footer">
        Aplikasi Inventaris - &copy; {{ date('Y') }}
    </div>
</body>
</html>