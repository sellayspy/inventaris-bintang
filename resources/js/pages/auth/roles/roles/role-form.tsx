import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import React from 'react';

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface Role {
    id: number;
    name: string;
}

interface PageProps {
    permissions: Record<string, Permission[]>;
    role: Role | null;
    rolePermissions: string[];
}

export default function RoleForm() {
    const { permissions: groupedPermissions, role, rolePermissions } = usePage<PageProps>().props;
    const isEdit = !!role;

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name || '',
        permissions: rolePermissions || [],
    });

    const handlePermissionChange = (permissionName: string) => {
        if (data.permissions.includes(permissionName)) {
            setData(
                'permissions',
                data.permissions.filter((p) => p !== permissionName),
            );
        } else {
            setData('permissions', [...data.permissions, permissionName]);
        }
    };

    const handleSelectAll = (groupName: string, isChecked: boolean) => {
        const groupPermissionNames = groupedPermissions[groupName].map((p) => p.name);

        if (isChecked) {
            // Tambahkan semua permission dari grup ini (hindari duplikat)
            setData('permissions', [...new Set([...data.permissions, ...groupPermissionNames])]);
        } else {
            // Hapus semua permission dari grup ini
            setData(
                'permissions',
                data.permissions.filter((p) => !groupPermissionNames.includes(p)),
            );
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        isEdit ? put(route('roles.update', role.id)) : post(route('roles.store'));
    };

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{isEdit ? 'Ubah Role' : 'Buat Role Baru'}</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                        {isEdit ? 'Perbarui izin peran yang ada' : 'Tentukan peran baru dan tetapkan izin'}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        {/* Form Header */}
                        <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Informasi Peran</h2>
                        </div>

                        {/* Form Body */}
                        <div className="space-y-6 p-6">
                            {/* Name Field */}
                            <div>
                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">Nama Peran</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="block w-full rounded-lg border-gray-300 px-4 py-3 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
                                    placeholder="misalnya administrator, moderator"
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                            </div>

                            {/* Permissions Section */}
                            <div className="space-y-6">
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Izin</label>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Pilih izin untuk peran ini</p>
                                </div>

                                {Object.keys(groupedPermissions).map((groupName) => {
                                    const permissionsInGroup = groupedPermissions[groupName];
                                    const allInGroupSelected = permissionsInGroup.every((p) => data.permissions.includes(p.name));

                                    return (
                                        <div
                                            key={groupName}
                                            className="rounded-lg border border-gray-200 bg-gray-50/50 p-5 dark:border-gray-700 dark:bg-gray-700/30"
                                        >
                                            <div className="mb-4 flex items-center justify-between">
                                                <h3 className="font-medium text-gray-800 dark:text-gray-200">{groupName}</h3>
                                                <label className="flex cursor-pointer items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                        checked={allInGroupSelected}
                                                        onChange={(e) => handleSelectAll(groupName, e.target.checked)}
                                                    />
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">Select All</span>
                                                </label>
                                            </div>
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                {permissionsInGroup.map((perm) => (
                                                    <label
                                                        key={perm.id}
                                                        className={`flex items-center rounded-lg p-3 transition-all duration-200 ${
                                                            data.permissions.includes(perm.name)
                                                                ? 'border-blue-200 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20'
                                                                : 'border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700'
                                                        } border`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={data.permissions.includes(perm.name)}
                                                            onChange={() => handlePermissionChange(perm.name)}
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                        />
                                                        <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">{perm.name}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                                {errors.permissions && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>}
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="flex justify-end border-t border-gray-100 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`inline-flex items-center rounded-md px-5 py-2.5 text-sm font-medium transition-colors ${
                                    processing
                                        ? 'cursor-not-allowed bg-blue-400 text-white'
                                        : 'bg-blue-600 text-white shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none dark:focus:ring-offset-gray-800'
                                }`}
                            >
                                {processing ? (
                                    <>
                                        <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                            ></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : isEdit ? (
                                    'Ubah Peran'
                                ) : (
                                    'Tambah Peran'
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
