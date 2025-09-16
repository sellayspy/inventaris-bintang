import AppLayout from '@/layouts/app-layout';
import { Link, useForm, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function BarangMasukCreate() {
    const { kategoriList, asalList, merekList, modelList, rakList, jenisList } = usePage().props as unknown as {
        kategoriList: Array<{ id: number; nama: string }>;
        asalList: Array<{ id: number; nama: string }>;
        merekList: Array<{ id: number; nama: string }>;
        modelList: Array<{ id: number; nama: string }>;
        jenisList: Array<{ id: number; nama: string }>;
        rakList: Array<{
            id: number;
            nama_rak: string;
            baris: string;
            kode_rak: string;
        }>;
    };

    const kategoriOptions = kategoriList.map((item) => item.nama);
    const asalOptions = asalList.map((item) => item.nama);
    const merekOptions = merekList.map((item) => item.nama);

    const { data, setData, post, processing, errors, reset } = useForm({
        tanggal: '',
        asal_barang: '',
        items: [
            {
                kategori: '',
                merek: '',
                model: '',
                jenis_barang: '',
                serial_numbers: [''],
            },
        ],
    });

   const handleItemChange = (index: number, field: keyof Item, value: any) => {
        const updatedItems = [...data.items];
        updatedItems[index] = {...updatedItems[index], [field]: value};

        if(field === 'kategori') {
            updatedItems[index].model = '';
            updatedItems[index].jenis_barang = '';
        }
        if(field === 'jeni_barang' || field === 'model') {
            updatedItems[index].model = '';
        }

        setData('items', updatedItems);
   }

    const addItemRow = () => {
        setData('items', [
            ...data.items,
            {
                kategori: '',
                merek: '',
                model: '',
                jenis_barang: '',
                serial_numbers: [''],
            }
        ])
    }

    const removeItemRows = (index: number) => {
        if(data.items.length > 1){
            setData('items', data.items.filter((_, i) => i !== index));
        }
    }

    const handleSerialChange = (value: string, index: number, itemIndex: number) => {
        const updatedItems = [...data.items];
        updatedItems[itemIndex].serial_numbers[index] = value;
        setData('items', updatedItems);
    };

    const addSerialField = (itemIndex: number) => {
        const updatedItems = [...data.items];
        updatedItems[itemIndex].serial_numbers.push('');
        setData('items', updatedItems);
    };

    const removeSerialField = (itemIndex: number, index: number) => {
        const updatedItems = [...data.items];
        if(updatedItems[itemIndex].serial_numbers.length > 1){
            updatedItems[itemIndex].serial_numbers = updatedItems[itemIndex].serial_numbers.filter((_, i) => i !== index);
            setData('items', updatedItems);
        }
    };

   const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('barang-masuk.store'), {
            onSuccess: () => {
                Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data barang masuk berhasil disimpan.', timer: 2000, showConfirmButton: false });
                reset();
            },
            onError: (err) => {
                // Error handling tetap sama, Inertia akan memetakan errornya
                Swal.fire({ icon: 'error', title: 'Gagal', text: 'Terjadi kesalahan. Periksa kembali isian form Anda.' });
            }
        });
    };


    /* useEffect(() => {
        // Keluar jika Kategori belum dipilih
        if (!data.kategori) {
            setJenisOptions([]); // Kosongkan pilihan jenis
            return;
        }

        // Ambil data Jenis Barang yang relevan
        fetch(`/ajax/jenis-barang?kategori=${encodeURIComponent(data.kategori)}`)
            .then((res) => res.json())
            .then((res) => setJenisOptions(res));
    }, [data.kategori]);

    useEffect(() => {
        if (!data.jenis_barang) {
            setModelOptions([]);
            return;
        }

        fetch(`/ajax/model-barang?jenis_barang=${encodeURIComponent(data.jenis_barang)}`)
            .then((res) => res.json())
            .then((res) => setModelOptions(res));
    }, [data.jenis_barang]); */

    return (
        <AppLayout>
            <div className="rounded-lg bg-white p-8 shadow-md">
                <h1 className="mb-8 text-3xl font-bold text-gray-800">Tambah Barang Masuk</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                   {/* Header Form: Tanggal & Asal Barang */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-8">
                         <div>
                             <label htmlFor="tanggal">Tanggal</label>
                             <input id="tanggal" type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} />
                             {errors.tanggal && <p className="text-sm text-red-500 mt-1">{errors.tanggal}</p>}
                         </div>
                         <div>
                             <label htmlFor="asal_barang">Asal Barang</label>
                             <input id="asal_barang" type="text" list="asal-suggest" value={data.asal_barang} onChange={(e) => setData('asal_barang', e.target.value)} />
                             <datalist id="asal-suggest">{asalOptions.map((a) => <option key={a} value={a} />)}</datalist>
                             {errors.asal_barang && <p className="text-sm text-red-500 mt-1">{errors.asal_barang}</p>}
                         </div>
                    </div>

                    {/* 5. Looping untuk merender setiap baris item */}
                    {data.items.map((item, index) => {
                        // Logika filter untuk dependent dropdown
                        const selectedKategori = kategoriList.find(k => k.nama === item.kategori);
                        const selectedMerek = merekList.find(m => m.nama === item.merek);
                        const filteredJenis = selectedKategori ? jenisList.filter(j => j.kategori_id === selectedKategori.id) : [];
                        const selectedJenis = filteredJenis.find(j => j.nama === item.jenis_barang);
                        const filteredModel = (selectedJenis && selectedMerek) ? modelList.filter(m => m.jenis_id === selectedJenis.id && m.merek_id === selectedMerek.id) : [];

                        return (
                            <div key={index} className="border-2 border-dashed p-4 rounded-lg mb-6 relative">
                                <h3 className="font-semibold text-lg mb-4">Item #{index + 1}</h3>
                                {data.items.length > 1 && (
                                    <button type="button" variant="destructive" size="sm" className="absolute top-4 right-4" onClick={() => removeItemRow(index)}>
                                        Hapus Item
                                    </button>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Kategori */}
                                    <div>
                                        <label>Kategori</label>
                                        <input type="text" list="kategori-suggest" value={item.kategori} onChange={(e) => handleItemChange(index, 'kategori', e.target.value)} />
                                        <datalist id="kategori-suggest">{kategoriOptions.map((k) => <option key={k} value={k} />)}</datalist>
                                        {errors[`items.${index}.kategori`] && <p className="text-sm text-red-500 mt-1">{errors[`items.${index}.kategori`]}</p>}
                                    </div>

                                    {/* Merek */}
                                    <div>
                                        <label>Merek</label>
                                        <input type="text" list="merek-suggest" value={item.merek} onChange={(e) => handleItemChange(index, 'merek', e.target.value)} />
                                        <datalist id="merek-suggest">{merekOptions.map((m) => <option key={m} value={m} />)}</datalist>
                                        {errors[`items.${index}.merek`] && <p className="text-sm text-red-500 mt-1">{errors[`items.${index}.merek`]}</p>}
                                    </div>

                                    {/* Jenis Barang */}
                                    <div>
                                        <label>Jenis Barang</label>
                                        <input type="text" list={`jenis-suggest-${index}`} value={item.jenis_barang} onChange={(e) => handleItemChange(index, 'jenis_barang', e.target.value)} disabled={!item.kategori} />
                                        <datalist id={`jenis-suggest-${index}`}>{filteredJenis.map(j => <option key={j.id} value={j.nama}/>)}</datalist>
                                        {errors[`items.${index}.jenis_barang`] && <p className="text-sm text-red-500 mt-1">{errors[`items.${index}.jenis_barang`]}</p>}
                                    </div>

                                    {/* Model */}
                                    <div>
                                        <label>Model</label>
                                        <input type="text" list={`model-suggest-${index}`} value={item.model} onChange={(e) => handleItemChange(index, 'model', e.target.value)} disabled={!item.jenis_barang || !item.merek} />
                                        <datalist id={`model-suggest-${index}`}>{filteredModel.map(m => <option key={m.id} value={m.nama} />)}</datalist>
                                        {errors[`items.${index}.model`] && <p className="text-sm text-red-500 mt-1">{errors[`items.${index}.model`]}</p>}
                                    </div>
                                </div>

                                {/* Serial Numbers per Item */}
                                <div className="mt-6">
                                    <label className="font-semibold text-red-700">Serial Number</label>
                                    {item.serial_numbers.map((serial, serialIndex) => (
                                        <div key={serialIndex} className="flex items-center gap-2 mt-2">
                                            <input type="text" value={serial} onChange={(e) => handleSerialChange(index, serialIndex, e.target.value)} placeholder={`Serial #${serialIndex + 1}`} />
                                            {item.serial_numbers.length > 1 && (
                                                <button type="button" variant="ghost" className="text-red-600" onClick={() => removeSerialField(index, serialIndex)}>Hapus</button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" variant="link" className="mt-2" onClick={() => addSerialField(index)}>+ Tambah Serial</button>
                                    {errors[`items.${index}.serial_numbers`] && <p className="text-sm text-red-500 mt-1">{errors[`items.${index}.serial_numbers`]}</p>}
                                </div>
                            </div>
                        )
                    })}

                    {/* Tombol Tambah Item & Submit */}
                    <div className="flex justify-between items-center mt-8">
                        <button type="button" variant="outline" onClick={addItemRow}>
                            + Tambah Jenis Barang Lain
                        </button>
                    </div>
                    {/* Submit Button (Full Width) */}
                    <div className="flex justify-end space-x-4 pt-4 md:col-span-2">
                        <Link href={route('barang.index')} className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600">
                            Kembali
                        </Link>

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
