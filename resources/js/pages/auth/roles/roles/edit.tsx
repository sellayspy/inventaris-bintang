import { usePage } from '@inertiajs/react';
import RoleForm from './role-form';

export default function Edit() {
    const { role, permissions } = usePage().props as any;
    return <RoleForm role={role} permissions={permissions} />;
}
