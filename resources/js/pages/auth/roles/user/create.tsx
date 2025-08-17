import { usePage } from '@inertiajs/react';
import UserForm from './user-form';

export default function Create() {
    const { roles, permissions } = usePage().props as any;
    return <UserForm roles={roles} permissions={permissions} />;
}
