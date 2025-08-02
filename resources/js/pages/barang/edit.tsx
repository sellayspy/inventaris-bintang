// resources/js/Components/ModalEditBarang.tsx
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface Barang {
    id: number;
    name: string;
    serial_number: string;
    rak_id: number;
    kondisi_awal: string;
    kategori_id: number;
    merek: string;
    model: string;
    jenis_barang_id: number;
}

interface Jenis {
    merek: string;
    model: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
    barang: Barang;
    kategoriList: Array<{ id: number; nama: string }>;
    rakList: Array<{
        id: number;
        nama_rak: string;
        baris: string;
        kode_rak: string;
    }>;
}

export default function ModalEditBarang({ show, onClose, barang, kategoriList, rakList }: Props) {
    console.log('🧾 kategoriList:', kategoriList);
    const { data, setData, put, processing, errors } = useForm({
        name: barang.name || '',
        serial_number: barang.serial_number || '',
        kondisi_awal: barang.kondisi_awal || '',
        jenis_barang_id: barang.jenis_barang_id || '',
        kategori_id: barang.kategori_id || '',
        rak_id: barang.rak_id || '',
        merek: barang.merek || '', // ✅ ini penting
        model: barang.model || '',
    });

    useEffect(() => {
        if (barang.kategori_id && !data.kategori_id) {
            console.log('⛏ Memasukkan kategori_id dari barang ke form:', barang.kategori_id);
            setData('kategori_id', barang.kategori_id);
        }
    }, [barang.kategori_id]);

    const [jenisList, setJenisList] = useState<Jenis[]>([]);
    const [rakTerpilih, setRakTerpilih] = useState('');
    const [barisOptions, setBarisOptions] = useState<string[]>([]);
    const [barisTerpilih, setBarisTerpilih] = useState<string>('');

    const [kodeOtomatis, setKodeOtomatis] = useState('');

    useEffect(() => {
        if (data.kategori_id) {
            fetch(`/kategori/${data.kategori_id}/jenis`)
                .then((res) => res.json())
                .then(setJenisList)
                .catch(() => setJenisList([]));
        }
    }, [data.kategori_id]);

    useEffect(() => {
        if (show && barang.rak_id && rakList.length > 0) {
            const rak = rakList.find((r) => r.id === barang.rak_id);
            if (rak) {
                setRakTerpilih(rak.nama_rak);
                const relatedBaris = rakList.filter((r) => r.nama_rak === rak.nama_rak).map((r) => r.baris); // baris memang string

                setBarisOptions(relatedBaris);
                setBarisTerpilih(rak.baris); // tetap string
                setKodeOtomatis(rak.kode_rak);
            }
        }
    }, [show, barang.rak_id, rakList]);

    const uniqueMerek = [...new Set(jenisList.map((j) => j.merek))];
    const modelByMerek = jenisList.filter((j) => j.merek === data.merek).map((j) => j.model);

    const handleRakChange = (rakNama: string) => {
        setRakTerpilih(rakNama);

        const barisList = rakList.filter((rak) => rak.nama_rak === rakNama && rak.baris).map((rak) => rak.baris);

        setBarisOptions(barisList);
        setBarisTerpilih('');
        setKodeOtomatis('');
        setData('rak_id', '');
    };

    const handleBarisChange = (baris: string) => {
        const barisTrimmed = baris.trim(); // buang spasi
        setBarisTerpilih(barisTrimmed);

        const rak = rakList.find((r) => r.nama_rak === rakTerpilih && String(r.baris).trim() === barisTrimmed);

        if (rak) {
            setKodeOtomatis(rak.kode_rak);
            setData('rak_id', rak.id);
        } else {
            setKodeOtomatis('');
            setData('rak_id', '');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('barang.update', barang.id), {
            onSuccess: () => onClose(),
        });
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">Edit Barang</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Form fields with improved styling */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Serial Number</label>
                        <input
                            value={data.serial_number}
                            readOnly
                            onChange={(e) => setData('serial_number', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm read-only:cursor-default read-only:bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.serial_number && <p className="mt-1 text-sm text-red-600">{errors.serial_number}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                        <input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                        <select
                            value={data.kategori_id || ''}
                            onChange={(e) => setData('kategori_id', parseInt(e.target.value))}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Pilih Kategori</option>
                            {kategoriList.map((k) => (
                                <option key={k.id} value={k.id}>
                                    {k.nama}
                                </option>
                            ))}
                        </select>
                        {errors.kategori_id && <p className="mt-1 text-sm text-red-600">{errors.kategori_id}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Merek</label>
                        <select
                            value={data.merek}
                            onChange={(e) => {
                                setData('merek', e.target.value);
                                setData('model', '');
                            }}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Pilih Merek</option>
                            {uniqueMerek.map((m, i) => (
                                <option key={i} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        {errors.merek && <p className="mt-1 text-sm text-red-600">{errors.merek}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <select
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Pilih Model</option>
                            {modelByMerek.map((m, i) => (
                                <option key={i} value={m}>
                                    {m}
                                </option>
                            ))}
                        </select>
                        {errors.model && <p className="mt-1 text-sm text-red-600">{errors.model}</p>}
                    </div>

                    {/* Nama Rak */}
                    <div>
                        <label htmlFor="namaRak" className="block text-sm font-medium text-gray-700">
                            Nama Rak
                        </label>
                        <select
                            id="namaRak"
                            value={rakTerpilih}
                            onChange={(e) => handleRakChange(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="">Pilih Rak</option>
                            {[...new Set(rakList.map((rak) => rak.nama_rak))].map((rakNama) => (
                                <option key={rakNama} value={rakNama}>
                                    {rakNama}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Baris */}
                    {rakTerpilih && (
                        <div>
                            <label htmlFor="barisRak" className="block text-sm font-medium text-gray-700">
                                Baris
                            </label>
                            <select
                                id="barisRak"
                                value={barisTerpilih}
                                onChange={(e) => handleBarisChange(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">Pilih Baris</option>
                                {barisOptions.map((baris) => (
                                    <option key={baris} value={baris}>
                                        {baris}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Kode Rak (readonly) */}
                    {kodeOtomatis && (
                        <div>
                            <label htmlFor="kodeRak" className="block text-sm font-medium text-gray-700">
                                Kode Rak
                            </label>
                            <input
                                id="kodeRak"
                                type="text"
                                value={kodeOtomatis}
                                readOnly
                                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm read-only:cursor-default read-only:bg-gray-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    <div className="space-y-2 md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Kondisi Awal</label>
                        <input
                            value={data.kondisi_awal}
                            onChange={(e) => setData('kondisi_awal', e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                        {errors.kondisi_awal && <p className="mt-1 text-sm text-red-600">{errors.kondisi_awal}</p>}
                    </div>

                    <div className="flex justify-end space-x-4 md:col-span-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
