import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div
            className="flex min-h-svh items-center justify-center bg-cover bg-center p-4"
            style={{
                backgroundImage: "url('/images/background-login.jpg')",
            }}
        >
            {/* Overlay opsional agar background tidak terlalu terang */}
            <div className="absolute inset-0 z-0 bg-black/60" />

            {/* Right side with login form */}
            <div className="relative z-10 flex w-full items-center justify-center p-4 md:w-1/2">
                <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-gray-800">
                    <div className="flex flex-col items-center">
                        <Link href={route('home')} className="mb-6">
                            <div className="flex items-center gap-3">
                                <InventoryIcon className="text-primary-600 dark:text-primary-400 h-10 w-10" />
                                <span className="text-2xl font-bold text-gray-800 dark:text-white">Inventaris Gudang</span>
                            </div>
                        </Link>

                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}

// Custom inventory icons component
function InventoryIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M20 7h-3V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2z" />
            <path d="M9 5h6v2H9z" />
            <path d="M12 12v3" />
            <path d="M12 12h-3" />
            <path d="M12 12h3" />
        </svg>
    );
}

function Boxes({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
            <path d="m7 16.5-4.74-2.85" />
            <path d="m7 16.5 5-3" />
            <path d="M7 16.5v5.17" />
            <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
            <path d="m17 16.5-5-3" />
            <path d="m17 16.5 4.74-2.85" />
            <path d="M17 16.5v5.17" />
            <path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z" />
            <path d="M12 8 7.26 5.15" />
            <path d="M12 8l4.74-2.85" />
            <path d="M12 13.5V8" />
        </svg>
    );
}
