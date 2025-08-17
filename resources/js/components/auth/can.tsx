import { usePermissions } from '@/hooks/use-permission';

interface CanProps {
    permission: string;
    children: React.ReactNode;
}

const Can: React.FC<CanProps> = ({ permission, children }) => {
    const { hasPermission } = usePermissions();

    if (!hasPermission(permission)) {
        return null;
    }

    return <>{children}</>;
};

export default Can;
