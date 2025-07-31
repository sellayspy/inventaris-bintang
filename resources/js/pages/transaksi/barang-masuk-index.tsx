import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';

interface KategoriOption {
    id: number;
    nama: string;
}

interface AsalOption {
    id: number;
    nama: string;
}

interface BarangMasuk {
    id: number;
    tanggal: string;
    serial_number: string;

    model: string;
    merek: string;
    kategori: string;
    asal: string;
}

interface PageProps {
    filters: {
        tanggal?: string;
        kategori_id?: string;
        asal_barang_id?: string;
    };
    barangMasuk: {
        data: BarangMasuk[];
    };
    kategoriOptions: KategoriOption[];
    asalOptions: AsalOption[];
}

export default function BarangMasukIndex() {
    const { filters, barangMasuk, kategoriOptions, asalOptions } = usePage<PageProps>().props;

    const { data, setData } = useForm({
        tanggal: filters?.tanggal || '',
        kategori_id: filters?.kategori_id || '',
        asal_barang_id: filters?.asal_barang_id || '',
    });

    function handleFilter() {
        router.get(route('barang-masuk.index'), data, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Barang Masuk</h1>
                    <Link href="/barang-masuk/create" className="rounded bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700">
                        + Tambah Barang Masuk
                    </Link>
                </div>

                {/* Filter Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleFilter();
                    }}
                    className="mb-6 flex flex-wrap items-end gap-4"
                >
                    <div>
                        <label className="mb-1 block text-sm">Tanggal</label>
                        <input
                            type="date"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                            className="rounded border p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">Kategori</label>
                        <select
                            value={data.kategori_id}
                            onChange={(e) => setData('kategori_id', e.target.value)}
                            className="rounded border p-2 text-sm"
                        >
                            <option value="">-- Semua --</option>
                            {kategoriOptions.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm">Asal Barang</label>
                        <select
                            value={data.asal_barang_id}
                            onChange={(e) => setData('asal_barang_id', e.target.value)}
                            className="rounded border p-2 text-sm"
                        >
                            <option value="">-- Semua --</option>
                            {asalOptions.map((a) => (
                                <option key={a.id} value={a.id}>
                                    {a.nama}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
                        Filter
                    </button>
                </form>

                {/* Table */}
                <div className="overflow-auto rounded border">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="border p-2">Tanggal</th>
                                <th className="border p-2">Serial Number</th>

                                <th className="border p-2">Merek</th>
                                <th className="border p-2">Model</th>
                                <th className="border p-2">Kategori</th>
                                <th className="border p-2">Asal Barang</th>
                            </tr>
                        </thead>
                        <tbody>
                            {barangMasuk.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        Tidak ada data.
                                    </td>
                                </tr>
                            ) : (
                                barangMasuk.data.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border p-2">{item.tanggal}</td>
                                        <td className="border p-2">{item.serial_number || '-'}</td>

                                        <td className="border p-2">{item.merek || '-'}</td>
                                        <td className="border p-2">{item.model || '-'}</td>
                                        <td className="border p-2">{item.kategori || '-'}</td>
                                        <td className="border p-2">{item.asal || '-'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
