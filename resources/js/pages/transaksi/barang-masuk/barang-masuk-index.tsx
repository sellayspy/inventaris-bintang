import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { FolderOpenIcon, PlusIcon, SearchIcon } from 'lucide-react';
import { useCallback, useEffect } from 'react';

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    } as T;
}

export default function BarangMasukIndex() {
    const { filters, barangMasuk, kategoriOptions, asalOptions, merekOptions } = usePage().props as any;

    const { data, setData, reset } = useForm({
        tanggal: filters?.tanggal || '',
        kategori_id: filters?.kategori_id || '',
        asal_barang_id: filters?.asal_barang_id || '',
        merek: filters?.merek || '',
        search: filters?.search || '',
        sort_by: filters?.sort_by || 'desc',
    });

    // Debounced filter untuk input teks
    const debouncedFilter = useCallback(
        debounce(() => {
            router.get(route('barang-masuk.index'), data, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 400),
        [data],
    );

    // Trigger otomatis filter saat semua data berubah
    useEffect(() => {
        debouncedFilter();
    }, [data.tanggal, data.kategori_id, data.asal_barang_id, data.merek, data.search, data.sort_by]);

    return (
        <AppLayout>
            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Barang Masuk</h1>
                        <p className="text-sm text-gray-500">Daftar barang masuk inventory</p>
                    </div>
                    <Link
                        href="/barang-masuk/create"
                        className="flex items-center gap-1 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Tambah Barang Masuk
                    </Link>
                </div>

                {/* Filter Section - Modern Design */}
                <div className="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                            <p className="text-xs text-gray-500">Filter data inventaris yang masuk</p>
                        </div>

                        <div className="relative w-full sm:max-w-md">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <SearchIcon className="h-4 w-4 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={data.search}
                                onChange={(e) => setData('search', e.target.value)}
                                className="block w-full rounded-lg border-0 bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-900 shadow-sm ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-inset"
                                placeholder="Search by serial, brand, model..."
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pr-3 pl-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Tanggal</label>
                            <select
                                value={data.kategori_id}
                                onChange={(e) => setData('kategori_id', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pr-3 pl-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Semua Kategori</option>
                                {kategoriOptions.map((k: any) => (
                                    <option key={k.id} value={k.id}>
                                        {k.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Asal Barang</label>
                            <select
                                value={data.asal_barang_id}
                                onChange={(e) => setData('asal_barang_id', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pr-3 pl-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Semua Asal-Barang</option>
                                {asalOptions.map((a: any) => (
                                    <option key={a.id} value={a.id}>
                                        {a.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Merek</label>
                            <select
                                value={data.merek}
                                onChange={(e) => setData('merek', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pr-3 pl-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Semua Merek</option>
                                {merekOptions.map((merek: any) => (
                                    <option key={merek.id} value={merek.nama}>
                                        {merek.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-xs font-medium text-gray-700">Urutkan</label>
                            <select
                                value={data.sort_by}
                                onChange={(e) => setData('sort_by', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pr-3 pl-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="desc">Terbaru</option>
                                <option value="asc">Terlama</option>
                            </select>
                        </div>

                        <div className="flex items-end sm:col-span-2 lg:col-span-3">
                            <button
                                type="button"
                                onClick={() => {
                                    reset({
                                        tanggal: '',
                                        kategori_id: '',
                                        asal_barang_id: '',
                                        merek: '',
                                        search: '',
                                        sort_by: 'desc',
                                    });
                                    router.get(route('barang-masuk.index'));
                                }}
                                className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors ring-inset hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                            >
                                Reset Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Serial Number</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merek</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Model</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asal Barang</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {barangMasuk.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-4 text-center text-sm text-gray-500">
                                            <div className="py-6">
                                                <FolderOpenIcon className="mx-auto h-10 w-10 text-gray-400" />
                                                <p className="mt-2">Tidak ada data barang masuk</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    barangMasuk.data.map((item: any, idx: number) => {
                                        const nomor = barangMasuk.from + idx;
                                        return (
                                            <tr key={`${item.id}-${item.serial_number}`} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">{nomor}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.tanggal}</td>
                                                <td className="px-4 py-3 font-mono whitespace-nowrap text-gray-700">{item.serial_number || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.merek || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.model || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.kategori || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.asal_barang || '-'}</td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {barangMasuk.data.length > 0 && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Menampilkan {barangMasuk.from} sampai {barangMasuk.to} dari {barangMasuk.total} data
                        </div>
                        <div className="flex space-x-1">
                            {barangMasuk.links.map((link: any, index: number) => (
                                <button
                                    key={index}
                                    disabled={!link.url}
                                    onClick={() => link.url && router.get(link.url)}
                                    className={`flex h-8 w-8 items-center justify-center rounded-md text-sm ${
                                        link.active ? 'bg-blue-600 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
