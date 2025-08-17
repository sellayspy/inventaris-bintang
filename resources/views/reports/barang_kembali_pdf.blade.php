<!DOCTYPE html>
<html>
<head>
    <title>Laporan Barang Kembali</title>
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
    <div class="header"><h1>Laporan Barang Kembali</h1></div>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th>SN</th>
                <th>Model</th>
                <th>Merek</th>
                <th>Kondisi</th>
                <th>Status</th>
                <th>User</th>
                <th>Lokasi</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($barangKembaliData as $item)
                <tr>
                    <td>{{ $item->tanggal }}</td>
                    <td>{{ $item->serial_number }}</td>
                    <td>{{ $item->model }}</td>
                    <td>{{ $item->merek }}</td>
                    <td>{{ $item->kondisi }}</td>
                    <td>{{ $item->status_saat_kembali }}</td>
                    <td>{{ $item->nama_user }}</td>
                    <td>{{ $item->lokasi_nama }}</td>
                </tr>
            @empty
                <tr><td colspan="8" style="text-align: center;">Tidak ada data.</td></tr>
            @endforelse
        </tbody>
    </table>
</body>
</html>
