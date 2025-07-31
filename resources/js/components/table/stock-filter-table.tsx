import { router } from '@inertiajs/react';
import React from 'react';
import StockTable from './stock-table';

type Props = {
    title: string;
    route: string;
    filters: {
        kategori_id?: string;
        lokasi_id?: string;
        search?: string;
    };
    kategoriList: Array<{ id: number; nama: string }>;
    lokasiList: Array<{ id: number; nama: string }>;
    items: Array<{
        id: number;
        jenis_barang: string;
        kategori: string;
        lokasi: string;
        jumlah: number;
    }>;
};

export default function StockFilterTable({ title, route, filters, kategoriList, lokasiList, items }: Props) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const newFilters = {
            ...filters,
            [e.target.name]: e.target.value,
        };

        router.get(route, newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <div className="p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>

            <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                <select
                    name="kategori_id"
                    value={filters.kategori_id || ''}
                    onChange={handleChange}
                    className="rounded-lg border p-2 dark:bg-zinc-800 dark:text-white"
                >
                    <option value="">Semua Kategori</option>
                    {kategoriList.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.nama}
                        </option>
                    ))}
                </select>

                <select
                    name="lokasi_id"
                    value={filters.lokasi_id || ''}
                    onChange={handleChange}
                    className="rounded-lg border p-2 dark:bg-zinc-800 dark:text-white"
                >
                    <option value="">Semua Lokasi</option>
                    {lokasiList.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.nama}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    name="search"
                    value={filters.search || ''}
                    onChange={handleChange}
                    placeholder="Cari jenis barang..."
                    className="rounded-lg border p-2 dark:bg-zinc-800 dark:text-white"
                />
            </div>

            <StockTable title={title} items={items} />
        </div>
    );
}
