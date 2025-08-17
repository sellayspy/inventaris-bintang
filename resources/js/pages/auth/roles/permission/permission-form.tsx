import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    permission?: {
        id: number;
        name: string;
    };
}

export default function PermissionForm({ permission }: Props) {
    const isEdit = !!permission;

    const { data, setData, post, put, errors, processing } = useForm({
        name: permission?.name || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('permissions.update', permission!.id));
        } else {
            post(route('permissions.store'));
        }
    };

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{isEdit ? 'Edit Izin' : 'Buat Izin Baru'}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEdit ? 'Perbarui detail izin yang ada' : 'Tentukan izin sistem baru'}
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nama Izin
                                    <span className="ml-1 text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 placeholder-gray-400 transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:placeholder-gray-500"
                                        placeholder="misalnya user-create, delete-post"
                                    />
                                    <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                {errors.name && (
                                    <p className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
                                        <svg className="mr-1.5 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {errors.name}
                                    </p>
                                )}
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    Gunakan notasi titik untuk konsistensi (misalnya, "resource-action")
                                </p>
                            </div>

                            <div className="flex justify-end border-t border-gray-100 pt-5 dark:border-gray-700">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={`inline-flex items-center rounded-lg px-5 py-2.5 font-medium transition-all duration-200 ${
                                        processing ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 shadow-sm hover:bg-blue-700 hover:shadow-md'
                                    } text-white`}
                                >
                                    {processing ? (
                                        <>
                                            <svg
                                                className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            {isEdit ? (
                                                <>
                                                    <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                    Perbarui Izin
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="mr-2 -ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Buat Izin
                                                </>
                                            )}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
