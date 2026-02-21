'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { RefreshCcw, CheckCircle2, AlertCircle, Play, Pause, Trash2, X, AlertTriangle, Image as ImageIcon, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Creator } from '@/types';

export function PhotoManager({ creators }: { creators: Creator[] }) {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showErrors, setShowErrors] = useState(false);

    const checkStatus = useCallback(async () => {
        try {
            const res = await fetch('/api/scraper/manager');
            const data = await res.json();
            setStatus(data);
        } catch (err) {
            console.error('Error status check:', err);
        }
    }, []);

    // Poll status regardless of modal state to update header progress
    useEffect(() => {
        checkStatus();
        // Poll every 2 seconds for smoother progress
        const interval = setInterval(checkStatus, 2000);
        return () => clearInterval(interval);
    }, [checkStatus]);

    const handleAction = async (action: 'start' | 'stop' | 'resume' | 'reset') => {
        setIsLoading(true);
        try {
            const body: any = { action };
            if (action === 'start') {
                body.usernames = creators.map(c => c.username);
            }
            await fetch('/api/scraper/manager', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            await checkStatus();
        } catch (err) {
            alert('Error al procesar acción');
        } finally {
            setIsLoading(false);
        }
    };

    // Use Portal to escape parent stacking contexts (e.g. sticky nav with backdrop-filter)
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isRunning = status?.isRunning;
    const progress = status ? (status.currentIndex / status.total) * 100 : 0;
    const hasQueue = status?.total > 0;
    const isPaused = !isRunning && hasQueue && status.currentIndex < status.total;

    const modalContent = (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="bg-slate-900 rounded-[2rem] border border-slate-700/50 w-full max-w-lg shadow-2xl relative flex flex-col overflow-hidden max-h-[85vh]"
                        style={{ margin: 'auto' }} // Extra safety for centering
                    >
                        {/* Header Compacto */}
                        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-slate-800/30 shrink-0">
                            <div>
                                <h3 className="text-base font-black tracking-widest uppercase text-slate-100 flex items-center gap-2">
                                    Nexus Scraper
                                    {isRunning && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                                </h3>
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Mantenimiento de Fotos</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white transition-colors border border-slate-700 text-[10px] font-bold uppercase flex items-center gap-1.5"
                            >
                                <Minus className="w-3 h-3" /> Minimizar
                            </button>
                        </div>

                        <div className="p-5 overflow-y-auto custom-scrollbar">
                            {hasQueue ? (
                                <div className="space-y-4">
                                    {/* Status Card */}
                                    <div className="bg-black/40 rounded-2xl p-4 border border-white/5 shadow-inner">
                                        <div className="flex justify-between items-end mb-3">
                                            <div className="space-y-0.5">
                                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter">Usuario Actual</p>
                                                <p className="text-white font-mono text-xs font-bold truncate max-w-[200px] flex items-center gap-2">
                                                    {status.currentUsername || "..."}
                                                    {isRunning && <RefreshCcw className="w-3 h-3 animate-spin text-blue-500" />}
                                                </p>
                                            </div>
                                            <span className="text-lg font-black text-white">{Math.round(progress)}%</span>
                                        </div>

                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden mb-4 border border-slate-700/50">
                                            <motion.div
                                                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 flex flex-col items-center">
                                                <span className="text-emerald-500 text-[9px] font-black uppercase">Éxito</span>
                                                <span className="text-xl font-black text-emerald-400">{status.successCount}</span>
                                            </div>
                                            <button
                                                onClick={() => setShowErrors(true)}
                                                className="bg-rose-500/5 border border-rose-500/10 rounded-xl p-3 flex flex-col items-center hover:bg-rose-500/10 transition-colors group/error"
                                            >
                                                <span className="text-rose-500 text-[9px] font-black uppercase">Fallos</span>
                                                <span className="text-xl font-black text-rose-400">{status.errorCount}</span>
                                                <span className="text-[8px] text-rose-500/50 uppercase font-bold mt-1 group-hover/error:text-rose-500">Ver Logs</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        {isRunning ? (
                                            <button
                                                onClick={() => handleAction('stop')}
                                                disabled={isLoading}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-black uppercase tracking-wider text-[10px] hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                                            >
                                                <Pause className="w-3 h-3 fill-white" /> Pausar
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAction(isPaused ? 'resume' : 'start')}
                                                disabled={isLoading}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 text-white font-black uppercase tracking-wider text-[10px] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
                                            >
                                                <Play className="w-3 h-3 fill-white" /> {isPaused ? 'Reanudar' : 'Iniciar'}
                                            </button>
                                        )}

                                        {!isRunning && (
                                            <button
                                                onClick={() => handleAction('reset')}
                                                disabled={isLoading}
                                                className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 font-black uppercase tracking-wider text-[10px] hover:bg-slate-700 transition-all active:scale-95 border border-white/5"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleAction('start')}
                                    disabled={isLoading}
                                    className="w-full py-8 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/30 font-black uppercase tracking-widest flex flex-col items-center justify-center gap-3 transition-all shadow-2xl shadow-blue-500/20 active:scale-95"
                                >
                                    <RefreshCcw className="w-6 h-6" />
                                    <span className="text-xs">Sincronizar Fotos</span>
                                </button>
                            )}
                        </div>

                        {/* Error Logs Overlay */}
                        <AnimatePresence>
                            {showErrors && (
                                <div className="absolute inset-0 z-[10000] flex items-center justify-center bg-slate-950/95 p-4">
                                    <div className="w-full h-full flex flex-col">
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-900">
                                            <h2 className="text-sm font-black text-white uppercase tracking-tighter flex items-center gap-2">
                                                <AlertTriangle className="text-rose-500 w-4 h-4" /> Logs de Error
                                            </h2>
                                            <button onClick={() => setShowErrors(false)} className="p-1 rounded-full bg-white/10 text-white"><X className="w-4 h-4" /></button>
                                        </div>
                                        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                            {status?.errorLogs && Object.keys(status.errorLogs).length > 0 ? (
                                                Object.entries(status.errorLogs).map(([username, error]: [string, any]) => (
                                                    <div key={username} className="text-[10px] p-2 bg-white/5 rounded border border-white/5 flex justify-between items-center">
                                                        <span className="font-mono text-white">@{username}</span>
                                                        <span className="text-rose-400 truncate max-w-[120px] text-right" title={String(error)}>{error}</span>
                                                    </div>
                                                ))
                                            ) : <div className="text-center text-slate-500 py-10 text-xs">Sin errores registrados</div>}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );

    return (
        <div className="flex items-center gap-3">
            {/* Trigger / Status Area - Header */}
            {isRunning ? (
                <div className="flex items-center gap-2 bg-slate-900/80 rounded-lg p-1 pr-3 border border-slate-700 overflow-hidden shadow-lg shadow-blue-900/20">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider transition-all rounded-md flex items-center gap-2 shadow-sm"
                    >
                        <RefreshCcw className="w-3 h-3 animate-spin" />
                        <span>Sincronizando</span>
                    </button>
                    <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                            <motion.div
                                className="h-full bg-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-blue-400 w-8 text-right">{Math.round(progress)}%</span>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700"
                >
                    <ImageIcon className="w-4 h-4" />
                    Scraper Fotos
                </button>
            )}

            {/* Render Modal via Portal if mounted */}
            {mounted && typeof document !== 'undefined' ? (
                // @ts-ignore
                createPortal(modalContent, document.body)
            ) : null}
        </div>
    );
}
