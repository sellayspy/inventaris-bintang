import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface Lokasi {
    id: number;
    nama: string;
}

export default function BarangKembaliCreate() {
    const { kategoriList, lokasiList, merekList, modelList, serialNumberList } = usePage().props as unknown as {
        kategoriList: Array<{ id: number; nama: string }>;
        lokasiList: Lokasi[];
        merekList: string[];
        modelList: string[];
        serialNumberList: string[];
    };

    const [serialNumbers, setSerialNumbers] = useState<string[]>(['']);
    const [availableSerials, setAvailableSerials] = useState<string[]>([]);

    const { data, setData, post, processing, errors } = useForm({
        tanggal: '',
        lokasi: '',
        serial_numbers: [''],
        kondisi_map: {} as Record<string, string>,
    });

    const handleSerialChange = (index: number, value: string) => {
        const updatedSerials = [...serialNumbers];
        const oldSerial = updatedSerials[index]; // serial sebelumnya
        updatedSerials[index] = value;

        // Ambil kondisi lama atau default 'bagus' jika belum ada
        const oldKondisi = data.kondisi_map[oldSerial] || 'bagus';

        const updatedKondisiMap = { ...data.kondisi_map };
        delete updatedKondisiMap[oldSerial]; // hapus kondisi untuk serial lama
        updatedKondisiMap[value] = oldKondisi; // set kondisi untuk serial baru

        setSerialNumbers(updatedSerials);
        setData('serial_numbers', updatedSerials);
        setData('kondisi_map', updatedKondisiMap);
    };

    const addSerialField = () => {
        const updated = [...serialNumbers, ''];
        setSerialNumbers(updated);
        setData('serial_numbers', updated);
    };

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

        const isDuplicate = new Set(serialNumbers).size !== serialNumbers.length;
        if (isDuplicate) {
            alert('Terdapat serial number yang sama. Harap periksa kembali.');
            return;
        }

        post('/barang-kembali', {
            onSuccess: () => {
                console.log('Redirected successfully');
            },
            onError: (errors) => {
                console.log('Validation errors:', errors);
            },
        });
    };

    useEffect(() => {
        if (data.lokasi) {
            const lokasi = lokasiList.find((l) => l.nama === data.lokasi);
            if (lokasi) {
                fetch(`/serial-by-lokasi/${lokasi.id}`)
                    .then((res) => res.json())
                    .then((serials) => {
                        setAvailableSerials(serials);
                    })
                    .catch((err) => {
                        console.error('Gagal ambil serial number:', err);
                    });
            }
        }
    }, [data.lokasi]);

    return (
        <AppLayout>
            <div className="rounded bg-white p-6 shadow">
                <h2 className="mb-4 text-2xl font-semibold">Form Barang Kembali</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label className="block font-semibold">Serial Number</label>
                        {serialNumbers.map((serial, index) => (
                            <div key={index} className="mb-2 flex items-center gap-2">
                                <input
                                    list="serialNumberList"
                                    className="w-full rounded border px-3 py-2"
                                    value={serial}
                                    onChange={(e) => handleSerialChange(index, e.target.value)}
                                />
                                <select
                                    className="rounded border px-2 py-2"
                                    value={data.kondisi_map[serial] || 'bagus'}
                                    onChange={(e) =>
                                        setData('kondisi_map', {
                                            ...data.kondisi_map,
                                            [serial]: e.target.value,
                                        })
                                    }
                                >
                                    <option value="bagus">Bagus</option>
                                    <option value="rusak">Rusak</option>
                                    <option value="diperbaiki">Diperbaiki</option>
                                </select>
                                {index > 0 && (
                                    <button type="button" className="text-red-600 hover:text-red-800" onClick={() => removeSerialField(index)}>
                                        ✕
                                    </button>
                                )}
                            </div>
                        ))}
                        <datalist id="serialNumberList">
                            {availableSerials
                                .filter((sn) => !serialNumbers.includes(sn)) // hanya tampilkan yang belum dipilih
                                .map((sn) => (
                                    <option key={sn} value={sn} />
                                ))}
                        </datalist>
                        <button type="button" onClick={addSerialField} className="mt-2 text-sm text-blue-600 hover:underline">
                            + Tambah Serial
                        </button>
                        {errors.serial_numbers && <p className="text-sm text-red-500">{errors.serial_numbers}</p>}
                    </div>

                    <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                        Simpan
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
