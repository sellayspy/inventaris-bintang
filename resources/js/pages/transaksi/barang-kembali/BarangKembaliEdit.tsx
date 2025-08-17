import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

// Definisikan tipe data props yang lebih lengkap
interface Lokasi {
    id: number;
    nama: string;
}

interface BarangKembaliData {
    id: number;
    tanggal: string;
    lokasi: string;
    kategori: string;
    merek: string;
    model: string;
    serial_numbers: string[];
    kondisi_map: Record<string, string>;
}

interface PageProps {
    barangKembali: BarangKembaliData;
    lokasiList: Lokasi[];
    kategoriList: Array<{ id: number; nama: string }>;
    merekList: Array<{ id: number; nama: string }>;
    modelList: Array<{ id: number; nama: string }>;
}

export default function BarangKembaliEdit() {
    // Ambil semua props yang diperlukan
    const { barangKembali, lokasiList, kategoriList, merekList, modelList } = usePage<PageProps>().props;

    // Inisialisasi useForm dengan semua data
    const { data, setData, put, processing, errors } = useForm({
        tanggal: barangKembali.tanggal,
        lokasi: barangKembali.lokasi,
        kategori: barangKembali.kategori,
        merek: barangKembali.merek,
        model: barangKembali.model,
        serial_numbers: barangKembali.serial_numbers,
        kondisi_map: barangKembali.kondisi_map,
    });

    // State untuk input serial number
    const [serialNumbers, setSerialNumbers] = useState<string[]>(barangKembali.serial_numbers);

    // State untuk opsi dropdown dinamis
    const [availableSerials, setAvailableSerials] = useState<string[]>([]);
    const [kategoriOptions, setKategoriOptions] = useState(kategoriList);
    const [merekOptions, setMerekOptions] = useState(merekList);
    const [modelOptions, setModelOptions] = useState(modelList);

    // -- KEMBALIKAN LOGIKA useEffect UNTUK FILTER --
    useEffect(() => {
        const lokasi = lokasiList.find((l) => l.nama === data.lokasi);
        if (lokasi) {
            // Fetch Kategori berdasarkan lokasi
            fetch(`/api/kategori-by-lokasi/${lokasi.id}`)
                .then((res) => res.json())
                .then(setKategoriOptions);
        }
    }, [data.lokasi]);

    useEffect(() => {
        const lokasi = lokasiList.find((l) => l.nama === data.lokasi);
        if (lokasi && data.kategori) {
            // Fetch Merek berdasarkan lokasi dan kategori
            fetch(`/api/merek-by-kategori/${lokasi.id}/${encodeURIComponent(data.kategori)}`)
                .then((res) => res.json())
                .then(setMerekOptions);
        }
    }, [data.lokasi, data.kategori]);

    useEffect(() => {
        const lokasi = lokasiList.find((l) => l.nama === data.lokasi);
        if (lokasi && data.merek) {
            // Fetch Model berdasarkan lokasi dan merek
            fetch(`/api/model-by-merek/${lokasi.id}/${encodeURIComponent(data.merek)}`)
                .then((res) => res.json())
                .then(setModelOptions);
        }
    }, [data.lokasi, data.merek]);

    useEffect(() => {
        const lokasi = lokasiList.find((l) => l.nama === data.lokasi);
        if (lokasi && data.model) {
            // Fetch Serial Number berdasarkan lokasi dan model
            fetch(`/api/serial-by-model/${lokasi.id}/${encodeURIComponent(data.model)}`)
                .then((res) => res.json())
                .then((serialsFromServer) => {
                    const allPossibleSerials = [...new Set([...serialsFromServer, ...barangKembali.serial_numbers])];
                    setAvailableSerials(allPossibleSerials);
                });
        }
    }, [data.lokasi, data.model]);

    // Handler untuk input serial number (tidak berubah)
    const handleSerialChange = (index: number, value: string) => {
        const updatedSerials = [...serialNumbers];
        const oldSerial = updatedSerials[index];
        updatedSerials[index] = value;

        const oldKondisi = data.kondisi_map[oldSerial] || 'bagus';
        const updatedKondisiMap = { ...data.kondisi_map };
        delete updatedKondisiMap[oldSerial];
        if (value) updatedKondisiMap[value] = oldKondisi;

        setSerialNumbers(updatedSerials);
        setData('serial_numbers', updatedSerials);
        setData('kondisi_map', updatedKondisiMap);
    };

    const addSerialField = () => setSerialNumbers([...serialNumbers, '']);

    const removeSerialField = (index: number) => {
        const serialToRemove = serialNumbers[index];
        const updatedSerials = serialNumbers.filter((_, i) => i !== index);

        const updatedKondisiMap = { ...data.kondisi_map };
        delete updatedKondisiMap[serialToRemove];

        setSerialNumbers(updatedSerials);
        setData('serial_numbers', updatedSerials);
        setData('kondisi_map', updatedKondisiMap);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('barang-kembali.update', barangKembali.id), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <div className="rounded bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-semibold">Edit Transaksi Barang Kembali</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* --- AKTIFKAN KEMBALI SEMUA FORM INPUT --- */}
                    <div>
                        <label className="block font-semibold">Tanggal</label>
                        <input
                            type="date"
                            className="w-full rounded border px-3 py-2"
                            value={data.tanggal}
                            onChange={(e) => setData('tanggal', e.target.value)}
                        />
                        {errors.tanggal && <p className="text-sm text-red-500">{errors.tanggal}</p>}
                    </div>

                    <div>
                        <label className="block font-semibold">Lokasi Distribusi</label>
                        <input
                            list="lokasiOptions"
                            className="w-full rounded border px-3 py-2"
                            value={data.lokasi}
                            onChange={(e) => setData('lokasi', e.target.value)}
                        />
                        <datalist id="lokasiOptions">
                            {lokasiList.map((lokasi) => (
                                <option key={lokasi.id} value={lokasi.nama} />
                            ))}
                        </datalist>
                        {errors.lokasi && <p className="text-sm text-red-500">{errors.lokasi}</p>}
                    </div>

                    <div>
                        <label className="block font-semibold">Kategori Barang</label>
                        <input
                            list="kategoriOptions"
                            className="w-full rounded border px-3 py-2"
                            value={data.kategori}
                            onChange={(e) => setData('kategori', e.target.value)}
                        />
                        <datalist id="kategoriOptions">
                            {kategoriOptions.map((kategori) => (
                                <option key={kategori.id} value={kategori.nama} />
                            ))}
                        </datalist>
                        {errors.kategori && <p className="text-sm text-red-500">{errors.kategori}</p>}
                    </div>

                    <div>
                        <label className="block font-semibold">Merek Barang</label>
                        <input
                            list="merekOptions"
                            className="w-full rounded border px-3 py-2"
                            value={data.merek}
                            onChange={(e) => setData('merek', e.target.value)}
                        />
                        <datalist id="merekOptions">
                            {merekOptions.map((merek) => (
                                <option key={merek.id} value={merek.nama} />
                            ))}
                        </datalist>
                        {errors.merek && <p className="text-sm text-red-500">{errors.merek}</p>}
                    </div>

                    <div>
                        <label className="block font-semibold">Model Barang</label>
                        <input
                            list="modelOptions"
                            className="w-full rounded border px-3 py-2"
                            value={data.model}
                            onChange={(e) => setData('model', e.target.value)}
                        />
                        <datalist id="modelOptions">
                            {modelOptions.map((model) => (
                                <option key={model.id} value={model.nama} />
                            ))}
                        </datalist>
                        {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                    </div>

                    {/* Serial Number dan Kondisi */}
                    <div className="col-span-1 md:col-span-2">
                        <label className="block font-semibold text-gray-800">Serial Number & Kondisi</label>
                        {serialNumbers.map((serial, index) => (
                            <div key={index} className="mb-2 flex flex-wrap items-center gap-2">
                                <div className="flex-grow">
                                    <input
                                        list={`serialNumberList-${index}`}
                                        className="w-full rounded border px-3 py-2"
                                        value={serial}
                                        onChange={(e) => handleSerialChange(index, e.target.value)}
                                        placeholder={`Serial Number #${index + 1}`}
                                    />
                                    <datalist id={`serialNumberList-${index}`}>
                                        {availableSerials
                                            .filter((sn) => !serialNumbers.includes(sn) || sn === serial)
                                            .map((sn) => (
                                                <option key={sn} value={sn} />
                                            ))}
                                    </datalist>
                                </div>
                                <select
                                    className="rounded border px-2 py-2"
                                    value={data.kondisi_map[serial] || 'bagus'}
                                    onChange={(e) => setData('kondisi_map', { ...data.kondisi_map, [serial]: e.target.value })}
                                >
                                    <option value="bagus">Bagus</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="diperbaiki">Diperbaiki</option>
                                </select>
                                <button type="button" className="text-red-600 hover:text-red-800" onClick={() => removeSerialField(index)}>
                                    ✕
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addSerialField} className="mt-2 text-sm text-blue-600 hover:underline">
                            + Tambah Serial
                        </button>
                        {errors.serial_numbers && <p className="text-sm text-red-500">{errors.serial_numbers}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="col-span-1 flex gap-4 md:col-span-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Perbarui Transaksi
                        </button>
                        <Link href={route('barang-kembali.index')} className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
