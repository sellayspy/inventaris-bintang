import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { EyeIcon } from 'lucide-react';
import { useState } from 'react';
import { DetailStokModal } from './detail';

interface StokItem {
    kategori: string;
    label: string;
    merek: string;
    model: string;
    jumlah_rusak: number;
    jumlah_perbaikan: number;
    jumlah_tersedia: number;
    jumlah_total: number;
    model_id: number;
}

interface FilterItem {
    id: number;
    nama: string;
}

interface Props {
    stokBarang: {
        data: StokItem[];
        links: any[];
        meta: {
            current_page: number;
            last_page: number;
        };
    };
    filters: {
        search: string;
        kategori: string;
        merek: string;
        lokasi: string;
    };
    kategoriList: FilterItem[];
    merekList: FilterItem[];
    lokasiList: FilterItem[];
}

export default function Index({ stokBarang, filters, kategoriList, merekList, lokasiList }: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<StokItem | null>(null);
    const [detailData, setDetailData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleShowDetail = async (item: StokItem) => {
        setSelectedItem(item);
        setIsModalOpen(true);
        setIsLoading(true);
        setDetailData([]);

        try {
            // Pastikan Anda sudah memiliki route dengan nama ini
            const response = await fetch(route('api.stok-gudang.detail', { modelBarang: item.model_id }));

            if (!response.ok) throw new Error('Network response was not ok.');
            const data = await response.json();
            setDetailData(data);
        } catch (error) {
            console.error('Gagal mengambil data detail:', error);
        } finally {
            setIsLoading(false);
        }
    };

    function updateQuery(params: Partial<typeof filters>) {
        router.get(
            route('stok-gudang.index'),
            { ...filters, ...params },
            {
                preserveState: true,
                replace: true,
            },
        );
    }

    return (
        <AppLayout>
            <div className="p-4">
                {/* Simplified Header */}
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Stok Gudang</h1>
                        <p className="text-gray-600">Data semua model barang di gudang.</p>
                    </div>

                    {/* Export Button - Simplified */}
                    <a
                        href={route('stock.gudang.exportPdf', filters)}
                        target="_blank"
                        className="inline-flex items-center rounded bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                        </svg>
                        Ekspor PDF
                    </a>
                </div>

                {/* Simplified Filters */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <input
                        type="text"
                        placeholder="Cari nama barang..."
                        value={filters.search}
                        onChange={(e) => updateQuery({ search: e.target.value })}
                        className="rounded border border-gray-300 px-2.5 py-1 text-sm"
                    />
                    <select
                        value={filters.kategori}
                        onChange={(e) => updateQuery({ kategori: e.target.value })}
                        className="rounded border border-gray-300 px-2.5 py-1 text-sm"
                    >
                        <option value="">Semua Kategori</option>
                        {kategoriList.map((k) => (
                            <option key={k.id} value={k.id}>
                                {k.nama}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.merek}
                        onChange={(e) => updateQuery({ merek: e.target.value })}
                        className="rounded border border-gray-300 px-2.5 py-1 text-sm"
                    >
                        <option value="">Semua Merek</option>
                        {merekList.map((m) => (
                            <option key={m.id} value={m.id}>
                                {m.nama}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.lokasi}
                        onChange={(e) => updateQuery({ lokasi: e.target.value })}
                        className="rounded border border-gray-300 px-2.5 py-1 text-sm"
                    >
                        <option value="">Semua Lokasi</option>
                        {lokasiList.map((l) => (
                            <option key={l.id} value={l.id}>
                                {l.nama}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Simplified Table */}
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">No</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Kategori</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Nama Barang</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-600">Merek Model</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Stok</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Rusak</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Diperbaiki</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Sisa</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {stokBarang.data.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">{idx + 1}</td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">{item.kategori}</td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">{item.label}</td>
                                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-700">
                                        {item.merek} {item.model}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                        <span className="inline-block rounded bg-green-100 px-1.5 text-xs text-green-800">{item.jumlah_total}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                        <span className="inline-block rounded bg-red-100 px-1.5 text-xs text-red-800">{item.jumlah_rusak}</span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                        <span className="inline-block rounded bg-yellow-100 px-1.5 text-xs text-yellow-800">
                                            {item.jumlah_perbaikan}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm font-medium whitespace-nowrap text-gray-900">
                                        {item.jumlah_tersedia}
                                    </td>
                                    <td className="px-4 py-3 text-center text-sm whitespace-nowrap">
                                        <button
                                            onClick={() => handleShowDetail(item)}
                                            className="text-blue-600 hover:text-blue-800"
                                            title="Lihat Detail"
                                        >
                                            <EyeIcon className="h-5 w-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Simplified Pagination */}
                <div className="mt-3 flex justify-end gap-1">
                    {stokBarang.links.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => link.url && router.visit(link.url)}
                            disabled={!link.url}
                            className={`rounded px-2.5 py-1 text-xs ${link.active ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>

            {/* Simplified Modal */}
            <DetailStokModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
                details={detailData}
                isLoading={isLoading}
            />
        </AppLayout>
    );
}
