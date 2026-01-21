import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

/**
 * Global loading indicator yang muncul saat navigasi Inertia
 * Hanya tampilkan jika loading lebih dari 250ms untuk menghindari flash
 */
export function GlobalLoadingIndicator() {
    const [loading, setLoading] = useState(false);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;

        const handleStart = () => {
            setLoading(true);
            // Delay sebelum menampilkan indicator (hindari flash pada navigasi cepat)
            timeout = setTimeout(() => {
                setShowIndicator(true);
            }, 300);
        };

        const handleFinish = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            setLoading(false);
            setShowIndicator(false);
        };

        router.on('start', handleStart);
        router.on('finish', handleFinish);

        return () => {
            if (timeout) clearTimeout(timeout);
            router.off('start', handleStart);
            router.off('finish', handleFinish);
        };
    }, []);

    // Tidak tampilkan apapun jika tidak loading atau loading kurang dari delay
    if (!loading || !showIndicator) return null;

    return (
        <>
            {/* Overlay transparan - tidak menghalangi konten */}
            <div className="fixed top-0 right-0 left-0 z-[9999]">
                {/* Progress bar animasi */}
                <div className="h-1 w-full bg-gray-200/50 dark:bg-zinc-800/50">
                    <div
                        className="h-full animate-pulse bg-blue-500"
                        style={{
                            width: '100%',
                            animation: 'loading-progress 1s ease-in-out infinite',
                        }}
                    />
                </div>
            </div>
            {/* Spinner di pojok kanan atas */}
            <div className="fixed top-4 right-4 z-[9999]">
                <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900/95">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Memuat...</span>
                </div>
            </div>
            <style>{`
                @keyframes loading-progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </>
    );
}
