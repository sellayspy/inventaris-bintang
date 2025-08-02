import React from 'react';

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    barang: {
        id: number;
        name: string;
        serial_number: string;
        status: string;
        kondisi_awal: string;
        merek: string;
        model: string;
        kategori: string;
        rak: string;
        baris: string;
        kode_rak: string;
        lokasi: string;
        asal: string;
    };
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, barang }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-2xl">
                {/* Content with animated tabs */}
                <div className="p-6">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Left Column */}
                        <div className="space-y-5">
                            <DetailCard
                                icon={
                                    <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                        />
                                    </svg>
                                }
                                title="Informasi Barang"
                            >
                                <DetailItem label="Nama Barang" value={barang.name} />
                                <DetailItem label="Serial Number" value={barang.serial_number} copyable />
                                <DetailItem label="Status" value={barang.status} badge />
                                <DetailItem label="Kondisi Awal" value={barang.kondisi_awal} />
                            </DetailCard>

                            <DetailCard
                                icon={
                                    <svg className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                }
                                title="Asal Barang"
                            >
                                <DetailItem label="Asal Barang" value={barang.asal} />
                            </DetailCard>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-5">
                            <DetailCard
                                icon={
                                    <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                        />
                                    </svg>
                                }
                                title="Spesifikasi"
                            >
                                <DetailItem label="Kategori" value={barang.kategori} />
                                <DetailItem label="Merek" value={barang.merek} />
                                <DetailItem label="Model" value={barang.model} />
                            </DetailCard>

                            <DetailCard
                                icon={
                                    <svg className="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                }
                                title="Lokasi Penyimpanan"
                            >
                                <DetailItem label="Rak" value={barang.rak} />
                                <DetailItem label="Baris" value={barang.baris} />
                                <DetailItem label="Kode Rak" value={barang.kode_rak} />
                                <DetailItem label="Lokasi" value={barang.lokasi} />
                            </DetailCard>
                        </div>
                    </div>
                </div>

                {/* Footer with action button */}
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex justify-end">
                        <button
                            onClick={onClose}
                            className="flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 font-medium text-white shadow-md hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailModal;

// Reusable Detail Card Component
const DetailCard = ({ icon, title, children }) => (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50">{icon}</div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="space-y-4">{children}</div>
    </div>
);

// Enhanced Detail Item Component
const DetailItem = ({ label, value, badge = false, copyable = false }) => (
    <div className="flex items-start justify-between">
        <div>
            <p className="text-xs font-medium tracking-wider text-gray-500 uppercase">{label}</p>
            {badge ? (
                <span
                    className={`mt-1 inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        value === 'Baik' ? 'bg-green-100 text-green-800' : value === 'Rusak' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}
                >
                    {value}
                </span>
            ) : (
                <p className="mt-1 text-sm font-medium text-gray-800">{value || '-'}</p>
            )}
        </div>
        {copyable && (
            <button
                className="text-gray-400 hover:text-blue-500"
                onClick={() => {
                    navigator.clipboard.writeText(value);
                    // Add toast notification here if needed
                }}
            >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                    />
                </svg>
            </button>
        )}
    </div>
);
