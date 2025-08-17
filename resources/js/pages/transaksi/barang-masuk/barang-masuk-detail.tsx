export default function DetailBarangMasukModal({ show, onClose, barang }) {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="relative w-full max-w-4xl transform rounded-lg bg-white p-6 shadow-xl transition-all">
                {/* Header Modal */}
                <div className="flex items-start justify-between border-b pb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Detail Barang Masuk</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                {/* Body Modal */}
                <div className="mt-4 space-y-4">
                    {/* Info Utama */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="font-semibold text-gray-700">Tanggal Masuk</p>
                            <p className="text-gray-600">{barang?.tanggal || '-'}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Asal Barang</p>
                            <p className="text-gray-600">{barang?.asal?.nama || '-'}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Merek & Model</p>
                            <p className="text-gray-600">
                                {`${barang?.details[0]?.barang.model_barang.merek.nama || ''} ${barang?.details[0]?.barang.model_barang.nama || ''}`.trim() ||
                                    '-'}
                            </p>
                        </div>
                        <div>
                            <p className="font-semibold text-gray-700">Diinput Oleh</p>
                            <p className="text-gray-600">{barang?.user?.name || '-'}</p>
                        </div>
                    </div>

                    {/* Daftar Serial Number */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700">Daftar Item & Serial Number</p>
                        <div className="mt-2 max-h-48 overflow-y-auto rounded-md border">
                            <ul className="divide-y divide-gray-200">
                                {barang?.details?.map((detail, index) => (
                                    <li key={detail.id} className="px-3 py-2 text-sm text-gray-800">
                                        {index + 1}. SN: <span className="rounded bg-gray-100 px-1 font-mono">{detail.barang.serial_number}</span>
                                    </li>
                                )) || <li>Tidak ada detail item.</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="mt-6 flex justify-end border-t pt-4">
                    <button onClick={onClose} className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
