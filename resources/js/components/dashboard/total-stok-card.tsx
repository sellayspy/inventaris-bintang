interface Props {
    tersedia: number;
    rusak: number;
    perbaikan: number;
    total: number;
}

export default function TotalStokCard({ tersedia, rusak, perbaikan, total }: Props) {
    return (
        <div className="w-full transform rounded-2xl bg-white p-4 shadow transition duration-300 ease-in-out hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-semibold">Total Stok Gudang</h2>
            <div className="space-y-1 text-sm">
                <p>📦 Total Barang: {total}</p>
                <p>✅ Tersedia: {tersedia}</p>
                <p>🔧 Dalam Perbaikan: {perbaikan}</p>
                <p>❌ Rusak: {rusak}</p>
            </div>
        </div>
    );
}
