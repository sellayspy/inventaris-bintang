import { Link, usePage } from '@inertiajs/react';
import { AlertTriangle, Package, ShoppingCart, Truck, Warehouse, Wrench } from 'lucide-react'; // Tambah ShoppingCart

interface StockSummary {
    gudang: number;
    distribusi: number;
    rusak: number;
    perbaikan: number;
    total: number;
    terjual: number;
}

import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import type { PageProps } from '@inertiajs/core';

interface StockPageProps extends PageProps {
    summary: StockSummary;
    auth: {
        permissions?: string[];
    };
}

export default function StockIndex() {
    const { auth, summary } = usePage<StockPageProps>().props;
    const userPermissions = auth.permissions || [];

    const stockCards = [
        {
            title: 'Stok Gudang',
            description: 'Barang tersedia di gudang',
            value: summary.gudang,
            icon: <Warehouse className="h-8 w-8 text-indigo-600" />,
            link: '/stok-gudang',
            permission: PERMISSIONS.VIEW_STOK_GUDANG,
        },
        {
            title: 'Stok Distribusi',
            description: 'Barang sudah didistribusikan',
            value: summary.distribusi,
            icon: <Truck className="h-8 w-8 text-green-600" />,
            link: '/stok-distribusi',
            permission: PERMISSIONS.VIEW_STOK_DISTRIBUSI,
        },
        {
            title: 'Stok Terjual',
            description: 'Barang yang telah terjual',
            value: summary.terjual,
            icon: <ShoppingCart className="h-8 w-8 text-pink-600" />,
            link: '/stok-terjual',
            permission: PERMISSIONS.VIEW_STOK_TERJUAL,
        },
        {
            title: 'Stok Perbaikan',
            description: 'Barang sedang diperbaiki',
            value: summary.perbaikan,
            icon: <Wrench className="h-8 w-8 text-yellow-600" />,
            link: '/perbaikan',
            permission: PERMISSIONS.VIEW_STOK_DIPERBAIKI,
        },
        {
            title: 'Stok Rusak',
            description: 'Barang dalam kondisi rusak',
            value: summary.rusak,
            icon: <AlertTriangle className="h-8 w-8 text-red-600" />,
            link: '/stock-rusak',
            permission: PERMISSIONS.VIEW_STOK_RUSAK,
        },
        {
            title: 'Total Barang',
            description: 'Total seluruh barang tercatat',
            value: summary.total,
            icon: <Package className="h-8 w-8 text-blue-600" />,
            link: '/total-stock',
            permission: PERMISSIONS.VIEW_STOK_TOTAL,
        },
    ];

    const visibleCards = stockCards.filter((card) => !card.permission || userPermissions.includes(card.permission));
    return (
        <AppLayout>
            <div className="p-4">
                <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">Manajemen Stok</h1>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {visibleCards.map((card, index) => (
                        <Link href={card.link} key={index} className="block">
                            <div className="rounded-lg bg-white p-4 shadow-sm transition duration-150 hover:shadow-md dark:bg-zinc-800">
                                <div className="mb-2 flex items-center gap-3">
                                    <div className="rounded-lg bg-gray-100 p-2 dark:bg-zinc-700">{card.icon}</div>
                                    <div>
                                        <h2 className="text-lg font-medium text-gray-800 dark:text-white">{card.title}</h2>
                                        <p className="text-xs text-gray-500 dark:text-gray-300">{card.description}</p>
                                    </div>
                                </div>
                                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{card.value}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
