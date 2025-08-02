import { Tags } from 'lucide-react';

export default function StokKondisiRingkasanCard({ stokBaru, stokSecond }: { stokBaru: number; stokSecond: number }) {
    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800/80">
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-300">
                    <Tags className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Stok Barang (Gudang)</h2>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-300">Barang Baru</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{stokBaru}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
                    <span className="text-gray-600 dark:text-gray-300">Barang Second</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">{stokSecond}</span>
                </div>
            </div>
        </div>
    );
}
