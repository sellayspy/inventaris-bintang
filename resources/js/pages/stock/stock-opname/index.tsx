import AppLayout from '@/layouts/app-layout';
import { Link, router } from '@inertiajs/react';

interface Lokasi {
    id: number;
    nama: string;
}

interface User {
    id: number;
    name: string;
}

interface StockOpname {
    id: number;
    tanggal: string;
    lokasi: Lokasi;
    user: User;
    catatan: string | null;
}

interface Props extends PageProps {
    data: {
        data: StockOpname[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

const handleApprove = (id: number) => {
    if (confirm('Yakin ingin meng-approve stock opname ini?')) {
        router.post(`/stock-opname/${id}/approve`);
    }
};

export default function StockOpnameIndex({ data }: Props) {
    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Daftar Stock Opname</h1>
                    <Link href="/stock-opname/create" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        + Tambah SO
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full rounded bg-white shadow">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="px-4 py-2 text-left">#</th>
                                <th className="px-4 py-2 text-left">Tanggal</th>
                                <th className="px-4 py-2 text-left">Lokasi</th>
                                <th className="px-4 py-2 text-left">Petugas</th>
                                <th className="px-4 py-2 text-left">Catatan</th>
                                <th className="px-4 py-2 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.data.map((item, index) => (
                                <tr key={item.id} className="border-t">
                                    <td className="px-4 py-2">{index + 1}</td>
                                    <td className="px-4 py-2">{item.tanggal}</td>
                                    <td className="px-4 py-2">{item.lokasi?.nama}</td>
                                    <td className="px-4 py-2">{item.user?.name}</td>
                                    <td className="px-4 py-2">{item.catatan || '-'}</td>
                                    <td className="px-4 py-2">
                                        <button
                                            onClick={() => handleApprove(item.id)}
                                            className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 flex justify-center">
                    {data.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`mx-1 rounded border px-3 py-1 text-sm ${
                                link.active ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
                            } ${!link.url && 'cursor-not-allowed opacity-50'}`}
                            disabled={!link.url}
                        >
                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
