interface BarangKritis {
    nama: string;
    lokasi: string;
    tersedia: number;
}

export default function StokKritisCard({ data }: { data: BarangKritis[] }) {
    return (
        <div className="w-full rounded-xl border-l-4 border-yellow-500 bg-yellow-50 p-5 shadow-sm transition-all hover:shadow-md dark:border-yellow-600 dark:bg-gray-800/50">
            <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">⚠️</span>
                <h2 className="text-lg font-medium text-yellow-700 dark:text-yellow-400">Stok Kritis</h2>
            </div>

            {data.length === 0 ? (
                <p className="rounded-lg bg-yellow-100/50 px-3 py-2 text-sm text-yellow-700 dark:bg-gray-700 dark:text-yellow-300">
                    Tidak ada barang kritis.
                </p>
            ) : (
                <ul className="grid gap-2">
                    {data.map((item, i) => (
                        <li
                            key={i}
                            className="rounded-lg bg-yellow-100/50 px-3 py-2 text-sm transition-colors hover:bg-yellow-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <div className="flex justify-between">
                                <span className="font-medium text-yellow-900 dark:text-yellow-200">{item.nama}</span>
                                <span className="text-yellow-700 dark:text-yellow-300">{item.tersedia} unit</span>
                            </div>
                            <div className="text-xs text-yellow-600 dark:text-yellow-400/80">Lokasi: {item.lokasi}</div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
