import { Link } from '@inertiajs/react';

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginatorLink[];
}

export default function Pagination({ links }: PaginationProps) {
    if (links.length < 3) {
        return null;
    }

    return (
        <div className="-mb-1 flex flex-wrap">
            {links.map((link, index) => {
                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className="mr-1 mb-1 rounded border px-4 py-3 text-sm leading-4 text-gray-400"
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                const className = link.active
                    ? 'mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded bg-indigo-600 text-white focus:outline-none'
                    : 'mr-1 mb-1 px-4 py-3 text-sm leading-4 border rounded hover:bg-white focus:border-indigo-500 focus:text-indigo-500';

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={className}
                        preserveScroll // <-- JANGAN TAMBAHKAN preserveState di sini
                    >
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    </Link>
                );
            })}
        </div>
    );
}
