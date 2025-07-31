interface LokasiStok {
    lokasi: string;
    tersedia: number;
    rusak: number;
    perbaikan: number;
}

export default function StokPerLokasiCard({ data }: { data: LokasiStok[] }) {
    return (
        <div className="w-full transform rounded-2xl bg-white p-4 shadow transition duration-300 ease-in-out hover:scale-[1.02] hover:border-blue-500 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
            <h2 className="mb-2 text-lg font-semibold">📍 Stok Per Lokasi</h2>
            <ul className="space-y-1 text-sm">
                {data.map((item, i) => (
                    <li key={i}>
                        <strong>{item.lokasi}:</strong> {item.tersedia} tersedia, {item.perbaikan} perbaikan, {item.rusak} rusak
                    </li>
                ))}
            </ul>
        </div>
    );
}
