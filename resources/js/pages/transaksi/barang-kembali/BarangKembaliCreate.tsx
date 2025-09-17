import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Tipe data untuk payload
interface KembaliInfo {
    serial_number: string;
    kondisi: 'bagus' | 'rusak' | 'diperbaiki';
}

interface Item {
    kategori: string;
    merek: string;
    model: string;
    kembali_info: KembaliInfo[];
}

// --- Komponen ItemRow dengan Logika Lengkap ---
const ItemRow = ({ item, index, onItemChange, onRemove, lokasiId }) => {
    // State lokal untuk menyimpan opsi dropdown yang dinamis untuk baris ini
    const [kategoriOptions, setKategoriOptions] = useState<{ id: number; nama: string }[]>([]);
    const [merekOptions, setMerekOptions] = useState<{ id: number; nama: string }[]>([]);
    const [modelOptions, setModelOptions] = useState<{ id: number; nama: string }[]>([]);
    const [serialOptions, setSerialOptions] = useState<string[]>([]);

    useEffect(() => {
        if (lokasiId) {
            fetch(`/api/kategori-by-lokasi/${lokasiId}`)
                .then((res) => res.json())
                .then(setKategoriOptions);
        } else {
            setKategoriOptions([]);
        }
    }, [lokasiId]);

    useEffect(() => {
        if (lokasiId && item.kategori) {
            fetch(`/api/merek-by-kategori/${lokasiId}/${encodeURIComponent(item.kategori)}`)
                .then((res) => res.json())
                .then(setMerekOptions);
        } else {
            setMerekOptions([]);
        }
    }, [lokasiId, item.kategori]);

    useEffect(() => {
        if (lokasiId && item.merek) {
            fetch(`/api/model-by-merek/${lokasiId}/${encodeURIComponent(item.merek)}`)
                .then((res) => res.json())
                .then(setModelOptions);
        } else {
            setModelOptions([]);
        }
    }, [lokasiId, item.merek]);

    useEffect(() => {
        if (lokasiId && item.model) {
            fetch(`/api/serial-by-model/${lokasiId}/${encodeURIComponent(item.model)}`)
                .then((res) => res.json())
                .then(setSerialOptions);
        } else {
            setSerialOptions([]);
        }
    }, [lokasiId, item.model]);

    const handleFieldChange = (field, value) => {
        const newItem = { ...item, [field]: value };
        if (field === 'kategori') {
            newItem.merek = '';
            newItem.model = '';
            newItem.kembali_info = [{ serial_number: '', kondisi: 'bagus' }];
        } else if (field === 'merek') {
            newItem.model = '';
            newItem.kembali_info = [{ serial_number: '', kondisi: 'bagus' }];
        } else if (field === 'model') {
            newItem.kembali_info = [{ serial_number: '', kondisi: 'bagus' }];
        }
        onItemChange(index, newItem);
    };

    const handleKembaliInfoChange = (infoIndex, field, value) => {
        const newKembaliInfo = [...item.kembali_info];
        newKembaliInfo[infoIndex] = { ...newKembaliInfo[infoIndex], [field]: value };
        onItemChange(index, { ...item, kembali_info: newKembaliInfo });
    };

    const addSerialField = () => onItemChange(index, { ...item, kembali_info: [...item.kembali_info, { serial_number: '', kondisi: 'bagus' }] });
    const removeSerialField = (infoIndex) => onItemChange(index, { ...item, kembali_info: item.kembali_info.filter((_, i) => i !== infoIndex) });

    return (
        <div className="relative mb-6 rounded-lg border-2 border-gray-200 p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">Item Pengembalian #{index + 1}</h3>
            {onRemove && (
                <button type="button" onClick={onRemove} className="absolute top-2 right-2 font-bold text-red-500 hover:text-red-700">
                    &times; Hapus Item
                </button>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Kategori, Merek, Model */}
                <div>
                    <label>Kategori</label>
                    <input
                        type="text"
                        list={`kategori-suggest-${index}`}
                        className="mt-1 w-full rounded border p-2"
                        value={item.kategori}
                        onChange={(e) => handleFieldChange('kategori', e.target.value)}
                        disabled={!lokasiId}
                    />
                    <datalist id={`kategori-suggest-${index}`}>
                        {kategoriOptions.map((k) => (
                            <option key={k.id} value={k.nama} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label>Merek</label>
                    <input
                        type="text"
                        list={`merek-suggest-${index}`}
                        className="mt-1 w-full rounded border p-2"
                        value={item.merek}
                        onChange={(e) => handleFieldChange('merek', e.target.value)}
                        disabled={!item.kategori}
                    />
                    <datalist id={`merek-suggest-${index}`}>
                        {merekOptions.map((m) => (
                            <option key={m.id} value={m.nama} />
                        ))}
                    </datalist>
                </div>
                <div>
                    <label>Model</label>
                    <input
                        type="text"
                        list={`model-suggest-${index}`}
                        className="mt-1 w-full rounded border p-2"
                        value={item.model}
                        onChange={(e) => handleFieldChange('model', e.target.value)}
                        disabled={!item.merek}
                    />
                    <datalist id={`model-suggest-${index}`}>
                        {modelOptions.map((m) => (
                            <option key={m.id} value={m.nama} />
                        ))}
                    </datalist>
                </div>
            </div>

            <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-red-700">Serial Number & Kondisi</label>
                {item.kembali_info.map((info, infoIndex) => (
                    <div key={infoIndex} className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-1 rounded border-2 border-red-400 bg-red-50 p-2"
                                value={info.serial_number}
                                // ✅ PERBAIKAN DI SINI: e.taget -> e.target
                                onChange={(e) => handleKembaliInfoChange(infoIndex, 'serial_number', e.target.value)}
                                placeholder={`Serial #${infoIndex + 1}`}
                                list={`serial-suggest-${index}`}
                                disabled={!item.model}
                            />
                            {item.kembali_info.length > 1 && (
                                <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => removeSerialField(infoIndex)}>
                                    Hapus
                                </button>
                            )}
                        </div>
                        <div>
                            <select
                                value={info.kondisi}
                                onChange={(e) => handleKembaliInfoChange(infoIndex, 'kondisi', e.target.value as 'bagus' | 'rusak' | 'diperbaiki')}
                                className="w-full rounded border-2 border-blue-400 bg-blue-50 p-2"
                            >
                                <option value="bagus">Bagus</option>
                                <option value="rusak">Rusak</option>
                                <option value="diperbaiki">Diperbaiki</option>
                            </select>
                        </div>
                    </div>
                ))}
                <datalist id={`serial-suggest-${index}`}>
                    {serialOptions
                        .filter((sn) => !item.kembali_info.some((k) => k.serial_number === sn))
                        .map((sn) => (
                            <option key={sn} value={sn} />
                        ))}
                </datalist>
                <button type="button" className="mt-1 text-sm text-blue-600 hover:underline" onClick={addSerialField} disabled={!item.model}>
                    + Tambah Serial
                </button>
            </div>
        </div>
    );
};

// --- Komponen Create Utama ---
export default function BarangKembaliCreate() {
    const { lokasiList } = usePage().props as any;

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: new Date().toISOString().slice(0, 10),
        lokasi: '',
        items: [
            {
                kategori: '',
                merek: '',
                model: '',
                kembali_info: [{ serial_number: '', kondisi: 'bagus' }],
            },
        ] as Item[],
    });

    const selectedLokasiId = lokasiList.find((l) => l.nama === data.lokasi)?.id || null;

    // Reset items jika lokasi diubah
    useEffect(() => {
        setData('items', [{ kategori: '', merek: '', model: '', kembali_info: [{ serial_number: '', kondisi: 'bagus' }] }]);
    }, [data.lokasi]);

    const handleItemChange = (index, updatedItem) => {
        setData(
            'items',
            data.items.map((item, i) => (i === index ? updatedItem : item)),
        );
    };

    const addItemRow = () => {
        setData('items', [...data.items, { kategori: '', merek: '', model: '', kembali_info: [{ serial_number: '', kondisi: 'bagus' }] }]);
    };

    const removeItemRow = (index) => {
        setData(
            'items',
            data.items.filter((_, i) => i !== index),
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('barang-kembali.store'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data barang kembali berhasil disimpan!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                reset();
            },
            onError: (err) => Swal.fire({ icon: 'error', title: 'Gagal', text: Object.values(err)[0] || 'Periksa kembali isian form Anda.' }),
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">Buat Transaksi Barang Kembali</h1>
                <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
                    {/* Header Form */}
                    <div className="mb-6 grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
                        <div>
                            <label>Tanggal Pengembalian</label>
                            <input
                                type="date"
                                className="mt-1 w-full rounded border p-2"
                                value={data.tanggal}
                                onChange={(e) => setData('tanggal', e.target.value)}
                            />
                            {errors.tanggal && <p className="text-sm text-red-500">{errors.tanggal}</p>}
                        </div>
                        <div>
                            <label>Lokasi Asal Barang (Tempat Kembali)</label>
                            <input
                                type="text"
                                list="lokasi-suggest"
                                className="mt-1 w-full rounded border p-2"
                                value={data.lokasi}
                                onChange={(e) => setData('lokasi', e.target.value)}
                            />
                            <datalist id="lokasi-suggest">
                                {lokasiList.map((l) => (
                                    <option key={l.id} value={l.nama} />
                                ))}
                            </datalist>
                            {errors.lokasi && <p className="text-sm text-red-500">{errors.lokasi}</p>}
                        </div>
                    </div>

                    {/* Daftar Item */}
                    {data.items.map((item, index) => (
                        <ItemRow
                            key={index}
                            item={item}
                            index={index}
                            onItemChange={handleItemChange}
                            onRemove={data.items.length > 1 ? () => removeItemRow(index) : undefined}
                            lokasiId={selectedLokasiId}
                        />
                    ))}

                    {/* Tombol Aksi */}
                    <div className="mt-6 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={addItemRow}
                            className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                            disabled={!data.lokasi}
                        >
                            + Tambah Item
                        </button>
                        <div className="flex space-x-4">
                            <Link href={route('barang-kembali.index')} className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600">
                                Kembali
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                Simpan Transaksi
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
