import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Package, Truck, Warehouse, Wrench } from 'lucide-react';

interface StockSummary {
    gudang: number;
    distribusi: number;
    rusak: number;
    perbaikan: number;
    total: number;
}

import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@inertiajs/core';

interface StockPageProps extends PageProps {
    summary: StockSummary;
}

export default function StockIndex() {
    const { summary } = usePage<StockPageProps>().props;

    const stockCards = [
        {
            title: 'Stok Gudang',
            description: 'Barang tersedia di gudang',
            value: summary.gudang,
            icon: <Warehouse className="h-8 w-8 text-indigo-600" />,
            link: '/stok/gudang',
        },
        {
            title: 'Stok Distribusi',
            description: 'Barang sudah didistribusikan',
            value: summary.distribusi,
            icon: <Truck className="h-8 w-8 text-green-600" />,
            link: '/stok/distribusi',
        },
        {
            title: 'Stok Perbaikan',
            description: 'Barang sedang diperbaiki',
            value: summary.perbaikan,
            icon: <Wrench className="h-8 w-8 text-yellow-600" />,
            link: '/stok/perbaikan',
        },
        {
            title: 'Stok Rusak',
            description: 'Barang dalam kondisi rusak',
            value: summary.rusak,
            icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
            link: '/stok/rusak',
        },
        {
            title: 'Total Barang',
            description: 'Total seluruh barang tercatat',
            value: summary.total,
            icon: <Package className="h-8 w-8 text-blue-600" />,
            link: '/stok/total',
        },
    ];

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">Manajemen Stok</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {stockCards.map((card, index) => (
                        <Link href={card.link} key={index} className="block">
                            <div className="rounded-2xl bg-white p-6 shadow-md transition duration-200 hover:shadow-lg hover:ring-2 hover:ring-indigo-400 dark:bg-zinc-800">
                                <div className="mb-2 flex items-center gap-4">
                                    <div className="rounded-xl bg-gray-100 p-3 dark:bg-zinc-700">{card.icon}</div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{card.title}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-300">{card.description}</p>
                                    </div>
                                </div>
                                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{card.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
