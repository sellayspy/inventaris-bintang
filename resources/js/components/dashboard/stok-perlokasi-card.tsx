interface LokasiStok {
    lokasi: string;
    tersedia: number;
    rusak: number;
    perbaikan: number;
}

export default function StokPerLokasiCard({ data }: { data: LokasiStok[] }) {
    return (
        <div className="w-full rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800">
            <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </div>
                <h2 className="text-lg font-medium">Stok Per Lokasi</h2>
            </div>

            <ul className="space-y-3">
                {data.map((item, i) => (
                    <li
                        key={i}
                        className="rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/50"
                    >
                        <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{item.lokasi}</span>
                            <div className="flex gap-2 text-xs">
                                <span className="rounded-full bg-green-100 px-2 py-1 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                    {item.tersedia} tersedia
                                </span>
                                <span className="rounded-full bg-yellow-100 px-2 py-1 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                                    {item.perbaikan} perbaikan
                                </span>
                                <span className="rounded-full bg-red-100 px-2 py-1 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                                    {item.rusak} rusak
                                </span>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
