import React from 'react';
import { Modal } from '../ui/Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  isDestructive?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  isDestructive = true,
}: ConfirmationModalProps) {
  const confirmButtonClass = isDestructive
    ? "flex-1 bg-rose-600 text-white py-2.5 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-500/20"
    : "flex-1 btn-primary py-2.5";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-6">{title}</h3>
        <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-amber-100 dark:bg-amber-400/10 border border-amber-300 dark:border-amber-400/20 rounded-2xl">
            <AlertTriangle className="text-amber-700 dark:text-amber-400 shrink-0 mt-1" size={24} />
            <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed font-medium">
                {message}
            </p>
            </div>
            <div className="flex gap-3">
            <button
                onClick={onClose}
                className="flex-1 px-6 py-2.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/5 transition-all"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                className={confirmButtonClass}
            >
                {confirmButtonText}
            </button>
            </div>
        </div>
    </Modal>
  );
}
