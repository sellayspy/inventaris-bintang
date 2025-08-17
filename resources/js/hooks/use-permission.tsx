import { usePage } from '@inertiajs/react';

interface AuthProps {
    permissions: string[];
}

interface PageProps {
    auth: AuthProps;
    [key: string]: unknown;
}

type PermissionCheck = (name: string) => boolean;
type MultiPermissionCheck = (names: string[]) => boolean;

export function usePermissions() {
    const { auth } = usePage<PageProps>().props;
    const permissions = auth.permissions || [];

    const hasPermission: PermissionCheck = (name) => permissions.includes(name);

    const hasAllPermissions: MultiPermissionCheck = (names) => names.every((name) => permissions.includes(name));

    const hasAnyPermission: MultiPermissionCheck = (names) => names.some((name) => permissions.includes(name));

    return { permissions, hasPermission, hasAllPermissions, hasAnyPermission };
}
