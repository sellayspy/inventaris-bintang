import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowRight, PackagePlus, Truck, Undo2 } from 'lucide-react';

const cards = [
    {
        title: 'Barang Masuk',
        description: 'Catat semua barang yang masuk ke gudang.',
        href: '/barang-masuk',
        color: 'bg-green-600',
        icon: <PackagePlus className="h-10 w-10 text-white opacity-90" />,
    },
    {
        title: 'Barang Keluar',
        description: 'Kelola distribusi barang keluar.',
        href: '/barang-keluar',
        color: 'bg-blue-600',
        icon: <Truck className="h-10 w-10 text-white opacity-90" />,
    },
    {
        title: 'Barang Kembali',
        description: 'Data barang yang kembali dari distribusi.',
        href: '/barang-kembali',
        color: 'bg-yellow-500',
        icon: <Undo2 className="h-10 w-10 text-white opacity-90" />,
    },
];

export default function TransaksiIndex() {
    return (
        <AppLayout>
            <Head title="Transaksi" />

            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Transaksi</h1>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {cards.map((card) => (
                        <Link
                            key={card.href}
                            href={card.href}
                            className={`group block rounded-xl p-6 text-white shadow transition duration-200 hover:shadow-lg ${card.color}`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    {card.icon}
                                    <h2 className="text-xl font-semibold">{card.title}</h2>
                                    <p className="text-sm opacity-90">{card.description}</p>
                                </div>
                                <ArrowRight className="mt-2 h-6 w-6 opacity-80 transition group-hover:translate-x-1" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
