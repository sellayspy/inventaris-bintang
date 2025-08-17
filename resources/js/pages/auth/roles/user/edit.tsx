// resources/js/Pages/auth/roles/user/Edit.tsx
import { usePage } from '@inertiajs/react';
import UserForm from './user-form';

export default function Edit() {
    const { user, roles, permissions } = usePage().props as any;
    return <UserForm user={user} roles={roles} permissions={permissions} />;
}
