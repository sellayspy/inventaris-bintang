import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Tipe untuk data yang diterima dari controller
interface PageProps {
    barangMasuk: {
        id: number;
        tanggal: string;
        kategori: string;
        merek: string;
        jenis_barang: string;
        model: string;
        asal_barang: string | null;
        serial_numbers: string[];
    };
    kategoriList: Array<{ id: number; nama: string }>;
    asalList: Array<{ id: number; nama: string }>;
    merekList: Array<{ id: number; nama: string }>;
    modelList: Array<{ id: number; nama: string }>;
    jenisList: Array<{ id: number; nama: string }>;
}

export default function BarangMasukEdit() {
    const { barangMasuk, kategoriList, asalList, merekList } = usePage<PageProps>().props;

    const kategoriOptions = kategoriList.map((item) => item.nama);
    const asalOptions = asalList.map((item) => item.nama);

    const [jenisOptions, setJenisOptions] = useState<string[]>([]);
    const [modelOptions, setModelOptions] = useState<string[]>([]);

    // Inisialisasi form dengan data yang sudah ada
    const { data, setData, put, processing, errors } = useForm({
        tanggal: barangMasuk.tanggal || '',
        kategori: barangMasuk.kategori || '',
        merek: barangMasuk.merek || '',
        model: barangMasuk.model || '',
        jenis_barang: barangMasuk.jenis_barang || '',
        asal_barang: barangMasuk.asal_barang || '',
        serial_numbers: barangMasuk.serial_numbers.length > 0 ? barangMasuk.serial_numbers : [''],
    });

    // State lokal untuk mengelola input serial number secara dinamis
    const [serialNumbers, setSerialNumbers] = useState<string[]>(data.serial_numbers);

    const handleSerialChange = (value: string, index: number) => {
        const updated = [...serialNumbers];
        updated[index] = value;
        setSerialNumbers(updated);
        setData('serial_numbers', updated);
    };

    const addSerialField = () => {
        const updated = [...serialNumbers, ''];
        setSerialNumbers(updated);
        setData('serial_numbers', updated);
    };

    const removeSerialField = (index: number) => {
        if (serialNumbers.length <= 1) return; // Jangan hapus jika hanya tersisa satu
        const updated = serialNumbers.filter((_, i) => i !== index);
        setSerialNumbers(updated);
        setData('serial_numbers', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Menggunakan method PUT untuk update, dengan menyertakan ID
        put(route('barang-masuk.update', barangMasuk.id), {
            preserveScroll: true,
        });
    };

    // useEffect untuk mengambil data Jenis Barang berdasarkan Kategori
    useEffect(() => {
        if (!data.kategori) return;
        fetch(`/ajax/jenis-barang?kategori=${encodeURIComponent(data.kategori)}`)
            .then((res) => res.json())
            .then((res) => setJenisOptions(res));
    }, [data.kategori]);

    // useEffect untuk mengambil data Model berdasarkan Kategori dan Merek
    useEffect(() => {
        if (!data.kategori || !data.merek) return;
        fetch(`/ajax/model-barang?kategori=${encodeURIComponent(data.kategori)}&merek=${encodeURIComponent(data.merek)}`)
            .then((res) => res.json())
            .then((res) => setModelOptions(res));
    }, [data.kategori, data.merek]);

    return (
        <AppLayout>
            <div className="rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">Edit Data Barang Masuk</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Tanggal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tanggal</label>
                        <input
                            type="date"
                            className="mt-1 w-full rounded border p-2"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                        />
                        {errors.tanggal && <p className="text-sm text-red-500">{errors.tanggal}</p>}
                    </div>

                    {/* Kategori */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Kategori</label>
                        <input
                            type="text"
                            list="kategori-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.kategori}
                            onChange={(e) => setData('kategori', e.target.value)}
                        />
                        <datalist id="kategori-suggest">
                            {kategoriOptions.map((k) => (
                                <option key={k} value={k} />
                            ))}
                        </datalist>
                        {errors.kategori && <p className="text-sm text-red-500">{errors.kategori}</p>}
                    </div>

                    {/* Merek */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Merek</label>
                        <input
                            type="text"
                            list="merek-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.merek}
                            onChange={(e) => setData('merek', e.target.value)}
                        />
                        <datalist id="merek-suggest">
                            {merekList.map((merek) => (
                                <option key={merek.id} value={merek.nama} />
                            ))}
                        </datalist>
                        {errors.merek && <p className="text-sm text-red-500">{errors.merek}</p>}
                    </div>

                    {/* Jenis Barang */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Jenis Barang</label>
                        <input
                            type="text"
                            list="jenis-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.jenis_barang}
                            onChange={(e) => setData('jenis_barang', e.target.value)}
                        />
                        <datalist id="jenis-suggest">
                            {jenisOptions.map((j) => (
                                <option key={j} value={j} />
                            ))}
                        </datalist>
                        {errors.jenis_barang && <p className="text-sm text-red-500">{errors.jenis_barang}</p>}
                    </div>

                    {/* Model */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Model</label>
                        <input
                            type="text"
                            list="model-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                        />
                        <datalist id="model-suggest">
                            {modelOptions.map((m) => (
                                <option key={m} value={m} />
                            ))}
                        </datalist>
                        {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                    </div>

                    {/* Asal Barang */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Asal Barang</label>
                        <input
                            type="text"
                            list="asal-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.asal_barang ?? ''}
                            onChange={(e) => setData('asal_barang', e.target.value)}
                        />
                        <datalist id="asal-suggest">
                            {asalOptions.map((a) => (
                                <option key={a} value={a} />
                            ))}
                        </datalist>
                        {errors.asal_barang && <p className="text-sm text-red-500">{errors.asal_barang}</p>}
                    </div>

                    {/* Serial Number (Full Width) */}
                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-semibold text-red-700">
                            Serial Number <span className="text-xs text-red-400">(wajib)</span>
                        </label>
                        {serialNumbers.map((serial, index) => (
                            <div key={index} className="mb-2 flex items-center gap-2">
                                <input
                                    type="text"
                                    className="flex-1 rounded border-2 border-red-400 bg-red-50 p-2"
                                    value={serial}
                                    onChange={(e) => handleSerialChange(e.target.value, index)}
                                    placeholder={`Serial #${index + 1}`}
                                />
                                {serialNumbers.length > 1 && (
                                    <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => removeSerialField(index)}>
                                        Hapus
                                    </button>
                                )}
                            </div>
                        ))}
                        <button type="button" className="mt-1 text-sm text-blue-600 hover:underline" onClick={addSerialField}>
                            + Tambah Serial
                        </button>
                        {errors.serial_numbers && <p className="text-sm text-red-500">{errors.serial_numbers}</p>}
                    </div>

                    {/* Submit Button (Full Width) */}
                    <div className="flex justify-end space-x-4 pt-4 md:col-span-2">
                        <Link href={route('barang-masuk.index')} className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600">
                            Kembali
                        </Link>

                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Perbarui Data
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
