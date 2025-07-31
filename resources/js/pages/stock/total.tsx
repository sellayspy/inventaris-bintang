import StockFilterTable from '@/components/table/stock-filter-table';
import AppLayout from '@/layouts/app-layout';
import { usePage } from '@inertiajs/react';

export default function Total() {
    const { items, filters, kategoriList, lokasiList } = usePage().props as any;
    return (
        <AppLayout>
            <StockFilterTable
                title="Stok Total"
                route="/stok/total"
                items={items}
                filters={filters}
                kategoriList={kategoriList}
                lokasiList={lokasiList}
            />
        </AppLayout>
    );
}
