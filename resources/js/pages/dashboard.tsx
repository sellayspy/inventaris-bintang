import AktivitasTerbaruCard from '@/components/dashboard/aktivitas-terbaru-card';
import KategoriJenisRingkasanCard from '@/components/dashboard/kategori-jenis-ringkasan-card';
import StokKritisCard from '@/components/dashboard/stok-kritis-card';
import StokPerLokasiCard from '@/components/dashboard/stok-perlokasi-card';
import TotalStokCard from '@/components/dashboard/total-stok-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    type DashboardProps = {
        stokSummary: {
            tersedia: number;
            rusak: number;
            perbaikan: number;
            total: number;
        };
        stokKritis?: { nama: string; lokasi: string; tersedia: number }[];
        latestMasuk?: { tanggal: string; keterangan: string }[];
        latestKeluar?: { tanggal: string; keterangan: string }[];
        latestKembali?: { tanggal: string; keterangan: string }[];
        stokPerLokasi?: {
            lokasi: string;
            tersedia: number;
            rusak: number;
            perbaikan: number;
            total?: number;
        }[];
        totalKategori: number;
        totalJenisBarang: number;
    };

    const {
        stokSummary,
        stokKritis = [],
        latestMasuk = [],
        latestKeluar = [],
        latestKembali = [],
        stokPerLokasi = [],
        totalKategori,
        totalJenisBarang,
    } = usePage().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-col gap-6 p-4">
                {/* Kartu Atas */}
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    <TotalStokCard
                        tersedia={stokSummary?.tersedia}
                        rusak={stokSummary?.rusak}
                        perbaikan={stokSummary?.perbaikan}
                        total={stokSummary?.total}
                    />
                    <StokKritisCard data={stokKritis} />
                    <KategoriJenisRingkasanCard totalKategori={totalKategori} totalJenisBarang={totalJenisBarang} />
                </div>

                {/* Aktivitas Terbaru */}
                <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                    <AktivitasTerbaruCard title="Barang Masuk Terbaru" data={latestMasuk} />
                    <AktivitasTerbaruCard title="Barang Keluar Terbaru" data={latestKeluar} />
                    <AktivitasTerbaruCard title="Barang Kembali Terbaru" data={latestKembali} />
                </div>

                {/* Stok Per Lokasi */}
                <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
                    <StokPerLokasiCard data={stokPerLokasi} />
                </div>
            </div>
        </AppLayout>
    );
}
