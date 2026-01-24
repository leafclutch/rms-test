import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import Modal from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    isLoading = false
}) => {
    const variantStyles = {
        danger: {
            bg: 'bg-red-50',
            iconBg: 'bg-red-100',
            icon: <Trash2 className="w-6 h-6 text-red-600" />,
            button: 'bg-red-600 hover:bg-red-700 text-white shadow-red-200'
        },
        warning: {
            bg: 'bg-orange-50',
            iconBg: 'bg-orange-100',
            icon: <AlertTriangle className="w-6 h-6 text-orange-600" />,
            button: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200'
        },
        info: {
            bg: 'bg-blue-50',
            iconBg: 'bg-blue-100',
            icon: <AlertTriangle className="w-6 h-6 text-blue-600" />,
            button: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
        }
    };

    const style = variantStyles[variant];

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
            <div className="relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute -top-2 -right-2 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`w-16 h-16 ${style.iconBg} rounded-2xl flex items-center justify-center animate-in zoom-in duration-300`}>
                            {style.icon}
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-900 leading-tight">
                                {title}
                            </h3>
                            <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1 px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                // We don't automatically close here to allow for async loading states
                            }}
                            disabled={isLoading}
                            className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 ${style.button}`}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                confirmLabel
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
