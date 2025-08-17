import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

// Tipe untuk data yang diterima dari controller
interface BarangKeluarData {
    id: number;
    tanggal: string;
    lokasi: string;
    kategori: string;
    merek: string;
    model: string;
    serial_numbers: string[];
    status_keluar: Record<string, string>; // e.g. { "SN123": "dijual", "SN456": "dipinjamkan" }
}

interface PageProps {
    barangKeluar: BarangKeluarData;
    lokasiList: Array<{ id: number; nama: string }>;
    serialNumberList: Record<string, string[]>;
    // Daftar lain tetap sama seperti di halaman create
    kategoriList: Array<{ id: number; nama: string }>;
    merekList: Array<{ id: number; nama: string; model_barang: any[] }>;
    modelList: Array<{ id: number; nama: string; merek_id: number; jenis?: { kategori_id: number } }>;
}

export default function BarangKeluarEdit() {
    // 1. Ambil data 'barangKeluar' dari props
    const { barangKeluar, lokasiList, serialNumberList, kategoriList, merekList, modelList } = usePage<PageProps>().props;

    // 2. Inisialisasi useForm dengan data yang ada
    const { data, setData, put, processing, errors } = useForm({
        tanggal: barangKeluar.tanggal,
        kategori: barangKeluar.kategori,
        merek: barangKeluar.merek,
        model: barangKeluar.model,
        lokasi: barangKeluar.lokasi,
        serial_numbers: barangKeluar.serial_numbers,
        status_keluar: barangKeluar.status_keluar,
    });

    // 2. Inisialisasi state lokal dengan data yang ada
    const [serialNumbers, setSerialNumbers] = useState<string[]>(barangKeluar.serial_numbers);
    const [statusKeluarList, setStatusKeluarList] = useState<string[]>(
        barangKeluar.serial_numbers.map((sn) => barangKeluar.status_keluar[sn] || 'dipinjamkan'),
    );

    const lokasiOptions = lokasiList.map((item) => item.nama);
    const kategoriOptions = kategoriList.map((item) => item.nama);

    const selectedKey = `${data.merek}|${data.model}`;
    // Daftar serial yang tersedia + yang sudah terpilih di transaksi ini
    const availableSerials = [...(serialNumberList[selectedKey] || []), ...barangKeluar.serial_numbers];

    const handleSerialChange = (value: string, index: number) => {
        const updatedSerials = [...serialNumbers];
        updatedSerials[index] = value;
        setSerialNumbers(updatedSerials);

        const newStatusMap: Record<string, string> = {};
        updatedSerials.forEach((sn, i) => {
            if (sn) newStatusMap[sn] = statusKeluarList[i];
        });

        setData((prev) => ({
            ...prev,
            serial_numbers: updatedSerials,
            status_keluar: newStatusMap,
        }));
    };

    const handleStatusChange = (value: string, index: number) => {
        const updatedStatusList = [...statusKeluarList];
        updatedStatusList[index] = value;
        setStatusKeluarList(updatedStatusList);

        const serial = serialNumbers[index];
        if (serial) {
            setData('status_keluar', {
                ...data.status_keluar,
                [serial]: value,
            });
        }
    };

    const addSerialField = () => {
        setSerialNumbers([...serialNumbers, '']);
        setStatusKeluarList([...statusKeluarList, 'dipinjamkan']);
    };

    const removeSerialField = (index: number) => {
        const newSerials = serialNumbers.filter((_, i) => i !== index);
        const newStatusList = statusKeluarList.filter((_, i) => i !== index);

        const newStatusMap: Record<string, string> = {};
        newSerials.forEach((sn, i) => {
            if (sn) newStatusMap[sn] = newStatusList[i];
        });

        setSerialNumbers(newSerials);
        setStatusKeluarList(newStatusList);
        setData('serial_numbers', newSerials);
        setData('status_keluar', newStatusMap);
    };

    // 3. Ubah handleSubmit untuk menggunakan 'put'
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('barang-keluar.update', barangKeluar.id), {
            preserveScroll: true,
        });
    };

    // Logika filter dropdown sama seperti sebelumnya
    const selectedKategori = kategoriList.find((k) => k.nama === data.kategori);
    const selectedMerek = merekList.find((m) => m.nama === data.merek);
    const filteredMerekList = merekList.filter((m) => m.model_barang.some((model: any) => model.jenis?.kategori_id === selectedKategori?.id));
    const filteredModelList = modelList.filter((model) => model.merek_id === selectedMerek?.id && model.jenis?.kategori_id === selectedKategori?.id);

    return (
        <AppLayout>
            <div className="rounded-lg bg-white p-6 shadow-md">
                {/* 4. Ubah Teks & UI */}
                <h1 className="mb-6 text-2xl font-bold text-gray-700">Edit Transaksi Barang Keluar</h1>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                    {/* Input Tanggal */}
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

                    {/* Input Kategori, Merek, Model, Lokasi (form fields sama seperti create) */}
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
                            {filteredMerekList.map((merek) => (
                                <option key={merek.id} value={merek.nama} />
                            ))}
                        </datalist>
                        {errors.merek && <p className="text-sm text-red-500">{errors.merek}</p>}
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
                            {filteredModelList.map((model) => (
                                <option key={model.id} value={model.nama} />
                            ))}
                        </datalist>
                        {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tujuan Distribusi</label>
                        <input
                            type="text"
                            list="lokasi-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.lokasi}
                            onChange={(e) => setData('lokasi', e.target.value)}
                        />
                        <datalist id="lokasi-suggest">
                            {lokasiOptions.map((l) => (
                                <option key={l} value={l} />
                            ))}
                        </datalist>
                        {errors.lokasi && <p className="text-sm text-red-500">{errors.lokasi}</p>}
                    </div>

                    {/* Bagian Serial Number */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-red-700">
                            Serial Number <span className="text-xs text-red-400">(wajib)</span>
                        </label>

                        {serialNumbers.map((serial, index) => (
                            <div key={index} className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 rounded border-2 border-red-400 bg-red-50 p-2"
                                        value={serial}
                                        onChange={(e) => handleSerialChange(e.target.value, index)}
                                        placeholder={`Serial #${index + 1}`}
                                        list={`serialNumberSuggestions-${index}`}
                                    />
                                    <datalist id={`serialNumberSuggestions-${index}`}>
                                        {/* Filter agar serial yang sudah dipilih di baris lain tidak muncul */}
                                        {[...new Set(availableSerials)]
                                            .filter((sn) => !serialNumbers.includes(sn) || sn === serial)
                                            .map((sn) => (
                                                <option key={sn} value={sn} />
                                            ))}
                                    </datalist>
                                    {serialNumbers.length > 1 && (
                                        <button
                                            type="button"
                                            className="text-sm text-red-600 hover:underline"
                                            onClick={() => removeSerialField(index)}
                                        >
                                            Hapus
                                        </button>
                                    )}
                                </div>
                                <div>
                                    <select
                                        value={statusKeluarList[index]}
                                        onChange={(e) => handleStatusChange(e.target.value, index)}
                                        className="w-full rounded border-2 border-blue-400 bg-blue-50 p-2"
                                    >
                                        <option value="dipinjamkan">Dipinjamkan</option>
                                        <option value="dijual">Dijual</option>
                                    </select>
                                </div>
                            </div>
                        ))}

                        <button type="button" className="mt-1 text-sm text-blue-600 hover:underline" onClick={addSerialField}>
                            + Tambah Serial
                        </button>
                        {errors.serial_numbers && <p className="text-sm text-red-500">{errors.serial_numbers}</p>}
                    </div>

                    {/* Tombol Aksi */}
                    <div className="flex gap-4 pt-4 md:col-span-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Perbarui Transaksi
                        </button>
                        <Link href={route('barang-keluar.index')} className="rounded bg-gray-400 px-6 py-2 text-white hover:bg-gray-500">
                            Kembali
                        </Link>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
