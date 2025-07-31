import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Kategori = { id: number; nama: string };
type FlashProps = { message?: string };
type PaginationLink = { url: string | null; label: string; active: boolean };
type Props = {
    kategori: {
        data: Kategori[];
        links: PaginationLink[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: '/kategori',
    },
];

export default function Index({ kategori }: Props) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [editing, setEditing] = useState<Kategori | null>(null);
    const [showForm, setShowForm] = useState(false);

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
            form.put(`/kategori/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/kategori', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleEdit = (item: Kategori) => {
        form.setData('nama', item.nama);
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus kategori ini?')) {
            form.delete(`/kategori/${id}`);
        }
    };

    const handleCancel = () => {
        form.reset();
        setEditing(null);
        setShowForm(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="p-6">
                <Head title="Kategori Barang" />

                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Kategori Barang</h1>
                    <button
                        onClick={() => {
                            if (showForm) {
                                handleCancel();
                            } else {
                                setShowForm(true);
                            }
                        }}
                        className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow transition-all duration-150 hover:bg-blue-700"
                    >
                        {showForm ? 'Tutup Form' : 'Tambah Kategori'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-6 rounded-lg bg-white p-6 shadow-md ring-1 ring-gray-100 dark:bg-zinc-900 dark:text-white">
                        <h2 className="mb-4 text-xl font-semibold">{editing ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Nama Kategori</label>
                                <input
                                    type="text"
                                    value={form.data.nama}
                                    onChange={(e) => form.setData('nama', e.target.value)}
                                    className="focus:ring-opacity-50 mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800"
                                    required
                                />
                                {form.errors.nama && <div className="mt-1 text-sm text-red-600">{form.errors.nama}</div>}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded-md bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition duration-150 hover:bg-green-700 disabled:opacity-50"
                                >
                                    {editing ? 'Update' : 'Simpan'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="rounded-md bg-gray-500 px-4 py-2 text-white shadow-sm transition duration-150 hover:bg-gray-600"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-hidden rounded-lg bg-white shadow-md ring-1 ring-gray-100 dark:bg-zinc-900 dark:text-white">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-100 text-sm font-medium text-gray-700 uppercase dark:bg-zinc-800 dark:text-gray-300">
                            <tr>
                                <th className="px-6 py-3 text-left">Nama Kategori</th>
                                <th className="px-6 py-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white dark:divide-zinc-700 dark:bg-zinc-900">
                            {kategori.data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4">{item.nama}</td>
                                    <td className="space-x-2 px-6 py-4">
                                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline dark:text-blue-400">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline dark:text-red-400">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {kategori.links && (
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                        {kategori.links.map((link, i) => (
                            <button
                                key={i}
                                onClick={() => link.url && form.get(link.url)}
                                className={`rounded border px-3 py-1 text-sm ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-blue-600 hover:bg-blue-100 dark:bg-zinc-800 dark:text-blue-400'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                disabled={!link.url}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
