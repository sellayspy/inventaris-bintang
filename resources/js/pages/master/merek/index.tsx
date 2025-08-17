import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { debounce } from 'lodash';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Merek = {
    id: number;
    nama: string;
};
type FlashProps = { message?: string };

type Props = {
    merek: {
        data: Merek[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
};

type PageProps = {
    flash?: FlashProps;
    auth: {
        permissions?: string[];
    };
};

export default function Index({ merek, filters }: Props & { filters: { search: string } }) {
    const { auth, flash } = usePage<PageProps>().props;
    const [editing, setEditing] = useState<Merek | null>(null);
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
            form.put(`/merek/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/merek', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleEdit = (item: Merek) => {
        form.setData('nama', item.nama);
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus merek ini?')) {
            form.delete(`/merek/${id}`);
        }
    };

    const handleCancel = () => {
        form.reset();
        setEditing(null);
        setShowForm(false);
    };

    // fungsi pencarian dengan debounce
    const handleSearch = (value: string) => {
        setSearch(value);

        // Gunakan debounce untuk menunda request Inertia
        debounce(() => {
            router.get(
                route('merek.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400)();
    };

    const canCreateMerek = userPermissions.includes(PERMISSIONS.CREATE_MEREK);
    const canEditMerek = userPermissions.includes(PERMISSIONS.EDIT_MEREK);
    const canDeleteMerek = userPermissions.includes(PERMISSIONS.DELETE_MEREK);

    return (
        <AppLayout>
            <div className="bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Merek Barang" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Merek Barang</h1>
                        {/* Form Pencarian */}
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Cari merek..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="rounded-md border-gray-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />

                            {canCreateMerek && (
                                <button
                                    onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    {showForm ? 'Tutup Form' : ' + Tambah Merek'}
                                </button>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="mb-4 text-xl font-semibold dark:text-white">{editing ? 'Edit Merek' : 'Tambah Merek Baru'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Nama Merek</label>
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
                                        Nama Merek
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {merek.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.nama}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {canEditMerek && (
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="mr-3 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}

                                            {canDeleteMerek && (
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

                    {merek.links && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {merek.links.map((link, i) => (
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
