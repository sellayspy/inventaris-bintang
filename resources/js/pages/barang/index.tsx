import Pagination from '@/components/table/pagination';
import AppLayout from '@/layouts/app-layout';
import { Link, router, usePage } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { useCallback, useEffect, useRef, useState } from 'react';
import ModalEditBarang from './edit';
import DetailModal from './show';

export default function BarangIndex() {
    const { barangList, filters, kategoriOptions, rakOptions } = usePage().props as any;
    const [dropUp, setDropUp] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const [search, setSearch] = useState(filters.search || '');
    const [kategori, setKategori] = useState(filters.kategori_id || '');
    const [rak, setRak] = useState(filters.rak_id || '');

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedBarang, setSelectedBarang] = useState(null);

    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedDetailBarang, setSelectedDetailBarang] = useState<any>(null);

    const handleShowDetail = async (id: number) => {
        const res = await fetch(`/barang/${id}/json`);
        const data = await res.json();

        setSelectedDetailBarang(data);
        setShowDetailModal(true);
    };

    const handleEdit = (barang: any) => {
        setSelectedBarang(barang);
        setShowEditModal(true);
    };

    const updateFilter = useCallback(
        debounce((searchVal, kategoriVal, rakVal) => {
            router.get(
                route('barang.index'),
                { search: searchVal, kategori_id: kategoriVal, rak_id: rakVal },
                { preserveState: true, replace: true },
            );
        }, 300),
        [],
    );

    // Trigger filter otomatis saat search/filter berubah
    useEffect(() => {
        updateFilter(search, kategori, rak);
    }, [search, kategori, rak]);

    // Reset semua filter
    const resetFilter = () => {
        setSearch('');
        setKategori('');
        setRak('');
        router.get(route('barang.index'), {}, { preserveState: false, replace: true });
    };

    useEffect(() => {
        const button = buttonRef.current;
        if (open && button) {
            const rect = button.getBoundingClientRect();
            const spaceAbove = rect.top;
            const spaceBelow = window.innerHeight - rect.bottom;

            if (spaceBelow < 150 && spaceAbove > 180) {
                setDropUp(true);
            } else {
                setDropUp(false);
            }
        }
    }, [open]);

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-4 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <h1 className="text-2xl font-bold">Daftar Barang</h1>
                    <Link
                        href={route('barang-masuk.create')}
                        className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + Tambah Barang
                    </Link>
                </div>

                <div className="mb-4 grid grid-cols-1 items-end gap-4 md:grid-cols-4">
                    <input
                        type="text"
                        placeholder="Cari serial / model..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded border px-3 py-2"
                    />

                    <select value={kategori} onChange={(e) => setKategori(e.target.value)} className="rounded border px-3 py-2">
                        <option value="">Filter Kategori</option>
                        {kategoriOptions.map((item: any) => (
                            <option key={item.id} value={item.id}>
                                {item.nama}
                            </option>
                        ))}
                    </select>

                    <select value={rak} onChange={(e) => setRak(e.target.value)} className="rounded border px-3 py-2">
                        <option value="">Filter Rak</option>
                        {rakOptions.map((item: any) => (
                            <option key={item.id} value={item.id}>
                                {item.nama}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={resetFilter}
                        className="w-full rounded bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                    >
                        Reset Filter
                    </button>
                </div>

                <div className="z-90 overflow-x-auto rounded-lg bg-white shadow">
                    <table className="min-w-full text-sm">
                        <thead className="relative min-w-full overflow-visible bg-gray-100 text-sm text-gray-600">
                            <tr>
                                <th className="px-4 py-2">No</th>
                                <th className="px-4 py-2">Serial</th>
                                <th className="px-4 py-2">Model</th>
                                <th className="px-4 py-2">Merek</th>
                                <th className="px-4 py-2">Kategori</th>
                                <th className="px-4 py-2">Rak</th>
                                <th className="px-4 py-2">Kondisi</th>
                                <th className="px-4 py-2 text-center">Aksi</th>
                            </tr>
                        </thead>

                        <tbody className="relative divide-y overflow-visible">
                            {barangList.data.map((barang: any, index: number) => {
                                const dropdownRef = useRef<HTMLDivElement>(null);
                                const [open, setOpen] = useState(false);

                                useEffect(() => {
                                    const handleClickOutside = (event: MouseEvent) => {
                                        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                                            setOpen(false);
                                        }
                                    };
                                    document.addEventListener('mousedown', handleClickOutside);
                                    return () => {
                                        document.removeEventListener('mousedown', handleClickOutside);
                                    };
                                }, []);

                                return (
                                    <tr key={barang.id}>
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{barang.serial_number}</td>
                                        <td className="px-4 py-2">{barang.model}</td>
                                        <td className="px-4 py-2">{barang.merek}</td>
                                        <td className="px-4 py-2">{barang.kategori}</td>
                                        <td className="px-4 py-2">{barang.rak}</td>
                                        <td className="px-4 py-2">{barang.kondisi_awal}</td>
                                        <td className="relative px-4 py-2 text-center">
                                            <div ref={dropdownRef} className="inline-block text-left">
                                                <button
                                                    ref={buttonRef}
                                                    onClick={() => setOpen(!open)}
                                                    className="inline-flex items-center rounded bg-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-300"
                                                >
                                                    Selengkapnya
                                                    <svg
                                                        className="ml-2 h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {open && (
                                                    <div
                                                        className={`ring-opacity-5 absolute z-50 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ${
                                                            dropUp ? 'bottom-full mb-2' : 'top-full mt-2'
                                                        } left-1/2 -translate-x-1/2`}
                                                    >
                                                        <div className="py-1 text-sm text-gray-700">
                                                            <button
                                                                onClick={() => handleShowDetail(barang.id)}
                                                                className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4 text-gray-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                                                    />
                                                                </svg>
                                                                Detail
                                                            </button>

                                                            <button
                                                                onClick={() => handleEdit(barang)}
                                                                className="flex w-full items-center gap-2 px-4 py-2 text-left hover:bg-gray-100"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4 text-blue-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M15.232 5.232l3.536 3.536M9 13l6-6m-2 8h2a2 2 0 002-2v-2m-6 6h6"
                                                                    />
                                                                </svg>
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    confirm('Yakin hapus?') && router.delete(route('barang.destroy', barang.id))
                                                                }
                                                                className="flex w-full items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                                                            >
                                                                <svg
                                                                    className="h-4 w-4 text-red-500"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                                Hapus
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {barangList.data.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="py-4 text-center text-gray-500">
                                        Tidak ada data ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {showEditModal && selectedBarang && (
                    <ModalEditBarang
                        show={showEditModal}
                        onClose={() => setShowEditModal(false)}
                        barang={selectedBarang}
                        kategoriList={kategoriOptions}
                        rakList={rakOptions}
                    />
                )}

                {showDetailModal && selectedDetailBarang && (
                    <DetailModal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} barang={selectedDetailBarang} />
                )}

                <div className="mt-4">
                    <Pagination links={barangList.links} />
                </div>
            </div>
        </AppLayout>
    );
}
