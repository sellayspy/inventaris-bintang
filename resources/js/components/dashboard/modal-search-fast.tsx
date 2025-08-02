import React from 'react';

interface ModalProps {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300">
            <div
                className="relative w-full max-w-md transform rounded-xl bg-white p-6 shadow-2xl transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none"
                    aria-label="Close modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
