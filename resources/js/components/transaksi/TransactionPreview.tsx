import Swal from 'sweetalert2';

interface TransactionItem {
    kategori?: string;
    merek?: string;
    model?: string;
    jenis_barang?: string;
    serial_numbers?: string[];
    keluar_info?: { serial_number: string; status_keluar: string }[];
    rak_nama?: string;
    rak_baris?: string;
}

interface TransactionData {
    tanggal: string;
    lokasi?: string;
    asal_barang?: string;
    items: TransactionItem[];
}

/**
 * Menampilkan preview transaksi sebelum submit menggunakan SweetAlert2
 */
export async function showTransactionPreview(data: TransactionData, type: 'masuk' | 'keluar' | 'kembali'): Promise<boolean> {
    const title = {
        masuk: 'Barang Masuk',
        keluar: 'Barang Keluar',
        kembali: 'Barang Kembali',
    }[type];

    // Hitung total serial
    let totalSerial = 0;
    data.items.forEach((item) => {
        if (item.serial_numbers) {
            totalSerial += item.serial_numbers.filter((s) => s.trim()).length;
        } else if (item.keluar_info) {
            totalSerial += item.keluar_info.filter((k) => k.serial_number.trim()).length;
        }
    });

    // Build HTML preview
    let html = `
        <div class="text-left space-y-4">
            <div class="grid grid-cols-2 gap-2 text-sm border-b pb-3">
                <div class="text-gray-500">Tanggal</div>
                <div class="font-medium">${data.tanggal}</div>
                ${
                    data.lokasi
                        ? `
                    <div class="text-gray-500">Tujuan</div>
                    <div class="font-medium">${data.lokasi}</div>
                `
                        : ''
                }
                ${
                    data.asal_barang
                        ? `
                    <div class="text-gray-500">Asal Barang</div>
                    <div class="font-medium">${data.asal_barang}</div>
                `
                        : ''
                }
            </div>
            
            <div class="space-y-3">
                <div class="text-sm font-semibold text-gray-700">
                    ${data.items.length} Jenis Barang • ${totalSerial} Unit
                </div>
    `;

    data.items.forEach((item, index) => {
        const serialCount =
            item.serial_numbers?.filter((s) => s.trim()).length || item.keluar_info?.filter((k) => k.serial_number.trim()).length || 0;

        html += `
            <div class="rounded border p-3 text-sm">
                <div class="font-medium text-gray-900">
                    #${index + 1}: ${item.merek || ''} ${item.model || ''}
                </div>
                <div class="text-gray-500 text-xs mt-1">
                    ${item.kategori || ''} ${item.jenis_barang ? `• ${item.jenis_barang}` : ''}
                </div>
                <div class="mt-2 text-xs">
                    <span class="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-blue-800">
                        ${serialCount} serial number
                    </span>
                    ${
                        item.rak_nama
                            ? `
                        <span class="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-800 ml-1">
                            Rak: ${item.rak_nama} ${item.rak_baris || ''}
                        </span>
                    `
                            : ''
                    }
                </div>
            </div>
        `;
    });

    html += '</div></div>';

    const result = await Swal.fire({
        title: `Konfirmasi ${title}`,
        html,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Simpan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#2563eb',
        cancelButtonColor: '#6b7280',
        width: '32rem',
    });

    return result.isConfirmed;
}
