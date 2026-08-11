import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';
import { useIsMobile } from '@/hooks/use-mobile';
import { Modal } from '@/shared/ui/Modal';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function FilterDrawer({ isOpen, onClose, children }: FilterDrawerProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <h3 className="text-2xl font-display font-bold text-slate-900 dark:text-white mb-8">Filter Results</h3>
        <div className="space-y-8">
          {children}
        </div>
        <button
          onClick={onClose}
          className="btn-primary w-full mt-12"
        >
          View Results
        </button>
      </Modal>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-96 bg-white dark:bg-slate-900 z-50 shadow-2xl"
          >
            <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-display font-bold text-slate-900 dark:text-white">Filter Results</h3>
              <button
                onClick={onClose}
                className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
