import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit3, MapPin, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Lokasi = { id: number; nama: string };
type SubLokasi = {
    id: number;
    nama: string;
    kode: string | null;
    lantai: string | null;
    keterangan: string | null;
    lokasi: Lokasi;
};

type Props = {
    subLokasi: {
        data: SubLokasi[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    lokasiList: Lokasi[];
    filters: { search: string; lokasi_id: string };
    flash?: { message?: string };
};

export default function SubLokasiIndex({ subLokasi, lokasiList, filters, flash }: Props) {
    const [editing, setEditing] = useState<SubLokasi | null>(null);
    const [showForm, setShowForm] = useState(false);

    const form = useForm({
        lokasi_id: '',
        nama: '',
        kode: '',
        lantai: '',
        keterangan: '',
    });

    useEffect(() => {
        if (flash?.message) {
            toast.success(flash.message);
            form.reset();
            setEditing(null);
            setShowForm(false);
        }
    }, [flash?.message]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editing) {
            form.put(`/sub-lokasi/${editing.id}`);
        } else {
            form.post('/sub-lokasi');
        }
    };

    const handleEdit = (item: SubLokasi) => {
        form.setData({
            lokasi_id: item.lokasi.id.toString(),
            nama: item.nama,
            kode: item.kode || '',
            lantai: item.lantai || '',
            keterangan: item.keterangan || '',
        });
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus sub-lokasi ini?')) {
            form.delete(`/sub-lokasi/${id}`);
        }
    };

    const handleCancel = () => {
        form.reset();
        setEditing(null);
        setShowForm(false);
    };

    const handleFilter = (field: string, value: string) => {
        router.get(route('sub-lokasi.index'), { ...filters, [field]: value }, { preserveState: true, replace: true });
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Sub-Lokasi" />
                <div className="mx-auto max-w-6xl space-y-6">
                    {/* Header */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sub-Lokasi</h1>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Kelola lokasi spesifik seperti ruangan, lantai, atau unit</p>
                        </div>
                        <button
                            onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
                        >
                            <Plus size={18} />
                            {showForm ? 'Tutup' : 'Tambah Sub-Lokasi'}
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-3">
                        <input
                            type="text"
                            placeholder="Cari nama, kode..."
                            defaultValue={filters.search}
                            onChange={(e) => handleFilter('search', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-blue-500 sm:w-64 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        />
                        <select
                            value={filters.lokasi_id || ''}
                            onChange={(e) => handleFilter('lokasi_id', e.target.value)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                        >
                            <option value="">Semua Lokasi</option>
                            {lokasiList.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Form */}
                    {showForm && (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                            <h2 className="mb-4 text-lg font-semibold dark:text-white">{editing ? 'Edit Sub-Lokasi' : 'Tambah Sub-Lokasi Baru'}</h2>
                            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lokasi *</label>
                                    <select
                                        value={form.data.lokasi_id}
                                        onChange={(e) => form.setData('lokasi_id', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Lokasi</option>
                                        {lokasiList.map((l) => (
                                            <option key={l.id} value={l.id}>
                                                {l.nama}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Sub-Lokasi *</label>
                                    <input
                                        type="text"
                                        value={form.data.nama}
                                        onChange={(e) => form.setData('nama', e.target.value)}
                                        placeholder="Contoh: Pendaftaran, Poli A"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Kode</label>
                                    <input
                                        type="text"
                                        value={form.data.kode}
                                        onChange={(e) => form.setData('kode', e.target.value)}
                                        placeholder="Contoh: REG, POLI-A"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lantai</label>
                                    <input
                                        type="text"
                                        value={form.data.lantai}
                                        onChange={(e) => form.setData('lantai', e.target.value)}
                                        placeholder="Contoh: 1, 2, B1"
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keterangan</label>
                                    <input
                                        type="text"
                                        value={form.data.keterangan}
                                        onChange={(e) => form.setData('keterangan', e.target.value)}
                                        placeholder="Keterangan tambahan..."
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm focus:ring-2 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white"
                                    />
                                </div>
                                <div className="flex gap-3 sm:col-span-2 lg:col-span-3">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Update' : 'Simpan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-gray-300"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Lokasi
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Sub-Lokasi
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Kode
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Lantai
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
                                {subLokasi.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                            <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-300" />
                                            Belum ada sub-lokasi. Klik "Tambah Sub-Lokasi" untuk membuat.
                                        </td>
                                    </tr>
                                ) : (
                                    subLokasi.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{item.lokasi?.nama}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{item.nama}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.kode || '-'}</td>
                                            <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.lantai || '-'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {subLokasi.links && subLokasi.links.length > 3 && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {subLokasi.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && router.get(link.url)}
                                    disabled={!link.url}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${link.active ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-300'} ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
