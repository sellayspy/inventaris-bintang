import AppLayout from '@/layouts/app-layout';
import { router, usePage } from '@inertiajs/react';

export default function Index() {
    const { roles, flash } = usePage().props as any;

    const handleDelete = (id: number, name: string) => {
        if (confirm(`Hapus role "${name}"?`)) {
            router.delete(route('roles.destroy', id));
        }
    };

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Daftar Role</h1>

                {flash.message && <div className="mb-4 rounded bg-green-100 p-2 text-green-700">{flash.message}</div>}
                {flash.error && <div className="mb-4 rounded bg-red-100 p-2 text-red-700">{flash.error}</div>}

                <a href={route('roles.create')} className="mb-4 inline-block rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                    + Tambah Role
                </a>

                <div className="overflow-x-auto rounded border">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="w-12 border p-2">#</th>
                                <th className="border p-2">Nama</th>
                                <th className="border p-2">Permissions</th>
                                <th className="w-32 border p-2">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((role: any, i: number) => (
                                <tr key={role.id} className="transition hover:bg-gray-50">
                                    <td className="border p-2">{i + 1}</td>
                                    <td className="border p-2 font-medium">{role.name}</td>
                                    <td className="border p-2">
                                        <div className="flex flex-wrap gap-1">
                                            {role.permissions.length > 0 ? (
                                                role.permissions.map((p: any) => (
                                                    <span key={p.id} className="inline-block rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                                                        {p.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="space-x-2 border p-2">
                                        <a href={route('roles.edit', role.id)} className="text-blue-600 hover:underline">
                                            Edit
                                        </a>
                                        <button onClick={() => handleDelete(role.id, role.name)} className="text-red-600 hover:underline">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
