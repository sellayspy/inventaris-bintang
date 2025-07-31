import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import React, { useState } from 'react';

export default function BarangMasukCreate() {
    const { kategoriList, asalList, merekList, modelList } = usePage().props as unknown as {
        kategoriList: Array<{ id: number; nama: string }>;
        asalList: Array<{ id: number; nama: string }>;
        merekList: string[];
        modelList: string[];
    };

    const kategoriOptions = kategoriList.map((item) => item.nama);
    const asalOptions = asalList.map((item) => item.nama);

    const [serialNumbers, setSerialNumbers] = useState<string[]>(['']);

    const { data, setData, post, processing, errors } = useForm({
        tanggal: '',
        kategori: '',
        merek: '',
        model: '',
        name: '',
        asal_barang: '',
        serial_numbers: [''],
    });

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
        const updated = serialNumbers.filter((_, i) => i !== index);
        setSerialNumbers(updated);
        setData('serial_numbers', updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/barang-masuk');
    };

    return (
        <AppLayout>
            <div className="rounded-lg bg-white p-6 shadow-md">
                <h1 className="mb-6 text-2xl font-bold text-gray-700">Tambah Barang Masuk</h1>

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
                        <label className="block text-sm font-medium text-gray-700">Asal Barang</label>
                        <input
                            type="text"
                            list="asal-suggest"
                            className="mt-1 w-full rounded border p-2"
                            value={data.asal_barang}
                            onChange={(e) => setData('asal_barang', e.target.value)}
                        />
                        <datalist id="asal-suggest">
                            {asalOptions.map((a) => (
                                <option key={a} value={a} />
                            ))}
                        </datalist>
                        {errors.asal_barang && <p className="text-sm text-red-500">{errors.asal_barang}</p>}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-red-700">
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

                    <div className="pt-4 md:col-span-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            Simpan Barang Masuk
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
