"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Key, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginGate({ children }: { children: React.ReactNode }) {
    const [isElectron, setIsElectron] = useState(false);
    const [licenseStatus, setLicenseStatus] = useState<'checking' | 'valid' | 'invalid'>('checking');
    const [licenseKey, setLicenseKey] = useState('');
    const [licenseMessage, setLicenseMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // More robust Electron detection
        const checkElectron = () => {
            const electronEnabled = typeof window !== 'undefined' &&
                ((window as any).nexusHunter?.isElectron ||
                    navigator.userAgent.toLowerCase().includes('electron'));

            console.log('[Nexus-Auth] Entorno detectado:', electronEnabled ? 'Electron' : 'Browser');
            setIsElectron(!!electronEnabled);

            if (electronEnabled) {
                const savedKey = localStorage.getItem('nexus_license_key');
                console.log('[Nexus-Auth] Llave guardada:', savedKey ? 'Encontrada' : 'No encontrada');
                if (savedKey) {
                    setLicenseKey(savedKey);
                    validateLicense(savedKey);
                } else {
                    setLicenseStatus('invalid');
                }
            } else {
                setLicenseStatus('valid');
            }
        };

        checkElectron();
        // Fallback in case injections are slow
        const timer = setTimeout(checkElectron, 500);
        return () => clearTimeout(timer);
    }, []);

    const validateLicense = async (key: string) => {
        setIsLoading(true);
        setLicenseMessage('');
        try {
            // Get local HWID from Electron process
            let hwid = '';
            if (typeof window !== 'undefined' && (window as any).nexusHunter) {
                hwid = await (window as any).nexusHunter.execute({ action: 'get-hwid' });
            }

            const res = await fetch('/api/license/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, hwid })
            });

            const data = await res.json();
            if (data.valid) {
                localStorage.setItem('nexus_license_key', key);
                setLicenseStatus('valid');
            } else {
                setLicenseStatus('invalid');
                setLicenseMessage(data.message || 'Licencia inválida.');
            }
        } catch (e) {
            setLicenseMessage('Error conectando al servidor.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isElectron) return <>{children}</>;

    return (
        <AnimatePresence>
            {licenseStatus !== 'valid' ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center p-6"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />

                    <div className="relative w-full max-w-md">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 relative">
                                <Shield className="w-10 h-10 text-emerald-500" />
                                <div className="absolute -inset-1 bg-emerald-500/20 blur-xl rounded-full opacity-50" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Nexus Hunter</h1>
                            <p className="text-slate-400">Acceso Restringido • Requiere Licencia</p>
                        </div>

                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 shadow-2xl">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                                        Código de Activación
                                    </label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-emerald-500 transition-colors">
                                            <Key className="w-5 h-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="text"
                                            value={licenseKey}
                                            onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                                            placeholder="XXXX-XXXX-XXXX"
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all font-mono tracking-wider"
                                        />
                                    </div>
                                </div>

                                {licenseMessage && (
                                    <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 animate-in fade-in slide-in-from-top-1">
                                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                        <p className="text-sm text-red-400 font-medium">{licenseMessage}</p>
                                    </div>
                                )}

                                <button
                                    onClick={() => validateLicense(licenseKey)}
                                    disabled={isLoading || !licenseKey}
                                    className="w-full group relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-emerald-600 text-white font-bold py-4 rounded-xl transition-all h-[56px] flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                >
                                    {isLoading ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <Lock className="w-5 h-5 group-hover:-translate-y-px transition-transform" />
                                            <span>DESBLOQUEAR AHORA</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-white/5 text-center">
                                <p className="text-slate-500 text-xs font-medium">
                                    Si no tienes una llave, contacta a tu administrador.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <>{children}</>
            )}
        </AnimatePresence>
    );
}
