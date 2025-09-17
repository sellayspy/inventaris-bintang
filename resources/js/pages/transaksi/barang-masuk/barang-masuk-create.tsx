import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

interface Item {
    kategori: string;
    merek: string;
    model: string;
    jenis_barang: string;
    rak_nama: string;
    rak_baris: string;
    rak_id: number | null;
    serial_numbers: string[];
}

const ItemRow = ({ item, index, onItemChange, onRemove, errors, lists }) => {
    const [jenisOptions, setJenisOptions] = useState<string[]>([]);
    const [modelOptions, setModelOptions] = useState<string[]>([]);
    const [barisOptions, setBarisOptions] = useState<string[]>([]);

    // Efek untuk memuat Jenis Barang saat Kategori berubah
    useEffect(() => {
        if (!item.kategori) {
            setJenisOptions([]);
            return;
        }
        fetch(`/ajax/jenis-barang?kategori=${encodeURIComponent(item.kategori)}`)
            .then((res) => res.json())
            .then((res) => setJenisOptions(res));
    }, [item.kategori]);

    // Efek untuk memuat Model saat Jenis Barang berubah
    useEffect(() => {
        if (!item.jenis_barang) {
            setModelOptions([]);
            return;
        }
        fetch(`/ajax/model-barang?jenis_barang=${encodeURIComponent(item.jenis_barang)}`)
            .then((res) => res.json())
            .then((res) => setModelOptions(res));
    }, [item.jenis_barang]);

    // FUNGSI BARU: menangani perubahan dropdown "Nama Rak"
    const handleRakNamaChange = (namaRak: string) => {
        // 1. Cari semua baris yang cocok dengan nama rak yang dipilih
        const availableBaris = lists.rakList.filter((r) => r.nama_rak === namaRak).map((r) => r.baris);
        setBarisOptions(availableBaris);

        // 2. Update state di parent, set nama rak dan reset baris & id
        onItemChange(index, {
            ...item,
            rak_nama: namaRak,
            rak_baris: '', // Kosongkan pilihan baris
            rak_id: null, // Reset ID
        });
    };

    // FUNGSI BARU: menangani perubahan dropdown "Baris"
    const handleRakBarisChange = (baris: string) => {
        // 1. Cari objek rak yang lengkap untuk mendapatkan ID-nya
        const selectedRak = lists.rakList.find((r) => r.nama_rak === item.rak_nama && r.baris === baris);

        // 2. Update state di parent dengan baris dan ID yang terpilih
        onItemChange(index, {
            ...item,
            rak_baris: baris,
            rak_id: selectedRak ? selectedRak.id : null,
        });
    };

    const handleFieldChange = (field, value) => {
        const newItem = { ...item, [field]: value };
        if (field === 'kategori') {
            newItem.jenis_barang = '';
            newItem.model = '';
        } else if (field === 'jenis_barang') {
            newItem.model = '';
        }
        onItemChange(index, newItem);
    };

    const handleSerialChange = (serialIndex, value) => {
        const newSerials = [...item.serial_numbers];
        newSerials[serialIndex] = value;
        onItemChange(index, { ...item, serial_numbers: newSerials });
    };

    const addSerialField = () => {
        onItemChange(index, { ...item, serial_numbers: [...item.serial_numbers, ''] });
    };

    const removeSerialField = (serialIndex) => {
        const newSerials = item.serial_numbers.filter((_, i) => i !== serialIndex);
        onItemChange(index, { ...item, serial_numbers: newSerials });
    };

    // Dapatkan error untuk item spesifik ini
    const getError = (field) => errors && errors[`items.${index}.${field}`];

    return (
        <div className="relative mb-6 rounded-lg border-2 border-gray-200 p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-700">Barang #{index + 1}</h3>
            {onRemove && (
                <button type="button" onClick={onRemove} className="absolute top-2 right-2 font-bold text-red-500 hover:text-red-700">
                    &times; Hapus Barang
                </button>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Kategori */}
                <div>
                    <label>Kategori</label>
                    <input
                        type="text"
                        list="kategori-suggest"
                        className="mt-1 w-full rounded border p-2"
                        value={item.kategori}
                        onChange={(e) => handleFieldChange('kategori', e.target.value)}
                    />
                    <datalist id="kategori-suggest">
                        {lists.kategoriList.map((k) => (
                            <option key={k.id} value={k.nama} />
                        ))}
                    </datalist>
                    {getError('kategori') && <p className="text-sm text-red-500">{getError('kategori')}</p>}
                </div>

                {/* Merek */}
                <div>
                    <label>Merek</label>
                    <input
                        type="text"
                        list="merek-suggest"
                        className="mt-1 w-full rounded border p-2"
                        value={item.merek}
                        onChange={(e) => handleFieldChange('merek', e.target.value)}
                    />
                    <datalist id="merek-suggest">
                        {lists.merekList.map((m) => (
                            <option key={m.id} value={m.nama} />
                        ))}
                    </datalist>
                    {getError('merek') && <p className="text-sm text-red-500">{getError('merek')}</p>}
                </div>

                {/* Jenis Barang */}
                <div>
                    <label>Jenis Barang</label>
                    <input
                        type="text"
                        list={`jenis-suggest-${index}`}
                        className="mt-1 w-full rounded border p-2"
                        value={item.jenis_barang}
                        onChange={(e) => handleFieldChange('jenis_barang', e.target.value)}
                    />
                    <datalist id={`jenis-suggest-${index}`}>
                        {jenisOptions.map((j) => (
                            <option key={j} value={j} />
                        ))}
                    </datalist>
                    {getError('jenis_barang') && <p className="text-sm text-red-500">{getError('jenis_barang')}</p>}
                </div>

                {/* Model */}
                <div>
                    <label>Model</label>
                    <input
                        type="text"
                        list={`model-suggest-${index}`}
                        className="mt-1 w-full rounded border p-2"
                        value={item.model}
                        onChange={(e) => handleFieldChange('model', e.target.value)}
                    />
                    <datalist id={`model-suggest-${index}`}>
                        {modelOptions.map((m) => (
                            <option key={m} value={m} />
                        ))}
                    </datalist>
                    {getError('model') && <p className="text-sm text-red-500">{getError('model')}</p>}
                </div>

                {/* Rak */}
                <div>
                    <label>Nama Rak</label>
                    <select className="mt-1 w-full rounded border p-2" value={item.rak_nama} onChange={(e) => handleRakNamaChange(e.target.value)}>
                        <option value="">-- Pilih Rak --</option>
                        {/* Ambil nama rak yang unik dari list */}
                        {[...new Set(lists.rakList.map((r) => r.nama_rak))].map((nama) => (
                            <option key={nama} value={nama}>
                                {nama}
                            </option>
                        ))}
                    </select>
                    {errors && errors[`items.${index}.rak_id`] && !item.rak_id && <p className="text-sm text-red-500">Rak wajib dipilih</p>}
                </div>

                {/* Baris (hanya muncul jika Nama Rak sudah dipilih) */}
                {barisOptions.length > 0 && (
                    <div>
                        <label>Baris</label>
                        <select
                            className="mt-1 w-full rounded border p-2"
                            value={item.rak_baris}
                            onChange={(e) => handleRakBarisChange(e.target.value)}
                        >
                            <option value="">-- Pilih Baris --</option>
                            {barisOptions.map((baris) => (
                                <option key={baris} value={baris}>
                                    {baris}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {/* --- AKHIR PERUBAHAN UI RAK --- */}
            </div>

            {/* Serial Numbers */}
            <div className="mt-4">
                <label className="mb-2 block text-sm font-semibold text-red-700">Serial Number</label>
                {item.serial_numbers.map((serial, serialIndex) => (
                    <div key={serialIndex} className="mb-2 flex items-center gap-2">
                        <input
                            type="text"
                            className="flex-1 rounded border-2 border-red-400 bg-red-50 p-2"
                            value={serial}
                            onChange={(e) => handleSerialChange(serialIndex, e.target.value)}
                            placeholder={`Serial #${serialIndex + 1}`}
                        />
                        {item.serial_numbers.length > 1 && (
                            <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => removeSerialField(serialIndex)}>
                                Hapus
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" className="mt-1 text-sm text-blue-600 hover:underline" onClick={addSerialField}>
                    + Tambah Serial
                </button>
                {getError('serial_numbers') && <p className="text-sm text-red-500">{getError('serial_numbers')}</p>}
            </div>
        </div>
    );
};

export default function BarangMasukCreate() {
    const { kategoriList, asalList, merekList, modelList, rakList, jenisList } = usePage().props as any;

    const initialItem: Item = {
        kategori: '',
        merek: '',
        jenis_barang: '',
        model: '',
        rak_nama: '', // field baru
        rak_baris: '', // field baru
        rak_id: null, // field baru
        serial_numbers: [''],
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: new Date().toISOString().slice(0, 10), // Default tanggal hari ini
        asal_barang: '',
        items: [initialItem],
    });

    const handleItemChange = (index: number, updatedItem: Item) => {
        const newItems = [...data.items];
        newItems[index] = updatedItem;
        setData('items', newItems);
    };

    const addItemRow = () => {
        setData('items', [...data.items, initialItem]);
    };

    const removeItemRow = (index: number) => {
        const newItems = data.items.filter((_, i) => i !== index);
        setData('items', newItems);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('barang-masuk.store'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data barang masuk berhasil disimpan!',
                    timer: 2000,
                    showConfirmButton: false,
                });
                reset(); // Reset form ke state awal
            },
            onError: (err) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Periksa kembali isian form Anda. Pastikan semua field wajib terisi dan serial number tidak duplikat.',
                });
            },
        });
    };

    return (
        <AppLayout>
            <div className="container mx-auto p-4">
                <h1 className="mb-4 text-2xl font-bold">Buat Transaksi Barang Masuk Baru</h1>

                <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-md">
                    {/* Header Form */}
                    <div className="mb-6 grid grid-cols-1 gap-6 border-b pb-6 md:grid-cols-2">
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
                            <label className="block text-sm font-medium text-gray-700">Asal Barang</label>
                            <input
                                type="text"
                                list="asal-suggest"
                                className="mt-1 w-full rounded border p-2"
                                value={data.asal_barang}
                                onChange={(e) => setData('asal_barang', e.target.value)}
                            />
                            <datalist id="asal-suggest">
                                {asalList.map((a) => (
                                    <option key={a.id} value={a.nama} />
                                ))}
                            </datalist>
                            {errors.asal_barang && <p className="text-sm text-red-500">{errors.asal_barang}</p>}
                        </div>
                    </div>

                    {/* Daftar Item Barang */}
                    {data.items.map((item, index) => (
                        <ItemRow
                            key={index}
                            item={item}
                            index={index}
                            onItemChange={handleItemChange}
                            onRemove={data.items.length > 1 ? () => removeItemRow(index) : undefined}
                            errors={errors}
                            lists={{ kategoriList, merekList, rakList }} // Kirim list yang dibutuhkan
                        />
                    ))}

                    {/* Tombol Aksi */}
                    <div className="mt-6 flex items-center justify-between">
                        <button type="button" onClick={addItemRow} className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600">
                            + Tambah Jenis Barang
                        </button>

                        <div className="flex space-x-4">
                            <Link href={route('barang-masuk.index')} className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600">
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
