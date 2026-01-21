import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { ArrowBigLeft, PlusCircleIcon, TrainFrontTunnelIcon } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import BarangKeluarDetailModal from './BarangKeluarDetail';
import AksiDropdown from './aksi-dropdown';

interface KategoriOption {
    id: number;
    nama: string;
}

interface LokasiOption {
    id: number;
    nama: string;
}

interface Merek {
    nama: string;
}

interface Kategori {
    nama: string;
}

interface ModelBarang {
    nama: string;
    merek: Merek;
    kategori: Kategori;
}

interface Barang {
    model_barang: ModelBarang;
}

interface BarangKeluarDetail {
    id: number;
    barang: Barang;
}

interface Lokasi {
    nama: string;
}
interface BarangKeluarTransaksi {
    id: number;
    tanggal: string;
    lokasi: Lokasi;
    details: BarangKeluarDetail[];
}

interface PageProps {
    filters: {
        tanggal?: string;
        kategori_id?: string;
        lokasi_id?: string;
        sort?: 'terbaru' | 'terlama';
        per_page?: number | string;
    };
    barangKeluar: {
        data: BarangKeluarTransaksi[];
        from: number;
    };
    kategoriOptions: KategoriOption[];
    lokasiOptions: LokasiOption[];
    [key: string]: unknown;
    auth: {
        permissions?: string[];
    };
}

export default function BarangKeluarIndex() {
    const { auth, filters, barangKeluar, kategoriOptions, lokasiOptions } = usePage<PageProps>().props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    // Fungsi untuk membuka modal
    const handleOpenModal = (transaksi) => {
        setSelectedItem(transaksi);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const userPermissions = auth.permissions || [];
    const isInitialMount = useRef(true);

    const { data, setData } = useForm({
        tanggal: filters?.tanggal || '',
        kategori_id: filters?.kategori_id || '',
        lokasi_id: filters?.lokasi_id || '',
        search: filters?.search || '',
        sort: filters?.sort || 'terbaru',
        per_page: filters?.per_page || 10,
    });

    function handleFilter() {
        router.get(route('barang-keluar.index'), data, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    }

    function handleResetFilters() {
        router.get(
            route('barang-keluar.index'),
            {},
            {
                preserveScroll: true,
                replace: true,
            },
        );
    }

    // ## 2. BUAT PENGECEKAN APAKAH ADA FILTER YANG AKTIF ##
    const isFilterActive = useMemo(() => {
        return (
            data.search !== '' ||
            data.tanggal !== '' ||
            data.kategori_id !== '' ||
            data.lokasi_id !== '' ||
            data.sort !== 'terbaru' ||
            String(data.per_page) !== '10'
        );
    }, [data]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }

        const timeout = setTimeout(() => {
            handleFilter();
        }, 500);

        return () => clearTimeout(timeout);
    }, [data.search]);

    useEffect(() => {
        if (!isInitialMount.current) {
            handleFilter();
        }
    }, [data.tanggal, data.kategori_id, data.lokasi_id, data.sort, data.per_page]);

    const canCreateBarangKeluar = userPermissions.includes(PERMISSIONS.CREATE_BARANG_KELUAR);
    const canEditBarangKeluar = userPermissions.includes(PERMISSIONS.EDIT_BARANG_KELUAR);
    const canDeleteBarangKeluar = userPermissions.includes(PERMISSIONS.DELETE_BARANG_KELUAR);

    return (
        <AppLayout>
            <div className="p-4">
                {/* Simplified Header */}
                <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-xl font-semibold">Barang Keluar</h1>
                        <p className="text-xs text-gray-500">Daftar barang yang keluar dari inventori</p>
                    </div>
                    {canCreateBarangKeluar && (
                        <Link
                            href="/barang-keluar/create"
                            className="flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700"
                        >
                            <PlusCircleIcon className="h-3 w-3" />
                            <span>Tambah Barang Keluar</span>
                        </Link>
                    )}
                </div>

                {/* Streamlined Filter Card */}
                <div className="mb-4 rounded border bg-white p-3">
                    {/* Bagian yang selalu tampil */}
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-grow">
                            <label className="mb-1 block text-xs text-gray-600">Pencarian</label>
                            <input
                                type="text"
                                value={data.search || ''}
                                onChange={(e) => setData('search', e.target.value)}
                                className="w-full rounded border p-1.5 text-xs"
                                placeholder="Cari serial/merek/model..."
                            />
                        </div>
                        <div className="flex h-max items-center gap-2 self-end">
                            {/* ## 3. TAMBAHKAN TOMBOL RESET DI UI ## */}
                            {isFilterActive && (
                                <button
                                    onClick={handleResetFilters}
                                    className="flex items-center gap-2 rounded border p-1.5 text-xs text-red-600 hover:bg-gray-50"
                                >
                                    <ArrowBigLeft className="h-3 w-3" />
                                    <span>Reset</span>
                                </button>
                            )}
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 rounded border p-1.5 text-xs hover:bg-gray-50"
                            >
                                <TrainFrontTunnelIcon className="h-3 w-3" />
                                <span>Filter</span>
                            </button>
                        </div>
                    </div>

                    {/* Bagian yang bisa disembunyikan */}
                    {showFilters && (
                        <div className="mt-4 grid grid-cols-1 gap-3 border-t pt-4 sm:grid-cols-2 md:grid-cols-4">
                            <div>
                                <label className="mb-1 block text-xs text-gray-600">Tanggal</label>
                                <input
                                    type="date"
                                    value={data.tanggal}
                                    onChange={(e) => setData('tanggal', e.target.value)}
                                    className="w-full rounded border p-1.5 text-xs"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-600">Kategori</label>
                                <select
                                    value={data.kategori_id}
                                    onChange={(e) => setData('kategori_id', e.target.value)}
                                    className="w-full rounded border p-1.5 text-xs"
                                >
                                    <option value="">Semua Kategori</option>
                                    {kategoriOptions.map((k) => (
                                        <option key={k.id} value={k.id}>
                                            {k.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-600">Urutkan</label>
                                <select
                                    value={data.sort}
                                    onChange={(e) => setData('sort', e.target.value)}
                                    className="w-full rounded border p-1.5 text-xs"
                                >
                                    <option value="terbaru">Terbaru</option>
                                    <option value="terlama">Terlama</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-1 block text-xs text-gray-600">Item per Halaman</label>
                                <select
                                    value={data.per_page}
                                    onChange={(e) => setData('per_page', e.target.value)}
                                    className="w-full rounded border p-1.5 text-xs"
                                >
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                    <option value={100}>100</option>
                                    <option value="all">Semua</option>
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {/* Optimized Table */}
                <div className="overflow-hidden rounded border bg-white">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">No</th>
                                    <th className="p-2 text-left">Tanggal</th>
                                    <th className="p-2 text-left">Merek/Model</th>
                                    <th className="p-2 text-left">Kategori</th>
                                    <th className="p-2 text-left">Tujuan</th>
                                    <th className="p-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {barangKeluar.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-4 text-center">
                                            {/* ... (kode untuk "tidak ada data") ... */}
                                        </td>
                                    </tr>
                                ) : (
                                    barangKeluar.data.map((transaksi, idx) => {
                                        const nomor = barangKeluar.from + idx;
                                        // Ambil item pertama sebagai perwakilan data
                                        const firstItem = transaksi.details[0];

                                        return (
                                            <tr key={transaksi.id} className="hover:bg-gray-50">
                                                <td className="p-2">{nomor}</td>
                                                <td className="p-2">{transaksi.tanggal}</td>

                                                {/* KOLOM MEREK/MODEL */}
                                                <td className="p-2">
                                                    <span>
                                                        {/* Tampilkan data dari item pertama */}
                                                        {firstItem?.barang?.model_barang?.merek?.nama || ''}{' '}
                                                        {firstItem?.barang?.model_barang?.nama || '(Tidak ada barang)'}
                                                    </span>

                                                    {/* Tambahkan indikator jika ada lebih dari 1 barang */}
                                                    {transaksi.details.length > 1 && (
                                                        <span className="ml-2 text-[10px] text-gray-500 italic">
                                                            (+{transaksi.details.length - 1} lainnya)
                                                        </span>
                                                    )}
                                                </td>

                                                {/* KOLOM KATEGORI */}
                                                <td className="p-2">
                                                    {/* Tampilkan kategori dari item pertama */}
                                                    {firstItem?.barang?.model_barang?.kategori?.nama || '-'}
                                                </td>

                                                <td className="p-2">{transaksi.lokasi?.nama || '-'}</td>
                                                <td className="p-2 text-right">
                                                    <AksiDropdown
                                                        transaksi={transaksi}
                                                        handleOpenModal={handleOpenModal}
                                                        can={{
                                                            edit: canEditBarangKeluar,
                                                            delete: canDeleteBarangKeluar, // asumsikan ada permission ini
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Compact Pagination */}
                    {barangKeluar.links && barangKeluar.links.length > 1 && (
                        <div className="border-t px-3 py-2">
                            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
                                <p className="text-xs text-gray-600">
                                    Menampilkan {barangKeluar.from}-{barangKeluar.to} dari {barangKeluar.total}
                                </p>
                                <div className="flex">
                                    {barangKeluar.links.map((link, index) => (
                                        <button
                                            key={index}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            className={`px-2 py-1 text-xs ${
                                                link.active ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                                            } ${index === 0 ? 'rounded-l' : ''} ${index === barangKeluar.links.length - 1 ? 'rounded-r' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <BarangKeluarDetailModal show={isModalOpen} onClose={handleCloseModal} barangKeluar={selectedItem} />
        </AppLayout>
    );
}

// You'll need to import these icons (assuming you're using Heroicons)
function PlusIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}

function PrinterIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
        </svg>
    );
}
