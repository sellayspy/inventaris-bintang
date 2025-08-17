import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type AsalBarang = { id: number; nama: string };
type FlashProps = { message?: string };
type PaginationLink = { url: string | null; label: string; active: boolean };
type Props = {
    asal: {
        data: AsalBarang[];
        links: PaginationLink[];
    };
    auth: {
        permissions?: string[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Asal Barang',
        href: '/asal-barang',
    },
];

export default function index({ auth, asal, filters }: Props & { filters: { search: string } }) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [editing, setEditing] = useState<AsalBarang | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const userPermissions = auth.permissions || [];

    const form = useForm({ nama: '' });

    useEffect(() => {
        if (flash?.message) {
            form.reset();
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            form.put(`/asal-barang/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/asal-barang', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleEdit = (item: AsalBarang) => {
        form.setData('nama', item.nama);
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus asal barang ini?')) {
            form.delete(`/asal-barang/${id}`);
        }
    };

    const handleCancel = () => {
        form.reset();
        setEditing(null);
        setShowForm(false);
    };

    const handleSearch = (value: string) => {
        setSearch(value);

        debounce(() => {
            router.get(
                route('asal-barang.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400)();
    };

    const canCreateAsal = userPermissions.includes(PERMISSIONS.CREATE_ASAL_BARANG);
    const canEditAsal = userPermissions.includes(PERMISSIONS.EDIT_ASAL_BARANG);
    const canDeleteAsal = userPermissions.includes(PERMISSIONS.DELETE_ASAL_BARANG);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Asal Barang" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Asal Barang</h1>
                        {/* Form Pencarian */}
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="rounded-md border-gray-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />

                            {canCreateAsal && (
                                <button
                                    onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    {showForm ? 'Tutup Form' : ' + Tambah Asal'}
                                </button>
                            )}
                        </div>
                    </div>
                    {showForm && (
                        <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
                            <h2 className="mb-4 text-xl font-semibold dark:text-white">{editing ? 'Edit Asal Barang' : 'Tambah Asal Baru'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Nama Asal</label>
                                    <input
                                        type="text"
                                        value={form.data.nama}
                                        onChange={(e) => form.setData('nama', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                    {form.errors.nama && <p className="mt-1 text-sm text-red-600">{form.errors.nama}</p>}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Update' : 'Simpan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Nama Asal
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {asal.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.nama}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {canEditAsal && (
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="mr-3 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                            {canDeleteAsal && (
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {asal.links && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {asal.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && form.get(link.url)}
                                    className={`rounded px-3 py-1 text-sm ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-blue-600 hover:bg-gray-100 dark:bg-zinc-800 dark:text-blue-400'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    disabled={!link.url}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
