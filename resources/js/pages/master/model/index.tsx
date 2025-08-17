import { PERMISSIONS } from '@/constants/permission';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm } from '@inertiajs/react';
import debounce from 'lodash.debounce';
import { Edit3, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';

type Kategori = { id: number; nama: string };
type Merek = { id: number; nama: string };
type JenisBarang = { id: number; nama: string; kategori: Kategori; kategori_id?: number };

type ModelBarang = {
    id: number;
    nama: string;
    label: string;
    kategori: Kategori;
    merek: Merek;
    jenis?: JenisBarang;
};

type Props = {
    modelBarang: {
        data: ModelBarang[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    kategori: Kategori[];
    merek: Merek[];
    jenis: JenisBarang[];
    labelList: string[];
    flash?: { message?: string };
    auth: {
        permissions?: string[];
    };
};

export default function Index({ auth, modelBarang, kategori, merek, jenis, flash, labelList, filters }: Props & { filters: { search: string } }) {
    console.log('jenis', jenis);
    const [editing, setEditing] = useState<ModelBarang | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [labelOptions, setLabelOptions] = useState<string[]>([]);
    const [search, setSearch] = useState(filters.search || '');
    const userPermissions = auth.permissions || [];

    const form = useForm({
        nama: '',
        label: '',
        kategori_id: '',
        merek_id: '',
        jenis_id: '',
        debugger: '',
    });

    useEffect(() => {
        if (flash?.message) {
            form.reset();
            toast.success(flash.message);
        }
    }, [flash?.message]);

    useEffect(() => {
        // Inisialisasi labelOptions dari props
        if (labelList?.length) {
            setLabelOptions(labelList);
        }
    }, [labelList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Tambahkan label baru ke opsi jika belum ada
        if (form.data.label && !labelOptions.includes(form.data.label)) {
            setLabelOptions((prev) => [...prev, form.data.label]);
        }

        if (editing) {
            form.put(`/model/${editing.id}`, {
                onSuccess: () => {
                    form.reset();
                    setEditing(null);
                    setShowForm(false);
                },
            });
        } else {
            form.post('/model', {
                onSuccess: () => {
                    form.reset();
                    setShowForm(false);
                },
            });
        }
    };

    const canCreateModel = userPermissions.includes(PERMISSIONS.CREATE_MODEL);
    const canEditModel = userPermissions.includes(PERMISSIONS.EDIT_MODEL);
    const canDeleteModel = userPermissions.includes(PERMISSIONS.DELETE_MODEL);

    const handleEdit = (item: ModelBarang) => {
        form.setData({
            nama: item.nama,
            label: item.label,
            kategori_id: item.kategori.id.toString(),
            merek_id: item.merek.id.toString(),
            jenis_id: item.jenis?.id ? item.jenis.id.toString() : '',
            debugger: '',
        });
        setEditing(item);
        setShowForm(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus model ini?')) {
            form.delete(`/model/${id}`);
        }
    };

    const handleCancel = () => {
        form.reset();
        setEditing(null);
        setShowForm(false);
    };

    // fungsi pencarian dengan debounce
    const handleSearch = (value: string) => {
        setSearch(value);

        // Gunakan debounce untuk menunda request Inertia
        debounce(() => {
            router.get(
                route('model.index'),
                { search: value },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        }, 400)();
    };

    return (
        <AppLayout>
            <div className="bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950">
                <Head title="Model Barang" />
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Model Barang</h1>
                        <div className="flex items-center gap-4">
                            <input
                                type="text"
                                placeholder="Cari..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="rounded-md border-gray-300 bg-white p-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            />
                            {canCreateModel && (
                                <button
                                    onClick={() => (showForm ? handleCancel() : setShowForm(true))}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                                >
                                    {showForm ? 'Tutup' : '+ Tambah Model'}
                                </button>
                            )}
                        </div>
                    </div>

                    {showForm && (
                        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                            <h2 className="mb-5 text-xl font-semibold dark:text-white">{editing ? 'Edit Model' : 'Tambah Model Baru'}</h2>
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {/* A consistent wrapper for each form field for easier styling. */}
                                <div className="space-y-1">
                                    <label className="text-sm font-medium dark:text-gray-200">Nama Model</label>
                                    <input
                                        type="text"
                                        value={form.data.nama}
                                        onChange={(e) => form.setData('nama', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    />
                                    {form.errors.nama && <p className="text-sm text-red-500">{form.errors.nama}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium dark:text-gray-200">Kategori</label>
                                    <select
                                        value={form.data.kategori_id}
                                        onChange={(e) => form.setData('kategori_id', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        {kategori.map((k) => (
                                            <option key={k.id} value={k.id}>
                                                {k.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.kategori_id && <p className="text-sm text-red-500">{form.errors.kategori_id}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium dark:text-gray-200">Merek</label>
                                    <select
                                        value={form.data.merek_id}
                                        onChange={(e) => form.setData('merek_id', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Merek</option>
                                        {merek.map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.merek_id && <p className="text-sm text-red-500">{form.errors.merek_id}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium dark:text-gray-200">Jenis Barang</label>
                                    <select
                                        value={form.data.jenis_id}
                                        onChange={(e) => form.setData('jenis_id', e.target.value)}
                                        className="w-full rounded-md border-gray-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Jenis Barang</option>
                                        {jenis.map((j) => (
                                            <option key={j.id} value={j.id}>
                                                {j.nama}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.jenis_id && <p className="text-sm text-red-500">{form.errors.jenis_id}</p>}
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-sm font-medium dark:text-gray-200">Label Barang</label>
                                    {/* The Select component is assumed to be custom. Styling remains minimal. */}
                                    <Select
                                        options={labelOptions.map((label) => ({ label, value: label }))}
                                        onChange={(selected) => form.setData('label', selected?.value || '')}
                                        value={form.data.label ? { label: form.data.label, value: form.data.label } : null}
                                        isClearable
                                    />
                                    {form.errors.label && <p className="text-sm text-red-500">{form.errors.label}</p>}
                                </div>

                                {/* Buttons are grouped at the end */}
                                <div className="flex gap-3 md:col-span-2">
                                    <button
                                        type="submit"
                                        disabled={form.processing}
                                        className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
                                    >
                                        {editing ? 'Update' : 'Simpan'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
                                    >
                                        Batal
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* --- DATA TABLE --- */}
                    {/* Replaced shadow with a simple border for a flatter, faster design. */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                            <thead className="bg-gray-50 dark:bg-zinc-800">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Model Barang
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Kategori
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Merek
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Jenis
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Label
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-400">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                                {modelBarang.data.map((item, index) => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{`${item.merek?.nama ?? ''} ${item.nama}`}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.kategori?.nama}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.merek?.nama}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item.jenis?.nama || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{item?.label || '-'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            {/* Using flex gap for consistent spacing between action icons */}
                                            <div className="flex items-center gap-4">
                                                {canEditModel && (
                                                    <button
                                                        onClick={() => handleEdit(item)}
                                                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                                    >
                                                        <Edit3 size={16} />
                                                    </button>
                                                )}
                                                {canDeleteModel && (
                                                    <button
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* --- PAGINATION --- */}
                    {/* Pagination is simplified for clarity and ease of use. */}
                    {modelBarang.links && (
                        <div className="flex flex-wrap justify-center gap-2">
                            {modelBarang.links.map((link, i) => (
                                <button
                                    key={i}
                                    onClick={() => link.url && form.get(link.url)}
                                    className={`rounded-md px-3 py-1.5 text-sm font-medium ${
                                        link.active
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 dark:hover:bg-zinc-700'
                                    } ${!link.url ? 'cursor-not-allowed opacity-50' : ''}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    disabled={!link.url}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
