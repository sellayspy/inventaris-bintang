import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Kategori {
    id: number;
    nama: string;
}

interface JenisBarang {
    id: number;
    nama: string;
    kategori: Kategori;
    kategori_id?: number;
}

interface FlashProps {
    message?: string;
}

interface JenisBarangPagination {
    data: JenisBarang[];
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    jenisBarang: JenisBarangPagination;
    kategoriBarang: Kategori[];
    flash?: { message?: string };
    auth: {
        permissions?: string[];
    };
}

const breadcrumbs = [
    { name: 'Master', href: '#' },
    { name: 'Jenis Barang', href: route('jenis-barang.index') },
];

export default function Index({ auth, jenisBarang, kategoriBarang, filters }: Props & { filters: { search: string } }) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [editing, setEditing] = useState<JenisBarang | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const userPermissions = auth.permissions || [];

    const form = useForm({
        nama: '',
        kategori_id: '',
    });

    useEffect(() => {
        if (flash?.message) {
            form.reset();
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing?.id) {
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
            nama: item.nama,
            kategori_id: String(item.kategori.id),
        });
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus jenis barang ini?')) {
            console.log('Deleting id:', id);
            form.delete(`/jenis-barang/${id}`);
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
                route('jenis-barang.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400)();
    };

    const canCreateJenis = userPermissions.includes(PERMISSIONS.CREATE_JENIS);
    const canEditJenis = userPermissions.includes(PERMISSIONS.EDIT_JENIS);
    const canDeleteJenis = userPermissions.includes(PERMISSIONS.DELETE_JENIS);

    return (
        <AppLayout>
            <div className="bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Jenis Barang" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Jenis Barang</h1>
                        {/* Form Pencarian */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="rounded-md border-gray-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />

                            {canCreateJenis && (
                                <button
                                    onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    {showForm ? 'Tutup Form' : ' + Tambah Jenis'}
                                </button>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="mb-4 text-xl font-semibold dark:text-white">{editing ? 'Edit Jenis' : 'Tambah Jenis Barang Baru'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nama Jenis */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Nama Jenis</label>
                                    <input
                                        type="text"
                                        value={form.data.nama}
                                        onChange={(e) => form.setData('nama', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                    {form.errors.nama && <p className="mt-1 text-sm text-red-600">{form.errors.nama}</p>}
                                </div>

                                {/* Dropdown Kategori */}
                                <div>
                                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Kategori</label>
                                    <select
                                        value={form.data.kategori_id}
                                        onChange={(e) => form.setData('kategori_id', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    >
                                        <option value="">-- Pilih Kategori --</option>
                                        {kategoriBarang.map((kategori) => (
                                            <option key={kategori.id} value={kategori.id}>
                                                {kategori.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.kategori_id && <p className="mt-1 text-sm text-red-600">{form.errors.kategori_id}</p>}
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
                                        Nama Jenis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {jenisBarang.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.nama}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{item.kategori?.nama}</td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap">
                                            {canEditJenis && (
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="mr-3 text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}

                                            {canDeleteJenis && (
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

                    {jenisBarang.links && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {' '}
                            {jenisBarang.links.map((link, i) => (
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
