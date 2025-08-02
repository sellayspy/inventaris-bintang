import { router } from '@inertiajs/react';

export default function Pagination({ links }: { links: any[] }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-2">
            {links.map((link, index) => (
                <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`rounded px-3 py-1 text-sm ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                />
            ))}
        </div>
    );
}
