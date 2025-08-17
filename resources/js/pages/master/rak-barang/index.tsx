import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type RakBarang = {
    id: number;
    nama_rak: string;
    baris?: string;
    kode_rak: string;
    lokasi: {
        id: number;
        nama: string;
    };
};

type Lokasi = {
    id: number;
    nama: string;
};

type PaginatedData<T> = {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    total: number;
};

type FlashProps = {
    message?: string;
};

type Props = {
    rakList: PaginatedData<RakBarang>;
    lokasiList?: Lokasi[];
    auth: {
        permissions?: string[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Rak Barang',
        href: '/rak-barang',
    },
];

export default function Index({ auth, rakList, lokasiList = [], filters }: Props & { filters: { search: string } }) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [editing, setEditing] = useState<RakBarang | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const userPermissions = auth.permissions || [];

    const form = useForm({
        lokasi_id: '',
        nama_rak: '',
        baris: '',
        kode_rak: '',
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
            form.put(`/rak-barang/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/rak-barang', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleEdit = (item: RakBarang) => {
        form.setData({
            lokasi_id: item.lokasi.id.toString(),
            nama_rak: item.nama_rak,
            baris: item.baris || '',
            kode_rak: item.kode_rak,
        });
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus rak ini?')) {
            form.delete(`/rak-barang/${id}`);
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
                route('lokasi.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400)();
    };

    const canCreateRak = userPermissions.includes(PERMISSIONS.CREATE_RAK_BARANG);
    const canEditRak = userPermissions.includes(PERMISSIONS.EDIT_RAK_BARANG);
    const canDeleteRak = userPermissions.includes(PERMISSIONS.DELETE_RAK_BARANG);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Rak Barang" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Data Rak Barang</h1>
                        {/* Form Pencarian */}
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Cari kategori..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="rounded-md border-gray-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />

                            {canCreateRak && (
                                <button
                                    onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                                    className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                                >
                                    {showForm ? 'Tutup Form' : ' + Tambah Rak'}
                                </button>
                            )}
                        </div>
                    </div>
                    {showForm && (
                        <div className="mb-6 rounded-lg bg-white p-6 shadow dark:bg-zinc-900">
                            <h2 className="mb-4 text-xl font-semibold dark:text-white">{editing ? 'Edit Rak Barang' : 'Tambah Rak Baru'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium dark:text-gray-200">Gudang/Lokasi</label>
                                    <select
                                        value={form.data.lokasi_id}
                                        onChange={(e) => form.setData('lokasi_id', e.target.value)}
                                        className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    >
                                        <option value="">-- Pilih Gudang --</option>
                                        {lokasiList.map((lokasi) => (
                                            <option key={lokasi.id} value={lokasi.id}>
                                                {lokasi.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.lokasi_id && <p className="mt-1 text-sm text-red-600">{form.errors.lokasi_id}</p>}
                                </div>

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium dark:text-gray-200">Nama Rak</label>
                                        <input
                                            type="text"
                                            value={form.data.nama_rak}
                                            onChange={(e) => form.setData('nama_rak', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            required
                                        />
                                        {form.errors.nama_rak && <p className="mt-1 text-sm text-red-600">{form.errors.nama_rak}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium dark:text-gray-200">Kode Rak</label>
                                        <input
                                            type="text"
                                            value={form.data.kode_rak}
                                            onChange={(e) => form.setData('kode_rak', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            required
                                        />
                                        {form.errors.kode_rak && <p className="mt-1 text-sm text-red-600">{form.errors.kode_rak}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium dark:text-gray-200">Baris</label>
                                        <input
                                            type="text"
                                            value={form.data.baris}
                                            onChange={(e) => form.setData('baris', e.target.value)}
                                            className="w-full rounded-md border border-gray-300 p-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        />
                                        {form.errors.baris && <p className="mt-1 text-sm text-red-600">{form.errors.baris}</p>}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2">
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
                                        Nama Rak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Baris
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Kode Rak
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {rakList.data.map((rak, index) => (
                                    <tr key={rak.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{rak.nama_rak}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{rak.baris || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{rak.kode_rak}</td>
                                        <td className="flex gap-3 px-6 py-4 text-sm whitespace-nowrap">
                                            {canEditRak && (
                                                <button
                                                    onClick={() => handleEdit(rak)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                >
                                                    <Edit3 size={18} />
                                                </button>
                                            )}
                                            {canDeleteRak && (
                                                <button
                                                    onClick={() => handleDelete(rak.id)}
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
                </div>
            </div>
        </AppLayout>
    );
}
