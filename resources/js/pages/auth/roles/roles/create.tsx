import { usePage } from '@inertiajs/react';
import RoleForm from './role-form';

export default function Create() {
    const { permissions } = usePage().props as any;
    return <RoleForm permissions={permissions} />;
}
