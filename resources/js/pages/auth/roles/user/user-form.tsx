import AppLayout from '@/layouts/app-layout';
import { useForm, usePage } from '@inertiajs/react';
import { Check, Eye, EyeOff, X } from 'lucide-react';
import React, { useState } from 'react';

interface Permission {
    id: number;
    name: string;
    description?: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface PageProps {
    user: User | null;
    roles: string[];
    permissions: Record<string, Permission[]>;
    userRoles: string[];
    userPermissions: string[];
}

export default function UserForm() {
    const { user, roles, permissions: groupedPermissions, userRoles, userPermissions } = usePage<PageProps>().props;
    const isEdit = !!user;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
        roles: userRoles || [],
        permissions: userPermissions || [],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(route('users.update', user.id), { preserveScroll: true });
        } else {
            post(route('users.store'));
        }
    };

    const handleCheckboxChange = (field: 'roles' | 'permissions', value: string) => {
        const currentValues = data[field] as string[];
        if (currentValues.includes(value)) {
            setData(
                field,
                currentValues.filter((v: string) => v !== value),
            );
        } else {
            setData(field, [...currentValues, value]);
        }
    };

    const handleSelectAllPermissions = (groupName: string, isChecked: boolean) => {
        const groupPermissionNames = groupedPermissions[groupName].map((p) => p.name);
        if (isChecked) {
            setData('permissions', [...new Set([...data.permissions, ...groupPermissionNames])]);
        } else {
            setData(
                'permissions',
                data.permissions.filter((p) => !groupPermissionNames.includes(p)),
            );
        }
    };

    const toggleArrayValue = (field: 'roles' | 'permissions', value: string) => {
        setData(field, data[field].includes(value) ? data[field].filter((v: string) => v !== value) : [...data[field], value]);
    };

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{isEdit ? 'Edit Pengguna' : 'Buat Pengguna Baru'}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {isEdit ? 'Perbarui detail dan izin pengguna' : 'Tambahkan pengguna baru ke sistem'}
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <form onSubmit={handleSubmit} className="divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Basic Information Section */}
                        <div className="space-y-6 p-6">
                            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Informasi Dasar</h2>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                            placeholder="Riki Fauzia"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 flex items-center text-sm text-red-600 dark:text-red-400">
                                            <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                            placeholder="user@example.com"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 flex items-center text-sm text-red-600 dark:text-red-400">
                                            <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className="space-y-6 p-6">
                            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Kata Sandi</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {isEdit ? 'Leave blank to keep current password' : 'Set the initial password for this user'}
                            </p>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Kata Sandi {!isEdit && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute top-1/2 right-3 -translate-y-1/2 transform cursor-pointer text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 flex items-center text-sm text-red-600 dark:text-red-400">
                                            <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Konfirmasi Kata Sandi {!isEdit && <span className="text-red-500">*</span>}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 transition duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                            placeholder="••••••••"
                                        />
                                        <div className="absolute top-1/2 right-3 -translate-y-1/2 transform">
                                            {data.password_confirmation &&
                                                (data.password === data.password_confirmation ? (
                                                    <Check className="h-5 w-5 text-green-500" />
                                                ) : (
                                                    <X className="h-5 w-5 text-red-500" />
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Roles & Permissions Section */}
                        <div className="space-y-6 p-6">
                            <h2 className="text-lg font-medium text-gray-800 dark:text-white">Peran & Izin</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">Peran</label>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                        {roles.map((roleName) => (
                                            <label
                                                key={roleName}
                                                className={`flex cursor-pointer items-start rounded-xl border p-3 transition-all duration-200 ${data.roles.includes(roleName) ? 'border-blue-500 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20' : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={data.roles.includes(roleName)}
                                                    onChange={() => handleCheckboxChange('roles', roleName)}
                                                    className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                />
                                                <div className="ml-3 text-sm">
                                                    <span className="font-medium text-gray-800 dark:text-gray-200">{roleName}</span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.roles && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles}</p>}
                                </div>

                                <div className="space-y-6">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Izin Langsung</label>
                                    {Object.keys(groupedPermissions).map((groupName) => {
                                        const permissionsInGroup = groupedPermissions[groupName];
                                        const allInGroupSelected = permissionsInGroup.every((p) => data.permissions.includes(p.name));
                                        return (
                                            <div key={groupName} className="rounded-xl border border-gray-200 p-4 dark:border-gray-700">
                                                <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
                                                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{groupName}</h3>
                                                    <label className="flex cursor-pointer items-center text-sm font-medium">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                            checked={allInGroupSelected}
                                                            onChange={(e) => handleSelectAllPermissions(groupName, e.target.checked)}
                                                        />
                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">Pilih Semua</span>
                                                    </label>
                                                </div>
                                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                    {permissionsInGroup.map((perm) => (
                                                        <label
                                                            key={perm.id}
                                                            className={`flex cursor-pointer items-start rounded-xl border p-3 transition-all duration-200 ${data.permissions.includes(perm.name) ? 'border-blue-500 bg-blue-50/50 dark:border-blue-700 dark:bg-blue-900/20' : 'border-gray-200 hover:border-blue-300 dark:border-gray-700 dark:hover:border-blue-600'}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={data.permissions.includes(perm.name)}
                                                                onChange={() => handleCheckboxChange('permissions', perm.name)}
                                                                className="mt-1 h-4 w-4 flex-shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                                            />
                                                            <div className="ml-3 text-sm">
                                                                <span className="font-medium text-gray-800 dark:text-gray-200">{perm.name}</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {errors.permissions && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Form Footer */}
                        <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-700/50">
                            <button
                                type="submit"
                                disabled={processing}
                                className={`rounded-lg px-6 py-2.5 font-medium transition-all duration-200 ${
                                    processing ? 'cursor-not-allowed bg-blue-400' : 'bg-blue-600 shadow-sm hover:bg-blue-700 hover:shadow-md'
                                } flex items-center text-white`}
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
                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                    />
                                                </svg>
                                                Update User
                                            </>
                                        ) : (
                                            <>
                                                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                                Create User
                                            </>
                                        )}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
