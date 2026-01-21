import { Skeleton } from '@/components/ui/skeleton';

interface TableSkeletonProps {
    columns?: number;
    rows?: number;
}

export function TableSkeleton({ columns = 6, rows = 5 }: TableSkeletonProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                <thead className="bg-gray-50 dark:bg-zinc-800">
                    <tr>
                        {Array.from({ length: columns }).map((_, i) => (
                            <th key={i} className="px-6 py-3">
                                <Skeleton className="h-4 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-zinc-800">
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex}>
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    <Skeleton className="h-4 w-full" />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function PageSkeleton() {
    return (
        <div className="bg-gray-50 p-4 sm:p-6 dark:bg-zinc-950 animate-pulse">
            <div className="mx-auto max-w-7xl space-y-6">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-48" />
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-32" />
                    </div>
                </div>
                {/* Table skeleton */}
                <TableSkeleton />
                {/* Pagination skeleton */}
                <div className="flex justify-center gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-8 w-10" />
                    ))}
                </div>
            </div>
        </div>
    );
}
