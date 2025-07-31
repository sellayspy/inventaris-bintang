import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function BarangKeluarCreate() {
    const { kategoriList, lokasiList, merekList, modelList, serialNumberList } = usePage().props as unknown as {
        kategoriList: Array<{ id: number; nama: string }>;
        lokasiList: Array<{ id: number; nama: string }>;
        merekList: string[];
        modelList: string[];
        serialNumberList: string[];
    };

    const kategoriOptions = kategoriList.map((item) => item.nama);
    const lokasiOptions = lokasiList.map((item) => item.nama);

    const [serialNumbers, setSerialNumbers] = useState<string[]>(['']);
    const [statusKeluarList, setStatusKeluarList] = useState<string[]>(['dipinjamkan']);

    const { data, setData, post, processing, errors } = useForm<{
        tanggal: string;
        kategori: string;
        merek: string;
        model: string;
        name: string;
        lokasi: string;
        serial_numbers: string[];
        status_keluar: Record<string, string>; // ✅ fix here
    }>({
        tanggal: '',
        kategori: '',
        merek: '',
        model: '',
        name: '',
        lokasi: '',
        serial_numbers: [''],
        status_keluar: {},
    });

    const handleSerialChange = (value: string, index: number) => {
        if (isDuplicateSerial(value, index)) {
            alert(`Serial number "${value}" sudah diinput sebelumnya.`);
            return;
        }

        const updated = [...serialNumbers];
        updated[index] = value;
        setSerialNumbers(updated);
        setData('serial_numbers', updated);

        const newStatusMap = { ...data.status_keluar };
        newStatusMap[value] = statusKeluarList[index] ?? 'dipinjamkan';
        setData('status_keluar', newStatusMap);
    };

    const handleStatusChange = (value: string, index: number) => {
        const updated = [...statusKeluarList];
        updated[index] = value;
        setStatusKeluarList(updated);

        // sinkronisasi dengan serial yang sesuai
        const serial = serialNumbers[index];
        const newStatusMap = { ...data.status_keluar };
        newStatusMap[serial] = value;
        setData('status_keluar', newStatusMap);
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
            newStatusMap[sn] = newStatusList[i] ?? 'dipinjamkan';
        });

        setSerialNumbers(newSerials);
        setStatusKeluarList(newStatusList);
        setData('serial_numbers', newSerials);
        setData('status_keluar', newStatusMap);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const hasDuplicate = serialNumbers.some((sn, i) => serialNumbers.indexOf(sn) !== i);

        if (hasDuplicate) {
            alert('Terdapat serial number yang sama. Mohon periksa kembali.');
            return;
        }

        post('/barang-keluar');
    };

    const isDuplicateSerial = (value: string, index: number) => {
        return serialNumbers.some((sn, i) => sn === value && i !== index);
    };

    return (
        <AppLayout>
            <div className="rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-700">Tambah Barang Keluar</h1>

                <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
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
                            {merekList.map((merek, index) => (
                                <option key={index} value={merek} />
                            ))}
                        </datalist>
                        {errors.merek && <p className="text-sm text-red-500">{errors.merek}</p>}
                    </div>

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
                            {modelList.map((model, index) => (
                                <option key={index} value={model} />
                            ))}
                        </datalist>
                        {errors.model && <p className="text-sm text-red-500">{errors.model}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nama Barang</label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded border p-2"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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
                                        list="serialNumberSuggestions" // 👈 ini
                                    />
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
                                        value={statusKeluarList[index] ?? 'dipinjamkan'}
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

                    {/* 🔧 Tambahkan datalist ini di bawah input */}
                    <datalist id="serialNumberSuggestions">
                        {serialNumberList
                            .filter((sn) => !serialNumbers.includes(sn)) // HANYA yang belum dipilih
                            .map((sn, i) => (
                                <option key={i} value={sn} />
                            ))}
                    </datalist>

                    <div className="pt-4 md:col-span-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Simpan Barang Keluar
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
