import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';

interface User {
    name: string;
}

interface Barang {
    serial_number: string;
}

interface Pemusnahan {
    id: number;
    kode_pemusnahaan: string;
    tanggal_pemusnahaan: string;
    alasan: string;
    status: 'pending' | 'approved' | 'rejected';
    user: User;
    approver: User | null;
    barang: Barang[];
}

interface PaginatedData<T> {
    data: T[];
    links: {
        first: string | null;
        last: string | null;
        prev: string | null;
        next: string | null;
    };
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

interface Props {
    daftarPemusnahan: PaginatedData<Pemusnahan>;
    auth: {
        permissions?: string[];
    };
}

const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses = 'px-2 py-1 text-xs font-bold rounded-full text-white';
    if (status === 'approved') return <span className={`${baseClasses} bg-green-500`}>APPROVED</span>;
    if (status === 'pending') return <span className={`${baseClasses} bg-yellow-500`}>PENDING</span>;
    if (status === 'rejected') return <span className={`${baseClasses} bg-red-500`}>REJECTED</span>;
    return <span className={`${baseClasses} bg-gray-500`}>{status}</span>;
};

export default function IndexPemusnahan({ auth, daftarPemusnahan }: Props) {
    const userPermissions = auth.permissions || [];
    const canApproveStokRusak = userPermissions.includes(PERMISSIONS.APPROVE_STOK_RUSAK);

    const handleApprove = (pemusnahanId: number) => {
        if (window.confirm('Anda yakin ingin menyetujui pengajuan pemusnahan ini? Stok akan diperbarui secara permanen.')) {
            router.post(
                route('stock.rusak.pemusnahan.approve', pemusnahanId),
                {},
                {
                    preserveScroll: true,
                },
            );
        }
    };

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Daftar Pengajuan Pemusnahan</h1>
                <div className="overflow-x-auto rounded-lg border bg-white shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Kode</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Tanggal</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Alasan</th>
                                <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Pengaju</th>
                                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                <th className="px-4 py-3 text-center text-xs font-medium tracking-wider text-gray-500 uppercase">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {daftarPemusnahan.data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">{item.kode_pemusnahaan}</td>
                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">{item.tanggal_pemusnahaan}</td>
                                    <td className="px-4 py-4 text-sm text-gray-500">{item.alasan}</td>
                                    <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">{item.user.name}</td>
                                    <td className="px-4 py-4 text-center text-sm whitespace-nowrap text-gray-500">
                                        <StatusBadge status={item.status} />
                                    </td>
                                    <td className="px-4 py-4 text-center text-sm font-medium whitespace-nowrap">
                                        {canApproveStokRusak && item.status === 'pending' && (
                                            <button
                                                onClick={() => handleApprove(item.id)}
                                                disabled={router.processing}
                                                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700 disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                        )}
                                        {item.status === 'approved' && (
                                            <span className="text-xs text-gray-400">Approved by {item.approver?.name || '-'}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {/* <div className="mt-4 flex justify-between">
                    <span className="text-sm text-gray-700">
                        Showing {daftarPemusnahan.meta.from} to {daftarPemusnahan.meta.to} of {daftarPemusnahan.meta.total} results
                    </span>
                    <div className="flex items-center gap-1">
                        {daftarPemusnahan.meta.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`rounded border px-3 py-1 text-sm ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'} ${!link.url ? 'cursor-not-allowed text-gray-400' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div> */}
            </div>
        </AppLayout>
    );
}
