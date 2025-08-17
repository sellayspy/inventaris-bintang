import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';

export default function Index() {
    const { users, flash } = usePage().props as any;

    const handleDelete = (user: any) => {
        if (confirm(`Yakin ingin menghapus user "${user.name}"?`)) {
            router.delete(route('users.destroy', user.id));
        }
    };

    return (
        <AppLayout>
            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage all system users and their permissions</p>
                    </div>
                    <a
                        href={route('users.create')}
                        className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow-md"
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Add New User
                    </a>
                </div>

                {/* Flash Messages */}
                {flash.message && (
                    <div className="mb-6 flex items-center rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-green-900/30 dark:text-green-300">
                        <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {flash.message}
                    </div>
                )}
                {flash.error && (
                    <div className="mb-6 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-900/30 dark:text-red-300">
                        <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {flash.error}
                    </div>
                )}

                {/* Table Section */}
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        #
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Name
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Email
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Roles
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Permissions
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase dark:text-gray-300"
                                    >
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                {users.map((user: any, i: number) => (
                                    <tr key={user.id} className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{i + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {user.roles.length > 0 ? (
                                                    user.roles.map((r: any) => (
                                                        <span
                                                            key={r.id}
                                                            className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                        >
                                                            {r.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-wrap gap-1">
                                                {user.permissions.length > 0 ? (
                                                    user.permissions.map((p: any) => (
                                                        <span
                                                            key={p.id}
                                                            className="inline-flex items-center rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                                        >
                                                            {p.name}
                                                        </span>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-gray-400 dark:text-gray-500">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <div className="flex items-center justify-end space-x-3">
                                                <a
                                                    href={route('users.edit', user.id)}
                                                    className="flex items-center text-blue-600 transition-colors duration-200 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="Edit"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                        />
                                                    </svg>
                                                    <span className="sr-only ml-1 sm:not-sr-only">Edit</span>
                                                </a>
                                                <button
                                                    onClick={() => handleDelete(user)}
                                                    className="flex items-center text-red-600 transition-colors duration-200 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                    title="Delete"
                                                >
                                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                        />
                                                    </svg>
                                                    <span className="sr-only ml-1 sm:not-sr-only">Delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Empty State */}
                {users.length === 0 && (
                    <div className="mt-8 rounded-lg border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No users found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating a new user.</p>
                        <div className="mt-6">
                            <a
                                href={route('users.create')}
                                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                            >
                                <svg className="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                New User
                            </a>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
