<?php

namespace App\Http\Controllers\Auth\Roles;

use App\Enums\PermissionEnum;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:' . PermissionEnum::EDIT_PERMISSION->value)->only(['edit', 'update']);
        $this->middleware('can:' . PermissionEnum::VIEW_PERMISSION->value)->only(['index', 'show']);
    }

    public function index()
    {
        $actionOrder = [
            'create'    => 1,
            'view'      => 2,
            'show'      => 2,
            'edit'      => 3,
            'update'    => 3,
            'delete'    => 4,
        ];

        $sortedPermissions = Permission::all()->sortBy(function ($permission) use ($actionOrder) {
            $parts = explode('-', $permission->name,2);

            if (count($parts) !==2) {
                return $permission->name;
            }

            $action = $parts[0];
            $module = $parts[1];

            $order  = $actionOrder[$action] ?? 99;

            return $module .'-' . $order;
        });

        $perPage    = 15;
        $currentPage = Paginator::resolveCurrentPage('page');

        $currentPageItems = $sortedPermissions->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginatedPermissions = new LengthAwarePaginator(
            $currentPageItems,
            $sortedPermissions->count(),
            $perPage,
            $currentPage,
            ['path' => Paginator::resolveCurrentPath()]
        );

        return Inertia::render('auth/roles/permission/index', [
            'permissions' => $paginatedPermissions,
        ]);
    }

    public function create()
    {
        return Inertia::render('auth/roles/permission/permission-form');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name',
        ]);

        Permission::create(['name' => $request->name]);

        return redirect()->route('permissions.index')->with('message', 'Permission berhasil dibuat.');
    }

    public function edit(Permission $permission)
    {
        return Inertia::render('auth/roles/permission/edit', [
            'permission' => $permission,
        ]);
    }

    public function update(Request $request, Permission $permission)
    {
        if ($permission->is_system) {
            return redirect()->back()->with('error', 'Permission sistem tidak dapat diubah.');
        }
        $request->validate([
            'name' => 'required|string|max:255|unique:permissions,name,' . $permission->id,
        ]);

        $permission->update(['name' => $request->name]);

        return redirect()->route('permissions.index')->with('message', 'Permission berhasil diperbarui.');
    }

    public function destroy(Permission $permission)
    {
        if ($permission->is_system) {
            return redirect()->back()->with('error', 'Permission sistem tidak dapat dihapus.');
        }

        $permission->delete();

        return redirect()->route('permissions.index')->with('message', 'Permission berhasil dihapus.');
    }
}
