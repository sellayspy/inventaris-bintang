import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';

// Tipe untuk objek paginasi dari Laravel
interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
    path: string;
    per_page: number;
}

// Tipe untuk objek permission
interface Permission {
    id: number;
    name: string;
}

// Tipe untuk props yang diterima dari Inertia
interface PageProps {
    permissions: PaginatedData<Permission>;
    flash: {
        message?: string;
    };
}

// Komponen untuk merender link paginasi
function Pagination({ links }: { links: PaginatedData<any>['links'] }) {
    return (
        <div className="mt-6 flex flex-wrap justify-center gap-1">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    // Menggunakan dangerouslySetInnerHTML untuk merender &laquo; dan &raquo;
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`rounded border px-4 py-2 text-sm ${link.url ? 'hover:bg-white' : 'cursor-not-allowed text-gray-400'} ${link.active ? 'border-blue-500 bg-blue-500 text-white' : 'bg-gray-100'} `}
                    // Menonaktifkan link yang tidak memiliki URL (misal: '...')
                    as={link.url ? 'a' : 'span'}
                />
            ))}
        </div>
    );
}

export default function Index() {
    // Gunakan tipe yang sudah didefinisikan untuk props
    const { permissions, flash } = usePage<PageProps>().props;

    const handleDelete = (id: number) => {
        // Menggunakan window.confirm karena 'confirm' bisa ambigu
        if (window.confirm('Yakin ingin menghapus permission ini?')) {
            router.delete(route('permissions.destroy', id), {
                // Agar kembali ke halaman yang sama setelah delete
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Daftar Permissions</h1>

                {flash.message && <div className="mb-4 rounded border border-green-300 bg-green-100 p-3 text-green-700">{flash.message}</div>}

                <Link
                    href={route('permissions.create')}
                    className="mb-4 inline-block rounded bg-blue-600 px-4 py-2 text-white shadow-sm hover:bg-blue-700"
                >
                    + Tambah Permission
                </Link>

                <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 font-semibold">No</th>
                                <th className="p-3 font-semibold">Nama</th>
                                <th className="p-3 font-semibold">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-4 text-center text-gray-500">
                                        Tidak ada data permission.
                                    </td>
                                </tr>
                            ) : (
                                permissions.data.map((permission, i) => (
                                    <tr key={permission.id} className="border-t hover:bg-gray-50">
                                        {/* Penomoran yang benar untuk paginasi */}
                                        <td className="w-16 p-3">{permissions.from + i}</td>
                                        <td className="p-3">{permission.name}</td>
                                        <td className="w-40 space-x-2 p-3">
                                            <Link
                                                href={route('permissions.edit', permission.id)}
                                                className="font-medium text-blue-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(permission.id)} className="font-medium text-red-600 hover:underline">
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tampilkan komponen paginasi jika ada data */}
                {permissions.data.length > 0 && <Pagination links={permissions.links} />}
            </div>
        </AppLayout>
    );
}
