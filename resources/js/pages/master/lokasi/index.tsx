import { Column, DataTable } from '@/components/data-table';
import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Lokasi = { id: number; nama: string; alamat: string };
type FlashProps = { message?: string };
type PaginationLink = { url: string | null; label: string; active: boolean };
type Props = {
    lokasi: {
        data: Lokasi[];
        links: PaginationLink[];
    };
    auth: {
        permissions?: string[];
    };
};

export default function index({ auth, lokasi, filters }: Props & { filters: { search: string } }) {
    const { flash } = usePage<{ flash: FlashProps }>().props;
    const [editing, setEditing] = useState<Lokasi | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState(filters.search || '');
    const userPermissions = auth.permissions || [];

    const form = useForm({ nama: '', alamat: '' });

    useEffect(() => {
        if (flash?.message) {
            form.reset();
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editing) {
            form.put(`/lokasi/${editing.id}`, {
                onSuccess: () => {
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/lokasi', {
                onSuccess: () => setShowForm(false),
            });
        }
    };

    const handleEdit = (item: Lokasi) => {
        form.setData('nama', item.nama);
        form.setData('alamat', item.alamat);
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus lokasi ini?')) {
            form.delete(`/lokasi/${id}`);
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

    const canCreateLokasi = userPermissions.includes(PERMISSIONS.CREATE_LOKASI_DISTRIBUSI);
    const canEditLokasi = userPermissions.includes(PERMISSIONS.EDIT_LOKASI_DISTRIBUSI);
    const canDeleteLokasi = userPermissions.includes(PERMISSIONS.DELETE_LOKASI_DISTRIBUSI);

    const columns: Column<Lokasi>[] = [
        {
            header: 'Nama Lokasi',
            accessorKey: 'nama',
            className: 'text-left',
        },
        {
            header: 'Alamat',
            accessorKey: 'alamat',
            className: 'text-left',
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Lokasi" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Data Lokasi</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola daftar lokasi distribusi/gudang.</p>
                        </div>
                    </div>

                    {showForm && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {editing ? 'Edit Lokasi' : 'Tambah Lokasi Baru'}
                                </h2>
                                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Nama Lokasi</label>
                                    <input
                                        type="text"
                                        value={form.data.nama}
                                        onChange={(e) => form.setData('nama', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                    {form.errors.nama && <p className="mt-1 text-sm text-red-600">{form.errors.nama}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-gray-200">Alamat</label>
                                    <input
                                        type="text"
                                        value={form.data.alamat}
                                        onChange={(e) => form.setData('alamat', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                    {form.errors.alamat && <p className="mt-1 text-sm text-red-600">{form.errors.alamat}</p>}
                                </div>
                                <div className="flex items-end gap-3">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Simpan Perubahan' : 'Simpan Lokasi'}
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
                        data={lokasi.data}
                        columns={columns}
                        links={lokasi.links}
                        searchPlaceholder="Cari lokasi..."
                        onSearch={handleSearch}
                        initialSearch={search}
                        onCreate={
                            canCreateLokasi
                                ? () => {
                                      setShowForm(true);
                                      setEditing(null);
                                      form.reset();
                                  }
                                : undefined
                        }
                        createLabel="Tambah Lokasi"
                        actionWidth="w-[100px]"
                        actions={(item) => (
                            <div className="flex items-center justify-end gap-2">
                                {canEditLokasi && (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="group hover:bg-opacity-100 rounded-full p-2 text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        title="Edit"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                )}
                                {canDeleteLokasi && (
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
