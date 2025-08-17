interface Rak {
    kode_rak?: string;
}

interface DetailBarang {
    id: number;
    serial_number: string;
    status: string;
    rak?: Rak;
}

interface Item {
    merek?: string;
    model?: string;
}

interface DetailStokModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: Item;
    details: DetailBarang[];
    isLoading: boolean;
}

export function DetailStokModal({ isOpen, onClose, item, details, isLoading }: DetailStokModalProps) {
    if (!isOpen) return null;

    const getStatusBadge = (status: string) => {
        const statusClasses = {
            bagus: 'bg-green-100 text-green-800',
            baik: 'bg-green-100 text-green-800',
            rusak: 'bg-red-100 text-red-800',
            diperbaiki: 'bg-yellow-100 text-yellow-800',
        };
        return `rounded px-1.5 py-0.5 text-xs ${statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800'}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="w-full max-w-3xl rounded-lg bg-white shadow-lg">
                {/* Header */}
                <div className="flex items-center justify-between border-b p-3">
                    <h3 className="font-medium text-gray-800">
                        Detail Stok: {item?.merek} {item?.model}
                    </h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] overflow-y-auto p-4">
                    {isLoading ? (
                        <p className="text-center text-gray-500">Memuat data...</p>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-3 py-1.5 text-left font-medium text-gray-600">No</th>
                                    <th className="px-3 py-1.5 text-left font-medium text-gray-600">Serial Number</th>
                                    <th className="px-3 py-1.5 text-left font-medium text-gray-600">Status</th>
                                    <th className="px-3 py-1.5 text-left font-medium text-gray-600">Rak</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {details?.length > 0 ? (
                                    details.map((barang, index) => (
                                        <tr key={barang.id}>
                                            <td className="px-3 py-2">{index + 1}</td>
                                            <td className="px-3 py-2 font-mono">{barang.serial_number}</td>
                                            <td className="px-3 py-2">
                                                <span className={getStatusBadge(barang.status)}>{barang.status}</span>
                                            </td>
                                            <td className="px-3 py-2">{barang.rak?.kode_rak || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-4 text-center text-gray-500">
                                            Tidak ada detail barang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t bg-gray-50 p-3 text-right">
                    <button onClick={onClose} className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
