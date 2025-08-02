import AppLayout from '@/layouts/app-layout';

interface StokDistribusiItem {
    lokasi: string;
    kategori: string;
    merek: string;
    model: string;
    jumlah_tersedia: number;
}

interface Props {
    stokDistribusi: StokDistribusiItem[];
}

export default function Index({ stokDistribusi }: Props) {
    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Stok Distribusi</h1>
                        <p className="mt-1 text-gray-600">Data Semua Item Di Lokasi</p>
                    </div>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-300">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border px-4 py-2">Lokasi</th>
                                    <th className="border px-4 py-2">Kategori</th>
                                    <th className="border px-4 py-2">Nama Barang</th>
                                    <th className="border px-4 py-2">Jumlah Tersedia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stokDistribusi.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{item.lokasi}</td>
                                        <td className="border px-4 py-2">{item.kategori}</td>
                                        <td className="border px-4 py-2">{(item.merek ? item.merek + ' ' : '') + item.model}</td>
                                        <td className="border px-4 py-2 text-right">{item.jumlah_tersedia}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
