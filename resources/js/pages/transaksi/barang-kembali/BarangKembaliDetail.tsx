import { X } from 'lucide-react'; // Contoh import icon
import { useEffect } from 'react';

export default function BarangKembaliDetailModal({ show, barangKembali, onClose }) {
    useEffect(() => {
        // Logika untuk menutup modal dengan tombol 'Escape'
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    if (!show) {
        return null;
    }

    const formattedDate = new Date(barangKembali?.tanggal).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 transition-opacity duration-300 ease-out"
            style={{ opacity: show ? 1 : 0 }}
        >
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            <div
                className="relative z-10 w-full max-w-4xl transform rounded-lg bg-white p-6 shadow-xl transition-all duration-300 ease-out"
                style={{ transform: show ? 'scale(1)' : 'scale(0.95)' }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Modal */}
                <div className="flex items-start justify-between border-b border-gray-200 pb-4">
                    <div>
                        {/* ✅ Teks disesuaikan */}
                        <h3 className="text-xl font-bold text-gray-900">Detail Transaksi Barang Kembali</h3>
                        <p className="mt-1 text-sm text-gray-500">Menampilkan informasi lengkap dari sebuah transaksi pengembalian.</p>
                    </div>
                    <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="mt-6 space-y-6">
                    {/* Informasi Umum Transaksi */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-3">
                        <div>
                            <p className="text-sm text-gray-500">Tanggal Transaksi</p>
                            <p className="font-semibold text-gray-800">{formattedDate}</p>
                        </div>
                        <div>
                            {/* ✅ Teks disesuaikan */}
                            <p className="text-sm text-gray-500">Asal Lokasi</p>
                            <p className="font-semibold text-gray-800">{barangKembali.lokasi?.nama || '-'}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Diinput oleh</p>
                            <p className="font-semibold text-gray-800">{barangKembali.user?.name || '-'}</p>
                        </div>
                    </div>

                    {/* Daftar Barang */}
                    <div>
                        <p className="text-md mb-2 font-semibold text-gray-700">Rincian Barang yang Dikembalikan:</p>
                        <div className="overflow-hidden rounded-lg border border-gray-200">
                            <div className="max-h-64 overflow-y-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="sticky top-0 z-10 bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Model</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Merek</th>
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Serial Number
                                            </th>
                                            {/* ✅ Kolom status disesuaikan */}
                                            <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                                Kondisi Saat Kembali
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {!barangKembali.details || barangKembali.details.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="py-4 text-center text-sm text-gray-500">
                                                    Tidak ada data barang.
                                                </td>
                                            </tr>
                                        ) : (
                                            barangKembali.details.map((detail, index) => (
                                                <tr key={detail.id}>
                                                    <td className="px-4 py-3 text-sm text-gray-500">{index + 1}</td>
                                                    <td className="px-4 py-3 text-sm font-medium text-gray-800">
                                                        {detail.barang?.model_barang?.nama || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {detail.barang?.model_barang?.merek?.nama || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 font-mono text-sm text-gray-700">
                                                        {detail.barang?.serial_number || '-'}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-600">
                                                        {/* ✅ Data dan style badge disesuaikan untuk kondisi */}
                                                        <span
                                                            className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                                                detail.status_saat_kembali === 'bagus'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : detail.status_saat_kembali === 'rusak'
                                                                      ? 'bg-red-100 text-red-800'
                                                                      : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                        >
                                                            {detail.status_saat_kembali}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Modal */}
                <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
