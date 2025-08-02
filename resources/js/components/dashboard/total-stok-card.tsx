interface Props {
    tersedia: number;
    rusak: number;
    perbaikan: number;
    total: number;
}

export default function TotalStokCard({ tersedia, rusak, perbaikan, total }: Props) {
    return (
        <div className="w-full rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
            <h2 className="mb-3 text-lg font-medium">Total Stok Gudang</h2>
            <div className="grid gap-2 text-sm">
                <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                    <span className="flex items-center gap-2">📦 Total Barang</span>
                    <span className="font-medium">{total}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                    <span className="flex items-center gap-2">✅ Tersedia</span>
                    <span className="font-medium">{tersedia}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                    <span className="flex items-center gap-2">🔧 Dalam Perbaikan</span>
                    <span className="font-medium">{perbaikan}</span>
                </div>
                <div className="flex justify-between rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700">
                    <span className="flex items-center gap-2">❌ Rusak</span>
                    <span className="font-medium">{rusak}</span>
                </div>
            </div>
        </div>
    );
}
