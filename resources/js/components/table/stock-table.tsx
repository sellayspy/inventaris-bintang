export default function StockTable({
    title,
    items,
}: {
    title: string;
    items: Array<{
        id: number;
        jenis_barang: string;
        kategori: string;
        lokasi: string;
        jumlah: number;
    }>;
}) {
    return (
        <div className="p-6">
            <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">{title}</h1>
            <div className="overflow-x-auto rounded-xl bg-white shadow-md dark:bg-zinc-800">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-gray-100 text-gray-600 dark:bg-zinc-700 dark:text-gray-300">
                        <tr>
                            <th className="px-4 py-3">Jenis Barang</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Lokasi</th>
                            <th className="px-4 py-3 text-right">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-zinc-600">
                        {items.length > 0 ? (
                            items.map((item) => (
                                <tr key={item.id} className="transition hover:bg-gray-50 dark:hover:bg-zinc-700">
                                    <td className="px-4 py-3 text-gray-800 dark:text-gray-100">{item.jenis_barang}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.kategori}</td>
                                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{item.lokasi}</td>
                                    <td className="px-4 py-3 text-right font-semibold text-indigo-600 dark:text-indigo-400">{item.jumlah}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">
                                    Tidak ada data.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
