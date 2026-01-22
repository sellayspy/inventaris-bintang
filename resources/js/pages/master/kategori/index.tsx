import { Column, DataTable } from '@/components/data-table';
import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react';
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

type PageProps = {
    flash?: FlashProps;
    auth: {
        permissions?: string[];
    };
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Kategori',
        href: '/kategori',
    },
];

export default function Index({ kategori, filters }: Props & { filters: { search: string } }) {
    const { auth, flash } = usePage<PageProps>().props;
    const [editing, setEditing] = useState<Kategori | null>(null);
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

    const handleSearch = (value: string) => {
        setSearch(value);

        debounce(() => {
            router.get(
                route('kategori.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400)();
    };

    const canCreateKategori = userPermissions.includes(PERMISSIONS.CREATE_KATEGORI);
    const canEditKategori = userPermissions.includes(PERMISSIONS.EDIT_KATEGORI);
    const canDeleteKategori = userPermissions.includes(PERMISSIONS.DELETE_KATEGORI);

    const columns: Column<Kategori>[] = [
        {
            header: 'Nama Kategori',
            accessorKey: 'nama',
            className: 'text-left',
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Kategori Barang" />
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Kategori Barang</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola daftar kategori untuk inventaris barang.</p>
                        </div>
                    </div>

                    {showForm && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                            <div className="mb-5 flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    {editing ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                                </h2>
                                <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                                    <span className="sr-only">Close</span>
                                    {/* Simple close icon or text if needed, preserving functionality */}
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-gray-200">Nama Kategori</label>
                                    <input
                                        type="text"
                                        value={form.data.nama}
                                        onChange={(e) => form.setData('nama', e.target.value)}
                                        className="w-full rounded-md border border-gray-200 p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        placeholder="Contoh: Elektronik"
                                        required
                                    />
                                    {form.errors.nama && <p className="mt-1 text-sm text-red-600">{form.errors.nama}</p>}
                                </div>
                                <div className="flex items-end gap-3 md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Simpan Perubahan' : 'Simpan Kategori'}
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
                        data={kategori.data}
                        columns={columns}
                        links={kategori.links}
                        searchPlaceholder="Cari kategori..."
                        onSearch={handleSearch}
                        initialSearch={search}
                        onCreate={
                            canCreateKategori
                                ? () => {
                                      setShowForm(true);
                                      setEditing(null);
                                      form.reset();
                                  }
                                : undefined
                        }
                        createLabel="Tambah Kategori"
                        actionWidth="w-[100px]"
                        actions={(item) => (
                            <div className="flex items-center justify-end gap-2">
                                {canEditKategori && (
                                    <button
                                        onClick={() => handleEdit(item)}
                                        className="group hover:bg-opacity-100 rounded-full p-2 text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        title="Edit"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                )}

                                {canDeleteKategori && (
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
