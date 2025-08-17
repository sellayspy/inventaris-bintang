import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { Package, RefreshCw, RotateCcw, Upload } from 'lucide-react';

type Summary = {
    barang_masuk: number;
    barang_keluar: number;
    barang_kembali: number;
    mutasi_barang: number;
};

type Props = {
    summary: Summary;
};

export default function Index({ summary }: Props) {
    const cards = [
        {
            title: 'Barang Masuk',
            value: summary.barang_masuk,
            icon: <Package className="h-6 w-6" />,
            url: '/laporan/masuk',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            title: 'Barang Keluar',
            value: summary.barang_keluar,
            icon: <Upload className="h-6 w-6" />,
            url: '/laporan/keluar',
            color: 'bg-green-50 text-green-600',
        },
        {
            title: 'Barang Kembali',
            value: summary.barang_kembali,
            icon: <RotateCcw className="h-6 w-6" />,
            url: '/laporan/kembali',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            title: 'Mutasi Barang',
            value: summary.mutasi_barang,
            icon: <RefreshCw className="h-6 w-6" />,
            url: '/laporan/mutasi',
            color: 'bg-orange-50 text-orange-600',
        },
    ];

    return (
        <AppLayout>
            <div className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.url}
                        className={`rounded-xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md ${card.color}`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">{card.title}</h2>
                                <p className="mt-2 text-2xl font-bold">{card.value}</p>
                                <p className="mt-1 text-sm opacity-70">barang</p>
                            </div>
                            <div className="bg-opacity-50 rounded-lg bg-white p-3">{card.icon}</div>
                        </div>
                    </Link>
                ))}
            </div>
        </AppLayout>
    );
}
