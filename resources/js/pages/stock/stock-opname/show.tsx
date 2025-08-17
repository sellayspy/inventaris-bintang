import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

type StockOpnameDetail = {
    model_barang?: {
        kategori?: { nama: string };
        merek?: { nama: string };
        nama: string;
    };
    jumlah_sistem: number;
    jumlah_fisik: number;
    selisih: number;
    serial_hilang: string;
    serial_baru: string;
    catatan?: string;
};

type Props = {
    data: {
        id: number;
        tanggal: string;
        lokasi: { nama: string };
        user: { name: string };
        approved_at?: string | null;
        details: StockOpnameDetail[];
    };
};

export default function Show({ data }: Props) {
    const isApproved = !!data.approved_at;

    const safeJsonParse = (input: string): string[] => {
        try {
            const parsed = JSON.parse(input);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <AppLayout>
            <div className="mx-auto max-w-6xl p-6">
                <h1 className="mb-4 text-3xl font-bold">Review Stock Opname</h1>

                <div className="mb-6 space-y-2 text-sm text-gray-700">
                    <p>
                        <span className="font-semibold">Tanggal:</span> {data.tanggal}
                    </p>
                    <p>
                        <span className="font-semibold">Lokasi:</span> {data.lokasi?.nama ?? '-'}
                    </p>
                    <p>
                        <span className="font-semibold">Dibuat oleh:</span> {data.user?.name ?? '-'}
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-300 shadow-sm">
                        <thead className="bg-gray-100 text-sm text-gray-700 uppercase">
                            <tr>
                                <th className="border px-4 py-2 text-left">Model</th>
                                <th className="border px-4 py-2 text-center">Jumlah Sistem</th>
                                <th className="border px-4 py-2 text-center">Jumlah Fisik</th>
                                <th className="border px-4 py-2 text-center">Selisih</th>
                                <th className="border px-4 py-2">Serial Hilang</th>
                                <th className="border px-4 py-2">Serial Baru</th>
                                <th className="border px-4 py-2 text-left">Catatan</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-800">
                            {data.details.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">
                                        {item.model_barang
                                            ? `${item.model_barang.kategori?.nama ?? '-'} - ${item.model_barang.merek?.nama ?? '-'} - ${item.model_barang.nama ?? '-'}`
                                            : 'Model tidak ditemukan'}
                                    </td>
                                    <td className="border px-4 py-2 text-center">{item.jumlah_sistem}</td>
                                    <td className="border px-4 py-2 text-center">{item.jumlah_fisik}</td>
                                    <td className="border px-4 py-2 text-center">{item.selisih}</td>
                                    <td className="border px-4 py-2 text-xs">
                                        {safeJsonParse(item.serial_hilang).map((sn, i) => (
                                            <div key={i} className="text-red-600">
                                                {sn}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2 text-xs">
                                        {safeJsonParse(item.serial_baru).map((sn, i) => (
                                            <div key={i} className="text-green-600">
                                                {sn}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="border px-4 py-2">{item.catatan || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-6">
                    {!isApproved ? (
                        <button
                            onClick={() => {
                                if (confirm('Yakin ingin approve stock opname ini?')) {
                                    router.post(`/stock-opname/${data.id}/approve`);
                                }
                            }}
                            className="rounded bg-blue-600 px-4 py-2 text-white shadow transition hover:bg-blue-700"
                        >
                            Approve
                        </button>
                    ) : (
                        <p className="mt-4 font-semibold text-green-600">✅ Sudah di-approve pada: {data.approved_at}</p>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
