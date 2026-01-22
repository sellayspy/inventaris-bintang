import { Column, DataTable } from '@/components/data-table';
import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react'; // Added Eye for view detail if needed
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Barang = {
    id: string; // UUID usually
    serial_number: string;
    merek_model: string;
    kategori: string;
    nama_rak: string;
    kode_rak: string;
    status_awal: string;
};

type PaginationLink = { url: string | null; label: string; active: boolean };
type Props = {
    barangList: {
        data: Barang[];
        links: PaginationLink[];
        from: number;
    };
    filters: {
        search?: string;
        kategori?: string;
        lokasi?: string;
        status?: string;
        kondisi?: string;
    };
    filterOptions: {
        kategoriList: string[];
        lokasiList: string[];
        statusList: string[];
    };
    flash?: { message?: string };
    auth: { permissions?: string[] };
};

export default function BarangIndex({ barangList, filters, filterOptions, auth }: Props) {
    const { flash } = usePage<{ flash: { message?: string } }>().props;
    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [lokasi, setLokasi] = useState(filters.lokasi || '');
    const [status, setStatus] = useState(filters.status || '');

    // permissions
    const userPermissions = auth.permissions || [];
    const canDelete = userPermissions.includes(PERMISSIONS.DELETE_BARANG_INVENTARIS);
    const canEdit = userPermissions.includes(PERMISSIONS.EDIT_BARANG_INVENTARIS); // Assuming exist
    const canCreate = userPermissions.includes(PERMISSIONS.CREATE_BARANG_INVENTARIS); // Assuming exist

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
        }
    }, [flash?.message]);

    const updateFilter = useCallback(
        debounce((query: any) => {
            router.get(route('barang.index'), query, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 400),
        [],
    );

    const handleSearch = (value: string) => {
        setSearch(value);
        updateFilter({
            search: value,
            kategori,
            lokasi,
            status,
        });
    };

    const handleFilterChange = (key: string, value: string) => {
        if (key === 'kategori') setKategori(value);
        if (key === 'lokasi') setLokasi(value);
        if (key === 'status') setStatus(value);

        updateFilter({
            search,
            kategori: key === 'kategori' ? value : kategori,
            lokasi: key === 'lokasi' ? value : lokasi,
            status: key === 'status' ? value : status,
        });
    };

    const handleReset = () => {
        setSearch('');
        setKategori('');
        setLokasi('');
        setStatus('');
        router.get(route('barang.index'), {}, { preserveState: false });
    };

    const handleDelete = (id: string) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            router.delete(route('barang.destroy', id), {
                preserveScroll: true,
                onSuccess: () => toast.success('Barang berhasil dihapus'),
            });
        }
    };

    const columns: Column<Barang>[] = [
        {
            header: 'Serial Number',
            accessorKey: 'serial_number',
        },
        {
            header: 'Merek / Model',
            accessorKey: 'merek_model',
        },
        {
            header: 'Kategori',
            accessorKey: 'kategori',
        },
        {
            header: 'Lokasi / Rak',
            accessorKey: 'nama_rak',
            cell: (item) => (
                <div className="flex flex-col">
                    <span className="font-medium">{item.nama_rak}</span>
                    <span className="text-xs text-slate-500">{item.kode_rak}</span>
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status_awal',
            cell: (item) => (
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status_awal === 'Tersedia'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                            : item.status_awal === 'Rusak'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : 'bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300'
                    }`}
                >
                    {item.status_awal}
                </span>
            ),
        },
    ];

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Daftar Barang" />

                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Daftar Barang</h1>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Kelola seluruh inventaris barang.</p>
                        </div>
                    </div>

                    {/* Filters Area */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <select
                            value={kategori}
                            onChange={(e) => handleFilterChange('kategori', e.target.value)}
                            className="rounded-md border-gray-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="">Semua Kategori</option>
                            {filterOptions.kategoriList.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={lokasi}
                            onChange={(e) => handleFilterChange('lokasi', e.target.value)}
                            className="rounded-md border-gray-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="">Semua Lokasi</option>
                            {filterOptions.lokasiList.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <select
                            value={status}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="rounded-md border-gray-200 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="">Semua Status</option>
                            {filterOptions.statusList.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleReset}
                            className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700"
                        >
                            Reset Filter
                        </button>
                    </div>

                    <DataTable
                        data={barangList.data}
                        columns={columns}
                        links={barangList.links}
                        searchPlaceholder="Cari serial number, merek, model..."
                        onSearch={handleSearch}
                        initialSearch={search}
                        onCreate={canCreate ? () => router.get(route('barang.create')) : undefined} // Assuming create route exists
                        createLabel="Tambah Barang"
                        actionWidth="w-[100px]"
                        actions={(item) => (
                            <div className="flex items-center justify-end gap-2">
                                {/* <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400" title="Detail">
                                    <Eye size={16} />
                                </button> */}
                                {canEdit && (
                                    <button
                                        onClick={() => router.get(route('barang.edit', item.id))}
                                        className="group hover:bg-opacity-100 rounded-full p-2 text-blue-600 transition-all hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                                        title="Edit"
                                    >
                                        <Edit3 size={16} />
                                    </button>
                                )}
                                {canDelete && (
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
