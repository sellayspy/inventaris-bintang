import { Tags } from 'lucide-react';

export default function KategoriJenisRingkasanCard({ totalKategori, totalJenisBarang }: { totalKategori: number; totalJenisBarang: number }) {
    return (
        <div className="dark:bg-sidebar-background transform rounded-xl border bg-white p-4 shadow-sm transition duration-300 ease-in-out hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold">
                <Tags className="h-5 w-5 text-yellow-600" />
                Kategori & Jenis Barang
            </h2>
            <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <div>
                    <span className="font-medium">Total Kategori:</span> {totalKategori}
                </div>
                <div>
                    <span className="font-medium">Total Jenis Barang:</span> {totalJenisBarang}
                </div>
            </div>
        </div>
    );
}
