import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';
import { useState } from 'react';
import BarangKembaliDetailModal from './BarangKembaliDetail';

interface KategoriOption {
    id: number;
    nama: string;
}

interface LokasiOption {
    id: number;
    nama: string;
}

interface BarangKembali {
    id: number;
    tanggal: string;
    serial_number: string;
    merek: string;
    model: string;
    kategori: string;
    lokasi: string;
    kondisi: string;
}

interface PageProps {
    filters: {
        tanggal?: string;
        kategori_id?: string;
        lokasi_id?: string;
    };
    barangKembali: {
        data: BarangKembali[];
    };
    kategoriOptions: KategoriOption[];
    lokasiOptions: LokasiOption[];
    auth: {
        permissions?: string[];
    };
}

export default function BarangKembaliIndex() {
    const { auth, filters, barangKembali, kategoriOptions, lokasiOptions } = usePage<PageProps>().props;
    const userPermissions = auth.permissions || [];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    // Fungsi untuk membuka modal
    const handleOpenDetailModal = (transaksi) => {
        setSelectedItem(transaksi);
        setIsModalOpen(true);
    };

    // Fungsi untuk menutup modal
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    const { data, setData } = useForm({
        tanggal: filters?.tanggal || '',
        kategori_id: filters?.kategori_id || '',
        lokasi_id: filters?.lokasi_id || '',
    });

    function handleFilter() {
        router.get(route('barang-kembali.index'), data, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleEdit = (id: any) => {
        router.get(`/barang-kembali/${id}/edit`);
    };

    const canCreateBarangKembali = userPermissions.includes(PERMISSIONS.CREATE_BARANG_KEMBALI);
    const canEditBarangKembali = userPermissions.includes(PERMISSIONS.EDIT_BARANG_KEMBALI);
    const canDeleteBarangKembali = userPermissions.includes(PERMISSIONS.DELETE_BARANG_KEMBALI);

    return (
        <AppLayout>
            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center sm:gap-0">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Barang Kembali</h1>
                        <p className="text-sm text-gray-500">Daftar barang yang kembali ke inventori</p>
                    </div>
                    {canCreateBarangKembali && (
                        <Link
                            href="/barang-kembali/create"
                            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
                        >
                            <PlusIcon className="h-4 w-4" />
                            Tambah Barang Kembali
                        </Link>
                    )}
                </div>

                {/* Filter Card */}
                <div className="mb-6 rounded-lg border bg-white p-4 shadow-sm">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleFilter();
                        }}
                        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Kategori</label>
                            <select
                                value={data.kategori_id}
                                onChange={(e) => setData('kategori_id', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
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
                            <label className="mb-1 block text-sm font-medium text-gray-700">Lokasi Asal</label>
                            <select
                                value={data.lokasi_id}
                                onChange={(e) => setData('lokasi_id', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Semua Lokasi</option>
                                {lokasiOptions.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.nama}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                Terapkan Filter
                            </button>
                        </div>
                    </form>
                </div>

                {/* Table Card */}
                <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 text-xs">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">No</th>
                                    <th className="p-2 text-left">Tanggal</th>
                                    <th className="p-2 text-left">Merek/Model</th>
                                    <th className="p-2 text-left">Kategori</th>
                                    <th className="p-2 text-left">Asal Lokasi</th>
                                    <th className="p-2 text-left">Kondisi</th>
                                    <th className="p-2 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {barangKembali.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-4 text-center text-gray-500">
                                            Tidak ada data barang kembali.
                                        </td>
                                    </tr>
                                ) : (
                                    barangKembali.data.map((transaksi, idx) => {
                                        // ✅ Pola ini sama persis dengan contoh Anda
                                        const nomor = barangKembali.from + idx;
                                        const firstItem = transaksi.details && transaksi.details.length > 0 ? transaksi.details[0] : null;

                                        return (
                                            <tr key={transaksi.id} className="border-b hover:bg-gray-50">
                                                <td className="p-2">{nomor}</td>
                                                <td className="p-2">{transaksi.tanggal}</td>
                                                <td className="p-2">
                                                    <span>
                                                        {firstItem?.barang?.model_barang?.merek?.nama || ''}{' '}
                                                        {firstItem?.barang?.model_barang?.nama || '(Tidak ada barang)'}
                                                    </span>
                                                    {/* Indikator jika barang lebih dari 1 */}
                                                    {transaksi.details.length > 1 && (
                                                        <span className="ml-2 text-[10px] text-gray-500 italic">
                                                            (+{transaksi.details.length - 1} lainnya)
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-2">{firstItem?.barang?.model_barang?.kategori?.nama || '-'}</td>
                                                <td className="p-2">{transaksi.lokasi?.nama || '-'}</td>
                                                {/* Kolom Kondisi spesifik untuk Barang Kembali */}
                                                <td className="p-2">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                            firstItem?.status_saat_kembali === 'bagus'
                                                                ? 'bg-green-100 text-green-800'
                                                                : firstItem?.status_saat_kembali === 'rusak'
                                                                  ? 'bg-red-100 text-red-800'
                                                                  : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                    >
                                                        {firstItem?.status_saat_kembali || '-'}
                                                    </span>
                                                </td>
                                                <td className="p-2 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            onClick={() => handleOpenDetailModal(transaksi)}
                                                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-900"
                                                        >
                                                            <EyeIcon className="h-3 w-3" />
                                                            Detail
                                                        </button>
                                                        {/* Tambahkan tombol aksi lain jika perlu */}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <BarangKembaliDetailModal show={isModalOpen} onClose={handleCloseModal} barangKembali={selectedItem} />
        </AppLayout>
    );
}

// Reusing the same icons from previous example
function PlusIcon(props) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    );
}
