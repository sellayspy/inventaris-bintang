import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

type Lokasi = {
    id: number;
    nama: string;
};

type ModelBarang = {
    id: number;
    nama: string;
    merek?: { nama: string };
    kategori?: { nama: string };
};

type StockOpnameForm = {
    tanggal: string;
    lokasi_id: string;
    catatan: string;
    details: {
        model_id: string;
        serial_numbers: string[];
        catatan?: string;
    }[];
};

type Props = {
    lokasi: Lokasi[];
    modelBarang: ModelBarang[];
    serialPerModel: Record<string, string[]>;
};

export default function Create({ lokasi, modelBarang, serialPerModel }: Props) {
    const { data, setData, post, processing, errors } = useForm<StockOpnameForm>({
        tanggal: '',
        lokasi_id: '',
        catatan: '',
        details: [],
    });

    const [currentModel, setCurrentModel] = useState('');
    const [serialInput, setSerialInput] = useState('');
    const [serialsFisik, setSerialsFisik] = useState<string[]>([]);
    const [availableSerials, setAvailableSerials] = useState<string[]>([]);

    const getAvailableSerials = (modelId: string): string[] => {
        const allSerials = serialPerModel[modelId] || [];
        return allSerials.filter((sn) => !serialsFisik.includes(sn));
    };

    useEffect(() => {
        if (currentModel) {
            setAvailableSerials(getAvailableSerials(currentModel));
            setSerialInput('');
        }
    }, [currentModel, serialsFisik]);

    const addSerial = () => {
        const sn = serialInput.trim();
        if (!sn || serialsFisik.includes(sn)) return;

        const isValid = availableSerials.includes(sn);
        if (!isValid) {
            alert('Serial number tidak valid untuk model ini.');
            return;
        }

        setSerialsFisik([...serialsFisik, sn]);
        setSerialInput('');
    };

    const removeSerial = (sn: string) => {
        setSerialsFisik(serialsFisik.filter((s) => s !== sn));
    };

    const addDetail = () => {
        if (!currentModel || serialsFisik.length === 0) return;

        setData('details', [
            ...data.details,
            {
                model_id: currentModel,
                serial_numbers: serialsFisik,
            },
        ]);

        setCurrentModel('');
        setSerialsFisik([]);
        setAvailableSerials([]);
        setSerialInput('');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('stock-opname.store'));
    };

    return (
        <AppLayout>
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
                    <div className="mb-8 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800">Stock Opname</h1>
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Stock Opname'}
                        </button>
                    </div>

                    {/* Date and Location */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {/* Tanggal */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tanggal</label>
                            <input
                                type="date"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                                className="w-full rounded-lg border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                            {errors.tanggal && <p className="mt-1 text-sm text-red-600">{errors.tanggal}</p>}
                        </div>

                        {/* Lokasi */}
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Lokasi</label>
                            <select
                                value={data.lokasi_id}
                                onChange={(e) => setData('lokasi_id', e.target.value)}
                                className="w-full rounded-lg border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Pilih Lokasi</option>
                                {lokasi.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.lokasi_id && <p className="mt-1 text-sm text-red-600">{errors.lokasi_id}</p>}
                        </div>
                    </div>

                    {/* Input Model + Serial */}
                    <div className="border-t pt-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-800">Input Serial Fisik per Model</h2>

                        <div className="space-y-4">
                            {/* Select Model */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Model Barang</label>
                                <select
                                    value={currentModel}
                                    onChange={(e) => setCurrentModel(e.target.value)}
                                    className="w-full rounded-lg border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="">Pilih Model Barang</option>
                                    {modelBarang.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            [{m.kategori?.nama}] {m.merek?.nama} {m.nama}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Input Serial w/ Suggestion */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Serial Number</label>
                                <div className="flex gap-2">
                                    <input
                                        list="serial-suggestion"
                                        type="text"
                                        value={serialInput}
                                        onChange={(e) => setSerialInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSerial())}
                                        placeholder="Scan / input serial number"
                                        className="flex-1 rounded-lg border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                    <datalist id="serial-suggestion">
                                        {availableSerials.map((s) => (
                                            <option key={s} value={s} />
                                        ))}
                                    </datalist>
                                    <button
                                        type="button"
                                        onClick={addSerial}
                                        className="rounded-lg bg-blue-600 px-4 text-white transition-colors hover:bg-blue-700"
                                    >
                                        Tambah
                                    </button>
                                </div>
                            </div>

                            {/* List Serial yang Ditambahkan */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Serial Fisik</label>
                                <div className="flex min-h-10 flex-wrap gap-2 rounded-lg bg-gray-50 p-2">
                                    {serialsFisik.length > 0 ? (
                                        serialsFisik.map((sn, idx) => (
                                            <span
                                                key={idx}
                                                className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                                            >
                                                {sn}
                                                <button
                                                    type="button"
                                                    className="ml-1.5 text-blue-600 hover:text-blue-800"
                                                    onClick={() => removeSerial(sn)}
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">Belum ada serial</span>
                                    )}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={addDetail}
                                disabled={!currentModel || serialsFisik.length === 0}
                                className="w-full rounded-lg bg-green-600 px-4 py-2 font-medium text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                Tambah ke List
                            </button>
                        </div>
                    </div>

                    {/* List Detail */}
                    {data.details.length > 0 && (
                        <div className="border-t pt-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-800">Barang yang Diinput</h2>
                            <div className="space-y-3">
                                {data.details.map((d, i) => {
                                    const model = modelBarang.find((m) => m.id.toString() === d.model_id);
                                    return (
                                        <div key={i} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <h3 className="font-medium text-gray-900">
                                                        [{model?.kategori?.nama}] {model?.merek?.nama} {model?.nama}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-600">
                                                        Jumlah Fisik: <span className="font-medium">{d.serial_numbers.length}</span>
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {d.serial_numbers.map((sn, idx) => (
                                                    <span key={idx} className="rounded-full border border-gray-200 bg-white px-2.5 py-1 text-xs">
                                                        {sn}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Catatan */}
                    <div className="border-t pt-6">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Catatan Umum</label>
                        <textarea
                            value={data.catatan}
                            onChange={(e) => setData('catatan', e.target.value)}
                            className="w-full rounded-lg border-gray-300 p-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                            rows={3}
                            placeholder="Tambahkan catatan jika diperlukan..."
                        />
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
