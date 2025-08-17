import { useEffect, useState } from 'react';
import Modal from './modal-search-fast';

interface RakInfo {
    nama_rak: string;
    kode_rak: string;
    baris: string;
}

interface SuggestionItem {
    id: number;
    serial_number: string;
    nama_barang: string;
    merek: string;
    model: string;
    rak: string;
    kode_rak: string;
    baris: string;
}

interface BarangDetail {
    id: number;
    nama_barang: string;
    serial_number: string;
    merek: string;
    model: string;
    asal: string;
    kondisi: string;
    status: string;
    lokasi: string;
    rak: RakInfo;
    jumlah_tersedia: number;
}

export default function FastSearch() {
    const [query, setQuery] = useState<string>('');
    const [suggestions, setSuggestions] = useState<SuggestionItem[]>([]);
    const [selectedBarang, setSelectedBarang] = useState<BarangDetail | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.length >= 1) {
                setIsLoading(true);
                fetch(`/dashboard/fast-search?q=${encodeURIComponent(query)}`)
                    .then((res) => res.json())
                    .then((data) => {
                        setSuggestions(data.data);
                        setIsLoading(false);
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoading(false);
                    });
            } else {
                setSuggestions([]);
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleSelect = async (id: number) => {
        setLoadingDetail(true);

        try {
            const response = await fetch(`/dashboard/barang-detail/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setSelectedBarang(data);
            setShowModal(true);
        } catch (error) {
            console.error('Gagal ambil detail barang', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    return (
        <div className="mx-auto w-full max-w-md space-y-1">
            {/* Search Input */}
            <div className="relative">
                <input
                    type="text"
                    className="w-full rounded-xl border-0 bg-gray-50 p-4 pr-12 text-sm shadow-sm ring-1 ring-gray-200 transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    placeholder="Cari barang berdasarkan serial, merek, atau model..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                />
                {isLoading ? (
                    <div className="absolute top-1/2 right-3 -translate-y-1/2">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <svg
                        className="absolute top-1/2 right-3 h-5 w-5 -translate-y-1/2 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isFocused && (suggestions.length > 0 || isLoading) && (
                <ul className="absolute z-10 mt-1 max-h-80 w-full max-w-md overflow-auto rounded-xl bg-white p-2 shadow-lg ring-1 ring-gray-200 animate-in fade-in slide-in-from-top-1">
                    {isLoading && suggestions.length === 0 ? (
                        <li className="flex items-center justify-center p-3">
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                            <span className="text-sm text-gray-600">Mencari...</span>
                        </li>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((item) => (
                            <li
                                key={item.id}
                                className="cursor-pointer rounded-lg p-3 text-sm transition-colors duration-150 hover:bg-blue-50 active:bg-blue-100"
                                onMouseDown={() => handleSelect(item.id)}
                            >
                                <div className="font-medium text-gray-900">{item.serial_number}</div>
                                <div className="text-gray-600">
                                    {item.merek} {item.model}
                                </div>
                            </li>
                        ))
                    ) : query.length >= 1 ? (
                        <li className="p-3 text-center text-sm text-gray-500">Tidak ditemukan - coba kata kunci lain</li>
                    ) : (
                        <li className="p-3 text-center text-sm text-gray-500">Ketik untuk mencari barang</li>
                    )}
                </ul>
            )}

            {/* Modal */}
            <Modal show={showModal} onClose={() => setShowModal(false)}>
                <div className="p-6">
                    {loadingDetail ? (
                        <div className="flex min-h-[200px] flex-col items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-3 text-gray-600">Memuat data...</p>
                        </div>
                    ) : selectedBarang ? (
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedBarang.nama_barang}</h2>
                                    <p className="text-blue-600">{selectedBarang.serial_number}</p>
                                </div>
                                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                    {selectedBarang.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Spesifikasi</h3>
                                    <div className="mt-2 space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Merek</p>
                                            <p className="font-medium">{selectedBarang.merek}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Model</p>
                                            <p className="font-medium">{selectedBarang.model}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Kondisi</p>
                                            <p className="font-medium">{selectedBarang.kondisi}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="rounded-lg bg-gray-50 p-4">
                                    <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Lokasi</h3>
                                    <div className="mt-2 space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-500">Rak</p>
                                            <p className="font-medium">
                                                {selectedBarang.rak.nama_rak} ({selectedBarang.rak.kode_rak})
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Baris</p>
                                            <p className="font-medium">{selectedBarang.rak.baris}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Lokasi</p>
                                            <p className="font-medium">{selectedBarang.lokasi}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-lg bg-gray-50 p-4">
                                <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase">Informasi Tambahan</h3>
                                <div className="mt-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Asal</p>
                                        <p className="font-medium">{selectedBarang.asal}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex min-h-[200px] flex-col items-center justify-center text-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-lg font-medium text-gray-900">Data tidak ditemukan</h3>
                            <p className="mt-1 text-gray-500">Barang dengan detail tersebut tidak dapat ditemukan</p>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
