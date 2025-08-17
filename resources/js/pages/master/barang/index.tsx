import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce'; // Install lodash jika belum
import { useCallback, useState } from 'react';

export default function BarangIndex() {
    const { barangList, filters, filterOptions } = usePage().props as any;

    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori || '');
    const [lokasi, setLokasi] = useState(filters.lokasi || '');
    const [status, setStatus] = useState(filters.status || '');
    const [kondisi, setKondisi] = useState(filters.kondisi || '');

    const debouncedSearch = useCallback(
        debounce((nextValue) => {
            const query = {
                search: nextValue,
                kategori,
                lokasi,
                status,
                kondisi,
            };
            router.get(route('barang.index'), query, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 400),
        [kategori, lokasi, status, kondisi],
    );

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearch(value);
        debouncedSearch(value);
    };

    const updateFilter = (key: string, value: string) => {
        const query = {
            search,
            kategori,
            lokasi,
            status,
            kondisi,
            [key]: value,
        };

        router.get(route('barang.index'), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearch('');
        setKategori('');
        setLokasi('');
        setStatus('');
        setKondisi('');

        router.get(
            route('barang.index'),
            {},
            {
                preserveState: false,
                preserveScroll: true,
            },
        );
    };

    const handleDelete = (id: any) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
            router.delete(route('barang.destroy', id), {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout>
            <div className="p-4">
                <h1 className="mb-4 text-xl font-semibold">Daftar Barang</h1>

                {/* 🔍 Simplified Filter Controls */}
                <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-6">
                    <input
                        type="text"
                        placeholder="Cari..."
                        value={search}
                        onChange={handleSearchChange}
                        className="col-span-2 rounded border p-1 text-sm"
                    />

                    <select
                        value={kategori}
                        onChange={(e) => {
                            setKategori(e.target.value);
                            updateFilter('kategori', e.target.value);
                        }}
                        className="rounded border p-1 text-sm"
                    >
                        <option value="">Kategori</option>
                        {filterOptions.kategoriList.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={lokasi}
                        onChange={(e) => {
                            setLokasi(e.target.value);
                            updateFilter('lokasi', e.target.value);
                        }}
                        className="rounded border p-1 text-sm"
                    >
                        <option value="">Lokasi</option>
                        {filterOptions.lokasiList.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <select
                        value={status}
                        onChange={(e) => {
                            setStatus(e.target.value);
                            updateFilter('status', e.target.value);
                        }}
                        className="rounded border p-1 text-sm"
                    >
                        <option value="">Status</option>
                        {filterOptions.statusList.map((item) => (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        ))}
                    </select>

                    <button onClick={handleReset} className="rounded bg-gray-200 p-1 text-sm hover:bg-gray-300">
                        Reset
                    </button>
                </div>

                {/* 📋 Simplified Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border text-sm">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-1">No</th>
                                <th className="border p-1">Serial</th>
                                <th className="border p-1">Merek/Model</th>
                                <th className="border p-1">Kategori</th>
                                <th className="border p-1">Rak</th>
                                <th className="border p-1">Status</th>
                                <th className="border p-1">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {barangList.data.map((item, index) => (
                                <tr key={item.id}>
                                    <td className="border p-1">{index + 1 + barangList.from - 1}</td>
                                    <td className="border p-1">{item.serial_number}</td>
                                    <td className="border p-1">{item.merek_model}</td>
                                    <td className="border p-1">{item.kategori}</td>
                                    <td className="border p-1">
                                        {item.nama_rak} ({item.kode_rak})
                                    </td>
                                    <td className="border p-1">{item.status_awal}</td>
                                    <td className="border p-1">
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="rounded bg-red-500 px-2 py-0.5 text-xs text-white hover:bg-red-600"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 📑 Compact Pagination */}
                <div className="mt-3 flex justify-center gap-1">
                    {barangList.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`rounded border px-2 py-0.5 text-xs ${
                                link.active ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                            } ${!link.url ? 'text-gray-400' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
