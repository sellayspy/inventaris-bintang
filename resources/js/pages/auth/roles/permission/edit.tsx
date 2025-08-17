import { usePage } from '@inertiajs/react';
import PermissionForm from './permission-form';

export default function Edit() {
    const { permission } = usePage().props as any;
    return <PermissionForm permission={permission} />;
}
