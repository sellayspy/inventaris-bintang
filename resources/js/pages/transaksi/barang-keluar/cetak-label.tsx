import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';

type LabelItem = {
    header: string;
    barang_info: string;
    sn: string;
    dipinjamkan_kepada: string;
    lokasi: string;
    tanggal: string;
    peringatan: string;
};

type PageProps = {
    labelData: LabelItem[];
};

export default function CetakLabel() {
    const { labelData } = usePage<PageProps>().props;

    useEffect(() => {
        window.print(); // Cetak otomatis saat halaman terbuka
    }, []);

    return (
        <div className="flex flex-wrap gap-0 p-0 print:gap-0 print:p-0" style={{ fontFamily: 'Arial, sans-serif' }}>
            {labelData.map((data, i) => (
                <div
                    key={i}
                    className="flex flex-col items-center justify-center text-center leading-[1.1] print:break-after-avoid"
                    style={{
                        width: '55mm',
                        height: '20mm',
                        fontSize: '6.5pt',
                        padding: '0.5mm',
                        boxSizing: 'border-box',
                    }}
                >
                    <strong className="mb-0.5" style={{ fontSize: '7pt', textDecoration: 'underline' }}>
                        {data.header}
                    </strong>{' '}
                    {/* Baris 1 */}
                    <div className="mb-0.5">
                        {data.barang_info} {data.sn}
                    </div>{' '}
                    {/* Baris 2, satu baris */}
                    <strong className="mb-0.5" style={{ fontSize: '7pt', textDecoration: 'underline' }}>
                        DIPINJAMKAN KEPADA
                    </strong>{' '}
                    {/* Baris 3 */}
                    <div className="mb-0.5">
                        <strong style={{ fontSize: '7pt' }}>{data.lokasi}</strong>
                    </div>{' '}
                    {/* Baris 4, bold */}
                    <div className="mb-0.5">{data.tanggal}</div> {/* Baris 5 */}
                    <em style={{ fontSize: '4pt' }}>{data.peringatan}</em> {/* Baris 6 */}
                </div>
            ))}
        </div>
    );
}
