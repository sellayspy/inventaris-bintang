<?php

namespace App\Http\Controllers\Auth\Roles;

use App\Enums\PermissionEnum;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:' . PermissionEnum::EDIT_USER->value)->only(['edit', 'update']);
        $this->middleware('can:' . PermissionEnum::VIEW_USER->value)->only(['index', 'show']);
        $this->middleware('can:' . PermissionEnum::CREATE_USER->value)->only(['create', 'store']);
        $this->middleware('can:' . PermissionEnum::DELETE_USER->value)->only(['destroy']);
    }

    private function getGroupedAndSortedPermissions()
    {
        $actionOrder = [
            'create' => 1, 'view'   => 2, 'show'   => 2,
            'edit'   => 3, 'update' => 3, 'delete' => 4,
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
        return Inertia::render('auth/roles/user/index', [
            'users' => User::with('roles', 'permissions')->orderBy('name')->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('auth/roles/user/create', [
            'user' => null,
            'roles' => Role::orderBy('name')->get()->pluck('name'),
            'permissions' => $this->getGroupedAndSortedPermissions(),
            'userRoles' => [],
            'userPermissions' => [],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed',],
            'roles' => 'nullable|array',
            'permissions' => 'nullable|array',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Sync roles dan permissions
        $user->syncRoles($request->roles);
        $user->syncPermissions($request->permissions);

        return redirect()->route('users.index')->with('message', 'User berhasil dibuat.');
    }

    public function edit(User $user)
    {
        return Inertia::render('auth/roles/user/edit', [
            'user' => $user,
            'roles' => Role::orderBy('name')->get()->pluck('name'),
            'permissions' => $this->getGroupedAndSortedPermissions(),
            'userRoles' => $user->getRoleNames(),
            'userPermissions' => $user->getDirectPermissions()->pluck('name'),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class.',email,'.$user->id,
            'password' => ['nullable', 'confirmed'],
            'roles' => 'nullable|array',
            'permissions' => 'nullable|array',
        ]);

        if (!empty($validated['password'])) {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
        } else {
            $user->update(Arr::except($validated, ['password']));
        }

        // Sync roles dan permissions
        $user->syncRoles($request->roles);
        $user->syncPermissions($request->permissions);

        return redirect()->route('users.index')->with('message', 'User berhasil diperbarui.');
    }

    public function destroy(User $user)
    {
        // Pencegahan agar user tidak bisa menghapus dirinya sendiri
        if ($user->id === auth()->id()) {
            return redirect()->route('users.index')->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $user->delete();

        return redirect()->route('users.index')->with('message', 'User berhasil dihapus.');
    }

}
