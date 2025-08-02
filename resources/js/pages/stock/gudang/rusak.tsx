import AppLayout from '@/layouts/app-layout';

interface Item {
    lokasi: string;
    kategori: string;
    nama_barang: string;
    jumlah_rusak: number;
}

interface Props {
    stokRusak: Item[];
}

export default function Rusak({ stokRusak }: Props) {
    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Stok Rusak (Gudang)</h1>
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Lokasi</th>
                            <th className="border px-4 py-2">Kategori</th>
                            <th className="border px-4 py-2">Nama Barang</th>
                            <th className="border px-4 py-2 text-right">Jumlah Rusak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stokRusak.map((item, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{item.lokasi}</td>
                                <td className="border px-4 py-2">{item.kategori}</td>
                                <td className="border px-4 py-2">{item.nama_barang}</td>
                                <td className="border px-4 py-2 text-right">{item.jumlah_rusak}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
