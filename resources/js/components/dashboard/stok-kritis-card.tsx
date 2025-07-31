interface BarangKritis {
    nama: string;
    lokasi: string;
    tersedia: number;
}

export default function StokKritisCard({ data }: { data: BarangKritis[] }) {
    return (
        <div className="w-full transform rounded-2xl bg-yellow-100 p-4 shadow transition duration-300 ease-in-out hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-semibold text-yellow-700">⚠️ Stok Kritis</h2>
            {data.length === 0 ? (
                <p className="text-sm">Tidak ada barang kritis.</p>
            ) : (
                <ul className="space-y-1 text-sm">
                    {data.map((item, i) => (
                        <li key={i}>
                            {item.nama} di {item.lokasi} - {item.tersedia} unit
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
