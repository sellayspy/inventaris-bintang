// File: resources/js/Components/AksiDropdown.jsx

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon, DocumentTextIcon, EyeIcon, PencilIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Link, router } from '@inertiajs/react';
import { Fragment } from 'react';
import Swal from 'sweetalert2';

export default function AksiDropdown({ transaksi, handleOpenModal, can }) {
    const handleDelete = (id) => {
        Swal.fire({
            title: 'Anda yakin?',
            text: 'Data yang dihapus tidak dapat dikembalikan!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ya, hapus!',
            cancelButtonText: 'Batal',
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('barang-keluar.destroy', id), {
                    onSuccess: () => Swal.fire('Berhasil!', 'Data telah dihapus.', 'success'),
                    onError: () => Swal.fire('Gagal!', 'Terjadi kesalahan.', 'error'),
                });
            }
        });
    };

    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
                <Menu.Button className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none">
                    Selengkapnya
                    <ChevronDownIcon className="-mr-1 ml-1 h-3 w-3" />
                </Menu.Button>
            </div>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="ring-opacity-5 absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black focus:outline-none">
                    <div className="py-1">
                        {/* Wrapper 'a' untuk Menu.Item yang berupa link */}
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href={route('barang-keluar.cetak-surat', transaksi.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center px-4 py-2 text-left text-xs text-gray-700`}
                                >
                                    <DocumentTextIcon className="mr-3 h-4 w-4 text-gray-500" />
                                    Cetak Surat
                                </a>
                            )}
                        </Menu.Item>
                        <Menu.Item>
                            {({ active }) => (
                                <a
                                    href={route('barang-keluar.cetak-label', transaksi.id)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center px-4 py-2 text-left text-xs text-gray-700`}
                                >
                                    <PrinterIcon className="mr-3 h-4 w-4 text-gray-500" />
                                    Cetak Label
                                </a>
                            )}
                        </Menu.Item>

                        {/* Wrapper 'button' untuk Menu.Item yang berupa aksi */}
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={() => handleOpenModal(transaksi)}
                                    className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center px-4 py-2 text-left text-xs text-gray-700`}
                                >
                                    <EyeIcon className="mr-3 h-4 w-4 text-gray-500" />
                                    Detail
                                </button>
                            )}
                        </Menu.Item>

                        {can.edit && (
                            <Menu.Item>
                                {({ active }) => (
                                    <Link
                                        href={route('barang-keluar.edit', transaksi.id)}
                                        className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center px-4 py-2 text-left text-xs text-gray-700`}
                                    >
                                        <PencilIcon className="mr-3 h-4 w-4 text-gray-500" />
                                        Edit
                                    </Link>
                                )}
                            </Menu.Item>
                        )}

                        {can.delete && (
                            <Menu.Item>
                                {({ active }) => (
                                    <button
                                        onClick={() => handleDelete(transaksi.id)}
                                        className={`${active ? 'bg-gray-100' : ''} group flex w-full items-center px-4 py-2 text-left text-xs text-red-600`}
                                    >
                                        <TrashIcon className="mr-3 h-4 w-4 text-red-500" />
                                        Hapus
                                    </button>
                                )}
                            </Menu.Item>
                        )}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
}
