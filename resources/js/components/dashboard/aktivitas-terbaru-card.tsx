interface Aktivitas {
    tanggal: string;
    keterangan: string;
}

export default function AktivitasTerbaruCard({ title, data }: { title: string; data: Aktivitas[] }) {
    return (
        <div className="w-full transform rounded-2xl bg-white p-4 shadow transition duration-300 ease-in-out hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-semibold">{title}</h2>
            {data.length === 0 ? (
                <p className="text-sm">Tidak ada data.</p>
            ) : (
                <ul className="space-y-1 text-sm">
                    {data.map((item, i) => (
                        <li key={i}>
                            📅 {item.tanggal} - {item.keterangan}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
