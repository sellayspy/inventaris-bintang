import { useForm, usePage } from '@inertiajs/react';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Swal from 'sweetalert2';
import BarangMasukCreate from '../barang-masuk-create';

// Mock Inertia hooks and other dependencies
jest.mock('@inertiajs/react', () => ({
    ...jest.requireActual('@inertiajs/react'),
    usePage: jest.fn(),
    useForm: jest.fn(),
}));
jest.mock('sweetalert2');

// Mock global route function
(global as any).route = jest.fn((name) => name);

const mockUsePage = usePage as jest.Mock;
const mockUseForm = useForm as jest.Mock;
const mockSwal = Swal as jest.Mocked<typeof Swal>;

describe('BarangMasukCreate', () => {
    let mockSetData: jest.Mock;
    let mockPost: jest.Mock;
    let mockReset: jest.Mock;

    const mockProps = {
        kategoriList: [
            { id: 1, nama: 'Printer' },
            { id: 2, nama: 'Scanner' },
        ],
        asalList: [{ id: 1, nama: 'Pembelian' }],
        merekList: [
            { id: 1, nama: 'Epson' },
            { id: 2, nama: 'Canon' },
        ],
        jenisList: [
            { id: 1, nama: 'Inkjet', kategori_id: 1 },
            { id: 2, nama: 'Laser', kategori_id: 1 },
            { id: 3, nama: 'Flatbed', kategori_id: 2 },
        ],
        modelList: [
            { id: 1, nama: 'L3110', jenis_id: 1, merek_id: 1 },
            { id: 2, nama: 'LBP6030', jenis_id: 2, merek_id: 2 },
        ],
        rakList: [],
        errors: {},
    };

    beforeEach(() => {
        mockSetData = jest.fn();
        mockPost = jest.fn();
        mockReset = jest.fn();

        mockUsePage.mockReturnValue({ props: mockProps });

        mockUseForm.mockReturnValue({
            data: {
                tanggal: '2023-10-27',
                asal_barang: '',
                items: [
                    {
                        kategori: '',
                        merek: '',
                        model: '',
                        jenis_barang: '',
                        serial_numbers: [''],
                    },
                ],
            },
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {},
            reset: mockReset,
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the form with initial fields', () => {
        render(<BarangMasukCreate />);

        expect(screen.getByText('Tambah Barang Masuk')).toBeInTheDocument();
        expect(screen.getByLabelText('Tanggal')).toBeInTheDocument();
        expect(screen.getByLabelText('Asal Barang')).toBeInTheDocument();
        expect(screen.getByText('Item #1')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Serial #1')).toBeInTheDocument();
        expect(screen.getByText('Simpan Barang Masuk')).toBeInTheDocument();
    });

    it('allows adding a new item row', () => {
        render(<BarangMasukCreate />);

        const addButton = screen.getByText('+ Tambah Jenis Barang Lain');
        fireEvent.click(addButton);

        expect(mockSetData).toHaveBeenCalledWith('items', [
            { kategori: '', merek: '', model: '', jenis_barang: '', serial_numbers: [''] },
            { kategori: '', merek: '', model: '', jenis_barang: '', serial_numbers: [''] },
        ]);
    });

    it('allows removing an item row', () => {
        mockUseForm.mockReturnValueOnce({
            data: {
                tanggal: '2023-10-27',
                asal_barang: '',
                items: [
                    { kategori: 'A', merek: 'B', model: 'C', jenis_barang: 'D', serial_numbers: ['1'] },
                    { kategori: 'E', merek: 'F', model: 'G', jenis_barang: 'H', serial_numbers: ['2'] },
                ],
            },
            setData: mockSetData,
            post: mockPost,
            processing: false,
            errors: {},
            reset: mockReset,
        });

        render(<BarangMasukCreate />);

        const removeButtons = screen.getAllByText('Hapus Item');
        fireEvent.click(removeButtons[0]);

        expect(mockSetData).toHaveBeenCalledWith('items', [{ kategori: 'E', merek: 'F', model: 'G', jenis_barang: 'H', serial_numbers: ['2'] }]);
    });

    it('allows adding and removing serial number fields', () => {
        render(<BarangMasukCreate />);

        const addSerialButton = screen.getByText('+ Tambah Serial');
        fireEvent.click(addSerialButton);

        expect(mockSetData).toHaveBeenCalledWith('items', [{ kategori: '', merek: '', model: '', jenis_barang: '', serial_numbers: ['', ''] }]);

        mockUseForm.mockReturnValueOnce({
            data: {
                items: [{ serial_numbers: ['SN1', 'SN2'] }],
            },
            setData: mockSetData,
        });

        render(<BarangMasukCreate />);
        const removeSerialButton = screen.getAllByText('Hapus')[0];
        fireEvent.click(removeSerialButton);

        expect(mockSetData).toHaveBeenCalledWith('items', [{ serial_numbers: ['SN2'] }]);
    });

    it('updates an item field value on change', () => {
        render(<BarangMasukCreate />);

        const kategoriInput = screen.getAllByLabelText('Kategori')[0];
        fireEvent.change(kategoriInput, { target: { value: 'Printer' } });

        expect(mockSetData).toHaveBeenCalledWith('items', [
            {
                kategori: 'Printer',
                merek: '',
                model: '',
                jenis_barang: '',
                serial_numbers: [''],
            },
        ]);
    });

    it('updates a serial number value on change', () => {
        render(<BarangMasukCreate />);

        const serialInput = screen.getByPlaceholderText('Serial #1');
        fireEvent.change(serialInput, { target: { value: 'XYZ123' } });

        expect(mockSetData).toHaveBeenCalledWith('items', [
            {
                kategori: '',
                merek: '',
                model: '',
                jenis_barang: '',
                serial_numbers: ['XYZ123'],
            },
        ]);
    });

    it('calls post on form submit and shows success swal', async () => {
        mockPost.mockImplementation((_route, options) => {
            options.onSuccess();
        });

        render(<BarangMasukCreate />);

        const submitButton = screen.getByText('Simpan Barang Masuk');
        fireEvent.click(submitButton);

        expect(mockPost).toHaveBeenCalledWith('barang-masuk.store', expect.any(Object));

        await waitFor(() => {
            expect(mockSwal.fire).toHaveBeenCalledWith({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Data barang masuk berhasil disimpan.',
                timer: 2000,
                showConfirmButton: false,
            });
        });
        expect(mockReset).toHaveBeenCalled();
    });

    it('shows error swal on form submission error', async () => {
        const errors = { 'items.0.kategori': 'Kategori is required.' };
        mockPost.mockImplementation((_route, options) => {
            options.onError(errors);
        });
        mockUseForm.mockReturnValueOnce({
            ...mockUseForm(),
            errors: errors,
            post: mockPost,
        });

        render(<BarangMasukCreate />);

        const submitButton = screen.getByText('Simpan Barang Masuk');
        fireEvent.click(submitButton);

        expect(mockPost).toHaveBeenCalled();

        await waitFor(() => {
            expect(mockSwal.fire).toHaveBeenCalledWith({
                icon: 'error',
                title: 'Gagal',
                text: 'Terjadi kesalahan. Periksa kembali isian form Anda.',
            });
        });
        expect(screen.getByText('Kategori is required.')).toBeInTheDocument();
    });
});
