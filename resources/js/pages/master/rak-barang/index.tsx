import { Column, DataTable } from '@/components/data-table';
import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
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
                route('rak-barang.index'),
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

    const columns: Column<RakBarang>[] = [
        {
            header: 'Gudang/Lokasi',
            accessorKey: 'lokasi',
            cell: (item) => item.lokasi?.nama,
        },
        {
            header: 'Nama Rak',
            accessorKey: 'nama_rak',
        },
        {
            header: 'Baris',
            accessorKey: 'baris',
            cell: (item) => item.baris || '-',
        },
        {
            header: 'Kode Rak',
            accessorKey: 'kode_rak',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Rak Barang" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Data Rak Barang</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola daftar rak barang dan alokasi tempat.</p>
                        </div>
                    </div>

                    {showForm && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {editing ? 'Edit Rak Barang' : 'Tambah Rak Baru'}
                                </h2>
                                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Gudang/Lokasi</label>
                                    <select
                                        value={form.data.lokasi_id}
                                        onChange={(e) => form.setData('lokasi_id', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
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
                                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Nama Rak</label>
                                        <input
                                            type="text"
                                            value={form.data.nama_rak}
                                            onChange={(e) => form.setData('nama_rak', e.target.value)}
                                            className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            required
                                        />
                                        {form.errors.nama_rak && <p className="mt-1 text-sm text-red-600">{form.errors.nama_rak}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Kode Rak</label>
                                        <input
                                            type="text"
                                            value={form.data.kode_rak}
                                            onChange={(e) => form.setData('kode_rak', e.target.value)}
                                            className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                            required
                                        />
                                        {form.errors.kode_rak && <p className="mt-1 text-sm text-red-600">{form.errors.kode_rak}</p>}
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Baris</label>
                                        <input
                                            type="text"
                                            value={form.data.baris}
                                            onChange={(e) => form.setData('baris', e.target.value)}
                                            className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        />
                                        {form.errors.baris && <p className="mt-1 text-sm text-red-600">{form.errors.baris}</p>}
                                    </div>
                                </div>

                                <div className="flex items-end gap-3 pt-2">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Simpan Perubahan' : 'Simpan Rak'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 hover:text-slate-900"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    <DataTable
                        data={rakList.data}
                        columns={columns}
                        links={rakList.links}
                        searchPlaceholder="Cari rak barang..."
                        onSearch={handleSearch}
                        initialSearch={search}
                        onCreate={
                            canCreateRak
                                ? () => {
                                      setShowForm(true);
                                      setEditing(null);
                                      form.reset();
                                  }
                                : undefined
                        }
                        createLabel="Tambah Rak"
                        actionWidth="w-[100px]"
                        actions={(item) => (
                            <div className="flex items-center justify-end gap-2">
                                {canEditRak && (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="group hover:bg-opacity-100 rounded-full p-2 text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        title="Edit"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                )}
                                {canDeleteRak && (
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="group hover:bg-opacity-100 rounded-full p-2 text-red-600 transition-all hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                        title="Hapus"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
