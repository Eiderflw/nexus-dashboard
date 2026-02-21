'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import NexusAcademy from './NexusAcademy';
import { Creator } from '@/types';

interface NexusAcademyModalProps {
    isOpen: boolean;
    onClose: () => void;
    creators: Creator[];
}

export default function NexusAcademyModal({ isOpen, onClose, creators }: NexusAcademyModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0"
                        onClick={onClose}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl custom-scrollbar"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 border border-slate-800"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="p-2">
                            <NexusAcademy creators={creators} />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
