<?php

namespace App\Http\Controllers\Auth\Roles;

use App\Enums\PermissionEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:' . PermissionEnum::EDIT_ROLE->value)->only(['edit', 'update']);
        $this->middleware('can:' . PermissionEnum::VIEW_ROLE->value)->only(['index', 'show']);
        $this->middleware('can:' . PermissionEnum::CREATE_ROLE->value)->only(['create', 'store']);
        $this->middleware('can:' . PermissionEnum::DELETE_ROLE->value)->only(['destroy']);
    }

    private function getGroupedAndSortedPermissions()
    {
        $actionOrder = [
            'create' => 1,
            'view'   => 2,
            'show'   => 2,
            'edit'   => 3,
            'update' => 3,
            'delete' => 4,
        ];

        $grouped = Permission::all()->groupBy(function ($permission) {

            $parts = explode('-', $permission->name, 2);
            return count($parts) > 1 ? ucfirst($parts[1]) : 'Lainnya';
        });

        return $grouped->map(function ($group) use ($actionOrder) {
            return $group->sortBy(function ($permission) use ($actionOrder) {
                $parts = explode('-', $permission->name, 2);
                $action = $parts[0];
                return $actionOrder[$action] ?? 99;
            })->values();
        });
    }

    public function index()
    {
        return Inertia::render('auth/roles/roles/index', [
            'roles' => Role::with('permissions')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('auth/roles/roles/role-form', [
            'permissions' => $this->getGroupedAndSortedPermissions(),
            'role' => null,
            'rolePermissions' => [],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'permissions' => 'nullable|array',
        ]);

        $role = Role::create(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('message', 'Role berhasil dibuat.');
    }

    public function edit(Role $role)
    {
        return Inertia::render('auth/roles/roles/edit', [
            'role' => $role,
            'permissions' => $this->getGroupedAndSortedPermissions(),
            'rolePermissions' => $role->permissions->pluck('name')->toArray(),
        ]);
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
        ]);

        $role->update(['name' => $request->name]);
        $role->syncPermissions($request->permissions);

        return redirect()->route('roles.index')->with('message', 'Role berhasil diperbarui.');
    }

    public function destroy(Role $role)
    {
        // Jangan hapus role Super-Admin
        if ($role->name === 'super-admin') {
            return redirect()->route('roles.index')->with('error', 'Tidak dapat menghapus role Super-Admin.');
        }

        $role->delete();

        return redirect()->route('roles.index')->with('message', 'Role berhasil dihapus.');
    }
}
