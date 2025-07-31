import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type JenisBarang = {
    id: number;
    merek: string;
    model: string;
    kategori: {
        id: number;
        nama: string;
    };
};

type Kategori = {
    id: number;
    nama: string;
};

type FlashProps = {
    message?: string;
};

type Props = {
    data: JenisBarang[];
    kategoriList: Kategori[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Jenis Barang',
        href: '/jenis-barang',
    },
];

export default function Index({ data, kategoriList }: Props) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [editing, setEditing] = useState<JenisBarang | null>(null);
    const [showForm, setShowForm] = useState(false);

    const form = useForm({
        kategori_id: '',
        merek: '',
        model: '',
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
            form.reset();
        }
    }, [flash]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            form.put(`/jenis-barang/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/jenis-barang', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleEdit = (item: JenisBarang) => {
        form.setData({
            kategori_id: item.kategori.id.toString(),
            merek: item.merek,
            model: item.model,
        });
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus data ini?')) {
            form.delete(`/jenis-barang/${id}`);
        }
    };

    const handleCancel = () => {
        form.reset();
        setEditing(null);
        setShowForm(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Jenis Barang" />
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jenis Barang</h1>
                    <button
                        onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                        className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        {showForm ? 'Tutup Form' : 'Tambah Jenis'}
                    </button>
                </div>

                {showForm && (
                    <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-zinc-900 dark:text-white">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Kategori</label>
                                <select
                                    value={form.data.kategori_id}
                                    onChange={(e) => form.setData('kategori_id', e.target.value)}
                                    className="mt-1 block w-full rounded border px-3 py-2 dark:bg-zinc-800"
                                    required
                                >
                                    <option value="">-- Pilih Kategori --</option>
                                    {kategoriList.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.nama}
                                        </option>
                                    ))}
                                </select>
                                {form.errors.kategori_id && <p className="text-sm text-red-600">{form.errors.kategori_id}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Merek</label>
                                <input
                                    type="text"
                                    value={form.data.merek}
                                    onChange={(e) => form.setData('merek', e.target.value)}
                                    className="mt-1 block w-full rounded border px-3 py-2 dark:bg-zinc-800"
                                    required
                                />
                                {form.errors.merek && <p className="text-sm text-red-600">{form.errors.merek}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Model</label>
                                <input
                                    type="text"
                                    value={form.data.model}
                                    onChange={(e) => form.setData('model', e.target.value)}
                                    className="mt-1 block w-full rounded border px-3 py-2 dark:bg-zinc-800"
                                    required
                                />
                                {form.errors.model && <p className="text-sm text-red-600">{form.errors.model}</p>}
                            </div>

                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                                >
                                    {editing ? 'Update' : 'Simpan'}
                                </button>
                                <button type="button" onClick={handleCancel} className="rounded bg-gray-500 px-4 py-2 text-white">
                                    Batal
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="overflow-hidden rounded-lg bg-white shadow ring-1 ring-gray-100 dark:bg-zinc-900 dark:text-white">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                        <thead className="bg-gray-100 text-sm font-medium uppercase dark:bg-zinc-800">
                            <tr>
                                <th className="px-6 py-3 text-left">Kategori</th>
                                <th className="px-6 py-3 text-left">Merek</th>
                                <th className="px-6 py-3 text-left">Model</th>
                                <th className="px-6 py-3 text-left">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                            {data.map((item) => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4">{item.kategori.nama}</td>
                                    <td className="px-6 py-4">{item.merek}</td>
                                    <td className="px-6 py-4">{item.model}</td>
                                    <td className="space-x-2 px-6 py-4">
                                        <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
