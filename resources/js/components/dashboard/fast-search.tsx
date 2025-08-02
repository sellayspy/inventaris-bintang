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
            if (query.length >= 2) {
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
        <div className="relative mx-auto w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    className="focus:ring-opacity-50 w-full rounded-lg border border-gray-300 p-3 pr-10 text-sm shadow-sm transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Cari barang berdasarkan serial, merek, atau model..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)}
                />
                {isLoading && (
                    <div className="absolute top-3 right-3">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {isFocused && (suggestions.length > 0 || isLoading) && (
                <ul className="absolute z-10 mt-2 w-full overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition-all duration-200">
                    {isLoading && suggestions.length === 0 ? (
                        <li className="p-3 text-center text-sm text-gray-500">Mencari...</li>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((item) => (
                            <li
                                key={item.id}
                                className="cursor-pointer border-b border-gray-100 p-3 text-sm transition-colors duration-150 last:border-b-0 hover:bg-blue-50"
                                onMouseDown={() => handleSelect(item.id)}
                            >
                                <div className="font-medium text-gray-900">{item.serial_number}</div>
                                <div className="text-gray-600">
                                    {item.merek} {item.model}
                                </div>
                            </li>
                        ))
                    ) : query.length >= 2 ? (
                        <li className="p-3 text-center text-sm text-gray-500">Tidak ditemukan</li>
                    ) : null}
                </ul>
            )}

            <Modal show={showModal} onClose={() => setShowModal(false)}>
                {loadingDetail ? (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <div className="flex flex-col items-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                            <p className="mt-3 text-gray-600">Memuat data...</p>
                        </div>
                    </div>
                ) : selectedBarang ? (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-800">Informasi Barang</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Nama Barang</h3>
                                <p className="text-gray-900">{selectedBarang.nama_barang}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Serial Number</h3>
                                <p className="text-gray-900">{selectedBarang.serial_number}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Merek</h3>
                                <p className="text-gray-900">{selectedBarang.merek}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Model</h3>
                                <p className="text-gray-900">{selectedBarang.model}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Asal</h3>
                                <p className="text-gray-900">{selectedBarang.asal}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Kondisi</h3>
                                <p className="text-gray-900">{selectedBarang.kondisi}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <p className="text-gray-900">{selectedBarang.status}</p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm font-medium text-gray-500">Lokasi Rak</h3>
                                <p className="text-gray-900">
                                    {selectedBarang.rak.nama_rak} ({selectedBarang.rak.kode_rak}) - Baris {selectedBarang.rak.baris}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex min-h-[200px] items-center justify-center">
                        <div className="text-center">
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
                                    strokeWidth={2}
                                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <p className="mt-2 text-gray-600">Data tidak ditemukan</p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
