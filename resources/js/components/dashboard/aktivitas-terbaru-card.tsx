interface Aktivitas {
    tanggal: string;
    keterangan: string;
}

export default function AktivitasTerbaruCard({ title, data }: { title: string; data: Aktivitas[] }) {
    return (
        <div className="w-full rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-gray-800/90">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
                {title}
            </h2>

            {data.length === 0 ? (
                <div className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">Tidak ada data.</div>
            ) : (
                <ul className="space-y-2">
                    {data.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-start gap-3 rounded-lg bg-gray-50 px-3 py-2 transition-colors hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                        >
                            <div className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-500 dark:bg-blue-900/50 dark:text-blue-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-medium dark:text-gray-100">{item.keterangan}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.tanggal}</div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
