import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Menu } from '@headlessui/react';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ChevronDownIcon, ChevronUpIcon, EllipsisVerticalIcon, Eye, FolderOpenIcon, PencilIcon, PlusIcon, SearchIcon, TrashIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import DetailBarangMasukModal from './barang-masuk-detail';

interface BarangMasukItem {
    id: number;
    merek?: string;
    model?: string;
    kategori?: string;
    asal_barang?: string;
    tanggal?: string;
}

function debounce<T extends (...args: any[]) => void>(fn: T, delay: number): T {
    let timeout: ReturnType<typeof setTimeout>;
    return function (...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    } as T;
}

export default function BarangMasukIndex() {
    const { auth, filters, barangMasuk, kategoriOptions, asalOptions, merekOptions } = usePage().props as any;
    const items = barangMasuk.data || barangMasuk;
    const links = barangMasuk.links || [];
    const userPermissions = auth.permissions || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { data, setData, reset } = useForm({
        tanggal: filters?.tanggal || '',
        kategori_id: filters?.kategori_id || '',
        asal_barang_id: filters?.asal_barang_id || '',
        merek: filters?.merek || '',
        search: filters?.search || '',
        sort_by: filters?.sort_by || 'desc',
        per_page: filters?.per_page || 10,
        page: filters?.page || 1,
    });

    const openDetailModal = (item: BarangMasukItem) => {
        fetch(route('barang-masuk.show', item.id), {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setSelectedBarang(data.barangMasuk);
                setIsModalOpen(true);
            })
            .catch((error) => {
                console.error('Gagal mengambil data detail:', error);
            });
    };

    const debouncedFilter = useCallback(() => {
        const debouncedFn = debounce(() => {
            router.get(route('barang-masuk.index'), data, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 400);
        debouncedFn();
    }, [data]);

    useEffect(() => {
        debouncedFilter();
    }, [data.tanggal, data.kategori_id, data.asal_barang_id, data.merek, data.search, data.sort_by, data.per_page, debouncedFilter]);

    const canCreateBarangMasuk = userPermissions.includes(PERMISSIONS.CREATE_BARANG_MASUK);
    const canEditBarangMasuk = userPermissions.includes(PERMISSIONS.EDIT_BARANG_MASUK);

    return (
        <AppLayout>
            <div className="p-4">
                {/* Header Section */}
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold">Barang Masuk</h1>
                        <p className="text-xs text-gray-500">Daftar barang masuk inventory</p>
                    </div>
                    {canCreateBarangMasuk && (
                        <Link
                            href="/barang-masuk/create"
                            className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Tambah Barang Masuk
                        </Link>
                    )}
                </div>

                {/* Filter Section - Modern Design */}
                <div className="mb-6 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-6">
                        <div className="flex items-center justify-between sm:justify-start">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                                <p className="text-xs text-gray-500">Filter data inventaris yang masuk</p>
                            </div>

                            <button
                                onClick={() => setIsFilterOpen(!isFilterOpen)}
                                className="ml-4 flex items-center gap-1 rounded-md px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 sm:ml-6"
                            >
                                {isFilterOpen ? (
                                    <>
                                        <span>Sembunyikan</span>
                                        <ChevronUpIcon className="h-4 w-4" />
                                    </>
                                ) : (
                                    <>
                                        <span>Filter Lanjutan</span>
                                        <ChevronDownIcon className="h-4 w-4" />
                                    </>
                                )}
                            </button>
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
                                placeholder="Cari berdasarkan serial, brand, model..."
                            />
                        </div>
                    </div>

                    {isFilterOpen && (
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

                            <div>
                                <label className="mb-1 block text-xs font-medium text-gray-700">Tampilkan:</label>
                                <select
                                    value={data.per_page}
                                    onChange={(e) => {
                                        setData('per_page', e.target.value);
                                        setData('page', 1); // reset ke halaman 1
                                    }}
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 py-2 pr-3 pl-2 text-sm shadow-sm inset-ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="10">10</option>
                                    <option value="25">25</option>
                                    <option value="50">50</option>
                                    <option value="100">100</option>
                                    <option value="all">All</option>
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
                                            per_page: 10,
                                        });
                                        router.get(route('barang-masuk.index'));
                                    }}
                                    className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm ring-1 ring-gray-300 transition-colors ring-inset hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table Section */}
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Merek & Model</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Asal Barang</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {items.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-500">
                                            <div className="py-6">
                                                <FolderOpenIcon className="mx-auto h-10 w-10 text-gray-400" />
                                                <p className="mt-2">Tidak ada data barang masuk</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    items.map((item: any, idx: number) => {
                                        const nomor = barangMasuk.from ? barangMasuk.from + idx : idx + 1;
                                        const isLastThree = items.length - idx <= 3;
                                        return (
                                            <tr key={`${item.id}`} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium whitespace-nowrap text-gray-900">{nomor}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.tanggal}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                                                    {`${item.merek || ''} ${item.model || ''}`.trim() || '-'}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.kategori || '-'}</td>
                                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{item.asal_barang || '-'}</td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    <Menu as="div" className="relative inline-block text-center">
                                                        {/* Tombol Pemicu Dropdown */}
                                                        <Menu.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                                                            Selengkapnya <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
                                                        </Menu.Button>

                                                        {/* Panel Dropdown dengan transisi */}
                                                        <Menu.Items
                                                            className={`ring-opacity-5 absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none ${isLastThree ? 'bottom-full origin-bottom-right' : 'origin-top-right'} `}
                                                        >
                                                            <div className="py-1">
                                                                {/* Tombol Detail */}
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            onClick={() => openDetailModal(item)}
                                                                            className={`${active ? 'bg-gray-100' : ''} flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700`}
                                                                        >
                                                                            <Eye className="h-4 w-4 text-blue-500" />
                                                                            <span>Lihat Detail</span>
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                                {/* Tombol Edit */}
                                                                {canEditBarangMasuk && (
                                                                    <Menu.Item>
                                                                        {({ active }) => (
                                                                            <Link
                                                                                href={route('barang-masuk.edit', { barang_masuk: item.id })}
                                                                                className={`${active ? 'bg-gray-100' : ''} flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700`}
                                                                            >
                                                                                <PencilIcon className="h-4 w-4 text-yellow-500" />
                                                                                <span>Edit Data</span>
                                                                            </Link>
                                                                        )}
                                                                    </Menu.Item>
                                                                )}

                                                                {/* Tombol Hapus */}
                                                                <Menu.Item>
                                                                    {({ active }) => (
                                                                        <button
                                                                            onClick={() => {
                                                                                if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                                                                                    router.delete(route('barang-masuk.destroy', item.id));
                                                                                }
                                                                            }}
                                                                            className={`${active ? 'bg-gray-100' : ''} flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500`}
                                                                        >
                                                                            <TrashIcon className="h-4 w-4" />
                                                                            <span>Hapus Data</span>
                                                                        </button>
                                                                    )}
                                                                </Menu.Item>
                                                            </div>
                                                        </Menu.Items>
                                                    </Menu>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {links.length > 0 && barangMasuk.total > items.length && (
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Menampilkan {barangMasuk.from} sampai {barangMasuk.to} dari {barangMasuk.total} data
                        </div>
                        <div>
                            <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                {links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() =>
                                            link.url &&
                                            router.get(
                                                link.url,
                                                {},
                                                {
                                                    preserveState: true,
                                                    preserveScroll: true,
                                                },
                                            )
                                        }
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                            link.active
                                                ? 'z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600'
                                                : 'text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:outline-offset-0'
                                        } ${index === 0 ? 'rounded-l-md' : ''} ${index === barangMasuk.links.length - 1 ? 'rounded-r-md' : ''}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
            </div>
            <DetailBarangMasukModal show={isModalOpen} onClose={() => setIsModalOpen(false)} barang={selectedBarang} />
        </AppLayout>
    );
}
