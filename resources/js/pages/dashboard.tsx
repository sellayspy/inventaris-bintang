import StokPerLokasiChart from '@/components/chart/stok-perlokasi-chart';
import StokSummaryChart from '@/components/chart/stok-summary-chart';
import AktivitasTerbaruCard from '@/components/dashboard/aktivitas-terbaru-card';
import FastSearch from '@/components/dashboard/fast-search';
import StokKondisiRingkasanCard from '@/components/dashboard/stok-kondisi-ringkasan-card';
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
        stokBaruSecondGudang: {
            baru: number;
            second: number;
        };
    };

    const {
        stokSummary,
        stokKritis = [],
        latestMasuk = [],
        latestKeluar = [],
        latestKembali = [],
        stokPerLokasi = [],
        stokBaruSecondGudang,
    } = usePage().props as unknown as DashboardProps;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-4">
                <FastSearch />
            </div>
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
                    <StokKondisiRingkasanCard stokBaru={stokBaruSecondGudang.baru} stokSecond={stokBaruSecondGudang.second} />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Ringkasan PieChart */}
                    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Ringkasan Stok</h2>
                        <StokSummaryChart data={stokSummary} />
                    </div>

                    {/* Stok per Lokasi BarChart */}
                    <div className="rounded-xl border border-gray-300 bg-white p-4 shadow-md dark:border-gray-700 dark:bg-gray-800">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-100">Stok per Lokasi</h2>
                        <StokPerLokasiChart data={stokPerLokasi} />
                    </div>
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
