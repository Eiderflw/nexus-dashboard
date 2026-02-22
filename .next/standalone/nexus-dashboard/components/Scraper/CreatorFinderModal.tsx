'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, ShieldCheck, Settings, Users, Radio, Crosshair, AlertTriangle, CheckCircle2, Terminal, Copy, RefreshCw, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Creator } from '@/types';

interface CreatorFinderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Tab = 'search' | 'validate' | 'agency' | 'settings' | 'history';

export default function CreatorFinderModal({ isOpen, onClose }: CreatorFinderModalProps) {
    const [activeTab, setActiveTab] = useState<Tab>('search');
    const [cookie, setCookie] = useState('');
    const [licenseKey, setLicenseKey] = useState('');
    const [licenseStatus, setLicenseStatus] = useState<'valid' | 'invalid' | 'checking'>('checking');
    const [licenseMessage, setLicenseMessage] = useState('');
    const [licenseExpiry, setLicenseExpiry] = useState<string | null>(null);
    const [serverTimeOffset, setServerTimeOffset] = useState<number>(0);
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    // Validate State
    const [validateList, setValidateList] = useState('');
    const [validateListUS, setValidateListUS] = useState('');
    const [isValidating, setIsValidating] = useState(false);
    const [validationResults, setValidationResults] = useState<any[]>([]);

    // Cookie Persistence & History
    const [validationHistory, setValidationHistory] = useState<any[]>([]);

    useEffect(() => {
        const savedCookie = localStorage.getItem('tiktok_session_cookie');
        if (savedCookie) setCookie(savedCookie);

        const savedKey = localStorage.getItem('nexus_license_key');
        if (savedKey) {
            setLicenseKey(savedKey);
            validateLicense(savedKey);
        } else {
            setLicenseStatus('invalid');
            setLicenseMessage('No se ha detectado una licencia. Por favor ingresa tu llave en Configuración.');
        }

        try {
            const savedHistory = localStorage.getItem('scraper_validation_history');
            if (savedHistory) setValidationHistory(JSON.parse(savedHistory));
        } catch (e) { }
        setMounted(true);
    }, []);

    const validateLicense = async (key: string) => {
        setLicenseStatus('checking');
        try {
            // IMPORTANT: Change this URL to your Fly.io deployment URL later!
            const HUB_URL = process.env.NEXT_PUBLIC_HUB_URL || '';
            const res = await fetch(`${HUB_URL}/api/license/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key })
            });
            const data = await res.json();
            if (data.valid) {
                setLicenseStatus('valid');
                setLicenseExpiry(data.expires_at);
                if (data.server_time) {
                    const serverTime = new Date(data.server_time).getTime();
                    const localTime = new Date().getTime();
                    setServerTimeOffset(serverTime - localTime);
                }
            } else {
                setLicenseStatus('invalid');
                setLicenseMessage(data.message || 'Licencia inválida.');
            }
        } catch (e) {
            // Fail open locally if server is down? Or fail closed for security?
            // For now, let's allow trial if Hub is unreachable but notify
            setLicenseMessage('Error conectando al servidor de licencias.');
        }
    };

    // Countdown Logic
    useEffect(() => {
        if (!licenseExpiry) return;

        const updateTimer = () => {
            const now = new Date().getTime() + serverTimeOffset;
            const target = new Date(licenseExpiry).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft('Expirado');
                setLicenseStatus('invalid');
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const secs = Math.floor((diff % (1000 * 60)) / 1000);

            if (days > 0) {
                setTimeLeft(`${days}d ${hours}h ${mins}m`);
            } else {
                setTimeLeft(`${hours}h ${mins}m ${secs}s`);
            }
        };

        const timer = setInterval(updateTimer, 1000);
        updateTimer();
        return () => clearInterval(timer);
    }, [licenseExpiry]);

    const saveHistory = (newResults: any[]) => {
        const updated = [...newResults, ...validationHistory].slice(0, 1000); // Keep last 1000
        setValidationHistory(updated);
        localStorage.setItem('scraper_validation_history', JSON.stringify(updated));
    };

    // Status Polling
    const [statusMessage, setStatusMessage] = useState('');
    const [progressPct, setProgressPct] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isSearching || isValidating) {
            if (!statusMessage) setStatusMessage('Iniciando...');
            setProgressPct(0); // Reset at start
            interval = setInterval(async () => {
                try {
                    const res = await fetch('/scraper_status.json?t=' + Date.now());
                    const data = await res.json();
                    if (data && data.message) {
                        setStatusMessage(data.message);

                        // Map state to percentage integer
                        const stateValues: Record<string, number> = {
                            'initializing': 10,
                            'navigating': 25,
                            'waiting_login': 50,
                            'processing': 75,
                            'completed': 100,
                            'error': 0
                        };
                        if (data.state && typeof stateValues[data.state] === 'number') {
                            setProgressPct(stateValues[data.state]);
                        }
                    }
                } catch (e) { }
            }, 1000);
        } else {
            setStatusMessage('');
            setProgressPct(0);
        }

        return () => clearInterval(interval);
    }, [isSearching, isValidating]);

    const saveCookie = () => {
        localStorage.setItem('tiktok_session_cookie', cookie);
        alert('Cookie guardada correctamente.');
    };

    const saveLicenseKey = () => {
        localStorage.setItem('nexus_license_key', licenseKey);
        validateLicense(licenseKey);
        alert('Llave de licencia guardada. Verificando...');
    };

    // Validation Logic (Batch Processor)
    const handleValidate = async (customList?: string) => {
        const sourceList = typeof customList === 'string' ? customList : validateList;
        const creators = sourceList.split('\n').map(s => s.trim()).filter(s => s.length > 0);
        if (creators.length === 0) return;

        setIsValidating(true);
        setValidationResults([]); // Reset view, but history is kept separately if needed

        const BATCH_SIZE = 30;
        const totalBatches = Math.ceil(creators.length / BATCH_SIZE);

        for (let i = 0; i < totalBatches; i++) {
            const batchConfig = creators.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
            const batchNum = i + 1;

            setStatusMessage(`Validando bloque ${batchNum}/${totalBatches} (${batchConfig.length} usuarios)...`);

            if (licenseStatus !== 'valid') {
                setLicenseMessage('Debes tener una licencia activa para usar el escáner.');
                return;
            }

            try {
                const response = await fetch('/api/scraper/check-agency', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ creators: batchConfig, cookie })
                });

                const data = await response.json();

                if (response.ok) {
                    const newResults = data.results || [];

                    // Update UI immediately with new batch and sort
                    setValidationResults(prev => {
                        const merged = [...prev, ...newResults];
                        // Sort: Disponible first, then others
                        return merged.sort((a, b) => {
                            const aDisp = a.status === 'Disponible' || a.status === 'available';
                            const bDisp = b.status === 'Disponible' || b.status === 'available';
                            if (aDisp && !bDisp) return -1;
                            if (!aDisp && bDisp) return 1;
                            return 0; // Keep original order for the rest
                        });
                    });
                    saveHistory(newResults);

                } else {
                    console.warn("Batch failed", data);
                    // Continue to next batch? Or stop? 
                    // Let's continue but warn
                }
            } catch (error) {
                console.error('Validation Error for batch ' + batchNum, error);
            }

            // Small pause between batches to be safe
            if (i < totalBatches - 1) {
                setStatusMessage(`Esperando 5s para el siguiente bloque...`);
                await new Promise(r => setTimeout(r, 5000));
            }
        }

        setIsValidating(false);
        setStatusMessage('Validación completa.');
    };

    // Search Logic (Real Data)
    const handleSearch = async () => {
        if (!searchQuery) return;

        setIsSearching(true);
        setSearchResults([]);

        try {
            const response = await fetch('/api/scraper/search-lives', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword: searchQuery, cookie })
            });

            const data = await response.json();

            if (response.ok) {
                const creators = data.creators || [];
                setSearchResults(creators); // Now expects objects

                // Auto-fill validation list with found creators (usernames only)
                if (creators.length > 0) {
                    const usernames = creators.map((c: any) => c.username).join('\n');
                    setValidateList(usernames);

                    const usUsernames = creators
                        .filter((c: any) => c.region === 'US' || c.region === 'ESTADOS UNIDOS')
                        .map((c: any) => c.username)
                        .join('\n');
                    setValidateListUS(usUsernames);
                }
            } else {
                alert('Error en la búsqueda: ' + (data.error || 'Desconocido'));
            }
        } catch (error) {
            console.error('Search Error:', error);
            alert('Error de conexión con el robot de búsqueda.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copiado al portapapeles');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-10">
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={onClose} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-[1800px] h-full max-h-[95vh] bg-slate-900 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-[0_0_80px_rgba(16,185,129,0.15)] border border-slate-800"
            >
                {/* Close Button Mobile/Desktop */}
                <div className="absolute top-4 right-4 z-[50] flex items-center gap-4">
                    {licenseStatus === 'valid' && licenseExpiry && mounted && (
                        <div className="flex flex-col items-end">
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 backdrop-blur-md">
                                <Clock className="w-3 h-3 animate-pulse" />
                                <span className="tracking-tighter uppercase">LLAVE: {timeLeft}</span>
                            </div>
                            <div className="text-[8px] text-slate-500 font-bold mt-0.5 pr-1 tracking-wider uppercase">
                                VENCE: {new Date(licenseExpiry).toLocaleDateString()} @ {new Date(licenseExpiry).toLocaleTimeString()}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors border border-slate-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 bg-slate-950/50 border-r border-slate-800 p-4 flex flex-col gap-2">
                    <div className="mb-6 px-2">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Crosshair className="w-6 h-6 text-emerald-500 animate-spin-slow" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">HUNTER</span>
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/30">v1.0</span>
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Módulo de Rastreo y Validación</p>
                    </div>

                    <button
                        onClick={() => setActiveTab('search')}
                        className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                            activeTab === 'search' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <Search className="w-4 h-4" /> Radar en Vivo
                    </button>

                    <button
                        onClick={() => setActiveTab('validate')}
                        className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                            activeTab === 'validate' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]" : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        )}
                    >
                        <ShieldCheck className="w-4 h-4" /> Escáner de Agencia
                    </button>

                    <div className="mt-auto pt-4 border-t border-slate-800">
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={cn("flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium w-full",
                                activeTab === 'settings' ? "bg-slate-800 text-white border border-slate-700" : "text-slate-500 hover:text-slate-300"
                            )}
                        >
                            <Settings className="w-4 h-4" /> Configuración (Cookies)
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md z-10">
                        <div className="flex items-center gap-2">
                            {activeTab === 'search' && <span className="text-lg font-bold text-white flex items-center gap-2"><Radio className="w-5 h-5 text-emerald-500 animate-pulse" /> Radar de Lives Activos</span>}
                            {activeTab === 'validate' && <span className="text-lg font-bold text-white flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Validación de Creadores</span>}
                            {activeTab === 'settings' && <span className="text-lg font-bold text-white">Configuración del Sistema</span>}
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                        <AnimatePresence mode="wait">
                            {activeTab === 'search' && (
                                <motion.div
                                    key="search"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="h-full flex flex-col"
                                >
                                    <div className="flex gap-4 mb-8">
                                        <div className="flex-1 relative group">
                                            <div className="absolute inset-0 bg-emerald-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                                            <input
                                                type="text"
                                                placeholder="Palabras clave (ej: Batalla, PK, Musica, NPC...)"
                                                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-5 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all relative z-10"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 z-10" />
                                        </div>
                                        <button
                                            onClick={handleSearch}
                                            disabled={isSearching}
                                            className={cn("bg-emerald-600 hover:bg-emerald-500 text-white px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2", isSearching && "opacity-50 cursor-not-allowed")}
                                        >
                                            {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Radio className="w-5 h-5" />}
                                            {isSearching ? (statusMessage || 'ESCANEANDO...') : 'ESCANEAR LIVES'}
                                        </button>
                                    </div>

                                    {/* Results List (Clean & Ordered) */}
                                    {searchResults.length > 0 ? (
                                        <div className="flex-1 overflow-y-auto p-4 space-y-2 pr-2 custom-scrollbar">
                                            {searchResults.map((creator, idx) => (
                                                <div key={idx} className="group flex items-center gap-4 bg-slate-950/50 border border-slate-800 p-3 rounded-xl hover:border-emerald-500/50 hover:bg-slate-900/80 transition-all">

                                                    {/* Avatar */}
                                                    <div className="relative flex-shrink-0">
                                                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 group-hover:border-emerald-500 transition-colors">
                                                            <img
                                                                src={creator.avatar || 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default-avatar.png'}
                                                                alt={creator.username}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => e.currentTarget.src = 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default-avatar.png'}
                                                            />
                                                        </div>
                                                        <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 rounded-full border border-slate-900 animate-pulse">
                                                            LIVE
                                                        </div>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-sm font-bold text-white truncate">
                                                                @{creator.username}
                                                            </h3>
                                                            {/* Region Badge */}
                                                            {creator.region && creator.region !== '-' && creator.region !== 'Unknown' && creator.region !== 'Error' && (
                                                                <span className="text-[9px] bg-slate-800 text-yellow-500 px-1.5 py-0.5 rounded border border-slate-700 font-bold font-mono uppercase tracking-wider" title="Región detectada">
                                                                    {creator.region}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Stats Row */}
                                                        <div className="flex items-center gap-3 text-[10px] text-slate-400 my-0.5">
                                                            {/* Viewers */}
                                                            {creator.viewers !== '-' && (
                                                                <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                                                    <Users className="w-3 h-3" /> {creator.viewers}
                                                                </span>
                                                            )}
                                                            {/* Followers */}
                                                            {creator.followers && creator.followers !== '-' && (
                                                                <span className="flex items-center gap-1 hover:text-white transition-colors" title="Seguidores">
                                                                    <Users className="w-3 h-3 text-pink-500" />
                                                                    <span className="font-mono">{creator.followers}</span>
                                                                </span>
                                                            )}
                                                            {/* Videos */}
                                                            {creator.videos && creator.videos !== '-' && (
                                                                <span className="flex items-center gap-1 hover:text-white transition-colors" title="Cantidad de Videos">
                                                                    <div className="w-3 h-3 rounded-sm bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                                                                        <div className="w-0 h-0 border-l-[3px] border-l-blue-400 border-t-[2px] border-t-transparent border-b-[2px] border-b-transparent ml-0.5" />
                                                                    </div>
                                                                    <span className="font-mono">{creator.videos}</span>
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-[10px] text-slate-500 truncate pr-4 italic">
                                                            {creator.title && creator.title !== 'Live' && creator.title !== 'Link Result' ? creator.title : ''}
                                                        </p>
                                                    </div>

                                                    {/* Actions */}
                                                    <button
                                                        onClick={() => {
                                                            setValidateList(prev => {
                                                                const current = prev.split('\n').map(s => s.trim()).filter(Boolean);
                                                                if (!current.includes(creator.username)) {
                                                                    return [...current, creator.username].join('\n');
                                                                }
                                                                return prev;
                                                            });
                                                            setActiveTab('validate');
                                                        }}
                                                        className="flex-shrink-0 px-4 py-2 bg-slate-800 hover:bg-emerald-600 text-emerald-500 hover:text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 border border-slate-700 hover:border-emerald-500"
                                                    >
                                                        <ShieldCheck className="w-4 h-4" /> Validar
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex-1 border-2 border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-600 flex-col gap-4">
                                            <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
                                                <Search className="w-10 h-10 opacity-20" />
                                            </div>
                                            <p>Introduce palabras clave para rastrear emisiones en vivo...</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeTab === 'validate' && (
                                <motion.div
                                    key="validate"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="h-full flex flex-col gap-6"
                                >
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                        {/* Input Area Todos */}
                                        <div className="flex flex-col gap-4">
                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col">
                                                <h3 className="text-sm font-bold text-slate-300 mb-2 flex items-center gap-2">
                                                    <Users className="w-4 h-4 text-blue-400" /> Lista (Todos)
                                                </h3>
                                                <textarea
                                                    className="w-full flex-1 bg-slate-900 border border-slate-700 rounded-lg p-4 text-sm text-slate-300 font-mono focus:outline-none focus:border-blue-500 resize-none min-h-[200px]"
                                                    placeholder="Introduce un usuario por línea..."
                                                    value={validateList}
                                                    onChange={(e) => setValidateList(e.target.value)}
                                                />
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-xs text-slate-500">{validateList.split('\n').filter(l => l.trim()).length} Creadores</span>
                                                    <button
                                                        onClick={() => handleValidate()}
                                                        disabled={isValidating}
                                                        className={cn("bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold text-[10px] shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all flex items-center gap-2", isValidating && "opacity-50 cursor-not-allowed")}
                                                    >
                                                        {isValidating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                                        {isValidating ? 'VERIFICANDO...' : 'VERIFICAR TODOS'}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
                                                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Ayuda</h4>
                                                <ul className="text-xs text-slate-400 space-y-1 list-disc pl-4">
                                                    <li>Ingresa los @usuarios de TikTok.</li>
                                                    <li>Requiere <strong>Session Cookie</strong>.</li>
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Input Area USA */}
                                        <div className="flex flex-col gap-4">
                                            <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex-1 flex flex-col shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                                                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                                    <span className="text-lg">🇺🇸</span> Creadores USA
                                                </h3>
                                                <textarea
                                                    className="w-full flex-1 bg-slate-900 border border-emerald-900/30 rounded-lg p-4 text-sm text-emerald-400 font-mono focus:outline-none focus:border-emerald-500 resize-none min-h-[200px]"
                                                    placeholder="Creadores de EE.UU. aparecerán aquí..."
                                                    value={validateListUS}
                                                    onChange={(e) => setValidateListUS(e.target.value)}
                                                />
                                                <div className="flex justify-between items-center mt-3">
                                                    <span className="text-xs text-slate-500">{validateListUS.split('\n').filter(l => l.trim()).length} Creadores USA</span>
                                                    <button
                                                        onClick={() => handleValidate(validateListUS)}
                                                        disabled={isValidating || !validateListUS.trim()}
                                                        className={cn("bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-[10px] shadow-[0_0_15px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2", (isValidating || !validateListUS.trim()) && "opacity-50 cursor-not-allowed")}
                                                    >
                                                        {isValidating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                                                        {isValidating ? 'VERIFICANDO...' : 'VERIFICAR USA'}
                                                    </button>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleCopy(validateListUS)}
                                                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                                            >
                                                <Copy className="w-4 h-4" /> Copiar Lista USA
                                            </button>
                                        </div>

                                        {/* Results Area */}
                                        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full min-h-[400px]">
                                            <div className="p-3 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
                                                <h3 className="text-sm font-bold text-slate-300">Resultados del Escáner</h3>
                                                <button
                                                    onClick={() => handleCopy(validationResults.filter(r => r.status === 'available' || r.status === 'Disponible').map(r => r.username).join('\n'))}
                                                    className="text-xs text-slate-500 hover:text-white flex items-center gap-1"
                                                >
                                                    <Copy className="w-3 h-3" /> Copiar Disponibles
                                                </button>
                                            </div>

                                            {isValidating && (
                                                <div className="px-4 py-3 bg-slate-900 shadow-inner border-b border-slate-800">
                                                    <div className="flex justify-between items-center mb-1 text-xs">
                                                        <span className="text-blue-400 font-bold flex items-center gap-2">
                                                            <RefreshCw className="w-3 h-3 animate-spin" /> {statusMessage || 'Iniciando...'}
                                                        </span>
                                                        <span className="text-slate-400">{progressPct}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className="bg-blue-500 h-1.5 rounded-full transition-all duration-300 ease-out"
                                                            style={{ width: `${progressPct}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            {validationResults.length > 0 ? (
                                                <div className="flex-1 overflow-y-auto">
                                                    <table className="w-full text-left text-xs">
                                                        <thead className="bg-slate-900 text-slate-400 font-semibold uppercase sticky top-0 z-10">
                                                            <tr>
                                                                <th className="px-4 py-3 text-left w-16">Foto</th>
                                                                <th className="px-4 py-3 text-left">Usuario</th>
                                                                <th className="px-4 py-3 text-left">Estado</th>
                                                                <th className="px-4 py-3 text-left">Tipo Inv.</th>
                                                                <th className="px-4 py-3 text-right">Acción</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-800/50 text-slate-300">
                                                            {validationResults.map((res, i) => (
                                                                <tr key={i} className="hover:bg-slate-900/50 transition-colors row-fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                                                                    <td className="px-4 py-3">
                                                                        <div className={cn(
                                                                            "w-10 h-10 rounded-full flex-shrink-0 relative transition-all duration-300",
                                                                            (res.status === 'Disponible' || res.status === 'available')
                                                                                ? "rgb-star-ring"
                                                                                : (res.status === 'Región no admitida' || res.status === 'En otra agencia' || res.status === 'No disponible')
                                                                                    ? "electric-red-ring"
                                                                                    : "border border-slate-700"
                                                                        )}>
                                                                            {/* Star Ring (Available only) */}
                                                                            {(res.status === 'Disponible' || res.status === 'available') && (
                                                                                <div className="rgb-star-container" />
                                                                            )}

                                                                            {/* Inner container for clipping the image only */}
                                                                            <div className="w-full h-full rounded-full overflow-hidden relative z-[11]">
                                                                                <img
                                                                                    src={res.avatar || 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default-avatar.png'}
                                                                                    alt={res.username}
                                                                                    className="w-full h-full object-cover"
                                                                                    onError={(e) => {
                                                                                        e.currentTarget.src = 'https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/default-avatar.png';
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-300">
                                                                        @{res.username}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {res.status === 'Disponible' || res.status === 'available' ? (
                                                                            <div className="relative inline-flex">
                                                                                <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-rgb-subtle">
                                                                                    <CheckCircle2 className="w-3 h-3" /> Disponible
                                                                                </span>
                                                                                {/* Sparkle Particles */}
                                                                                <div className="sparkle-particle" style={{ top: '-2px', left: '-2px', animationDelay: '0s' }}></div>
                                                                                <div className="sparkle-particle" style={{ bottom: '-2px', right: '-2px', animationDelay: '0.5s' }}></div>
                                                                                <div className="sparkle-particle" style={{ top: '4px', right: '-4px', animationDelay: '1s' }}></div>
                                                                            </div>
                                                                        ) : res.status === 'Región no admitida' ? (
                                                                            <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                                                <AlertTriangle className="w-3 h-3" /> Región no admitida
                                                                            </span>
                                                                        ) : res.status === 'En otra agencia' || (res.details?.toLowerCase().includes('agencia') || res.details?.toLowerCase().includes('signed')) ? (
                                                                            <div className="flex flex-col gap-1 items-start">
                                                                                <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                                                    <AlertTriangle className="w-3 h-3" /> No disponible
                                                                                </span>
                                                                                <span className="text-[10px] text-red-500/80 ml-1 font-bold">En otra agencia</span>
                                                                            </div>
                                                                        ) : res.status === 'Otro motivo' || (res.status === 'No disponible' && res.details?.toLowerCase().includes('motivo')) ? (
                                                                            <div className="flex flex-col gap-1 items-start">
                                                                                <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                                                    <AlertTriangle className="w-3 h-3" /> No disponible
                                                                                </span>
                                                                                <span className="text-[10px] text-red-500/80 ml-1 font-bold">Otro motivo</span>
                                                                            </div>
                                                                        ) : (
                                                                            <div className="flex flex-col gap-1 items-start">
                                                                                <span className="inline-flex items-center gap-1 text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                                                    <AlertTriangle className="w-3 h-3" /> No disponible
                                                                                </span>
                                                                                {res.status !== 'No disponible' && (
                                                                                    <span className="text-[10px] text-red-500/80 ml-1 font-bold">{res.status}</span>
                                                                                )}
                                                                                {res.status === 'No disponible' && res.details && !res.details.toLowerCase().includes('no disponible') && (
                                                                                    <span className="text-[10px] text-red-500/80 ml-1 font-bold italic truncate max-w-[150px]" title={res.details}>{res.details}</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3">
                                                                        {res.inviteType && res.inviteType !== '-' && (
                                                                            <span className={cn(
                                                                                "px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm transition-all animate-premium-pulse inline-flex items-center gap-1.5",
                                                                                res.inviteType.toUpperCase().includes('ELITE')
                                                                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30 shadow-amber-500/10"
                                                                                    : "bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-blue-500/10"
                                                                            )}>
                                                                                <div className={cn(
                                                                                    "w-1.5 h-1.5 rounded-full animate-pulse",
                                                                                    res.inviteType.toUpperCase().includes('ELITE') ? "bg-amber-400" : "bg-blue-400"
                                                                                )} />
                                                                                {res.inviteType}
                                                                            </span>
                                                                        )}
                                                                    </td>
                                                                    <td className="px-4 py-3 text-right">
                                                                        {(res.status === 'Disponible' || res.status === 'available') && (
                                                                            <button
                                                                                onClick={() => handleCopy(res.username)}
                                                                                className="text-blue-400 hover:text-white hover:underline"
                                                                            >
                                                                                Copiar
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex items-center justify-center text-slate-600 flex-col gap-2 p-10 text-center">
                                                    <ShieldCheck className="w-12 h-12 opacity-20 mb-2" />
                                                    <p className="text-sm">Esperando datos...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'history' && (
                                <div className="h-full overflow-y-auto pr-2">
                                    <div className="flex justify-between items-center mb-4 sticky top-0 bg-slate-900 z-10 py-2">
                                        <h3 className="text-lg font-bold text-yellow-400">Historial Reciente</h3>
                                        <div className="text-right">
                                            <span className="text-xs text-slate-400 block">{validationHistory.length} registros</span>
                                            {validationHistory.length > 0 && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('¿Borrar historial?')) {
                                                            setValidationHistory([]);
                                                            localStorage.removeItem('scraper_validation_history');
                                                        }
                                                    }}
                                                    className="text-xs text-red-500 hover:text-red-400 underline"
                                                >
                                                    Limpiar
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pb-4">
                                        {validationHistory.length === 0 && <p className="text-slate-500">No hay historial guardado.</p>}
                                        {validationHistory.map((res, idx) => (
                                            <div key={idx} className="bg-slate-800 p-3 rounded-lg flex justify-between items-center text-sm border border-slate-700 hover:border-slate-600 transition-colors">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-mono text-white font-bold">{res.username}</span>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-500 truncate max-w-[150px]">{res.details || res.status}</span>
                                                        {res.inviteType && res.inviteType !== '-' && (
                                                            <span className={cn("text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider",
                                                                res.inviteType === 'ELITE' || res.inviteType === 'Elite' ? "bg-amber-500/10 text-amber-500 border border-amber-500/50" : "bg-slate-700 text-slate-300"
                                                            )}>
                                                                {res.inviteType}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className={cn("px-2 py-1 rounded text-xs font-bold",
                                                    res.status.includes('Disponible') ? "bg-emerald-900/50 text-emerald-400 border border-emerald-800" :
                                                        res.status.includes('Invitado') ? "bg-blue-900/50 text-blue-400 border border-blue-800" :
                                                            "bg-red-900/50 text-red-400 border border-red-800"
                                                )}>
                                                    {res.status.split(' ')[0]}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="max-w-2xl mx-auto w-full pt-10"
                                >
                                    <div className="bg-slate-950 p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-50" />

                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <Terminal className="w-6 h-6 text-slate-400" />
                                            Configuración de Conexión
                                        </h3>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Backstage Session Cookie</label>
                                                <div className="relative">
                                                    <textarea
                                                        value={cookie}
                                                        onChange={(e) => setCookie(e.target.value)}
                                                        className="w-full h-32 bg-slate-900 border border-slate-700 rounded-xl p-4 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors"
                                                        placeholder="Pega aquí tu cookie de sesión de Tiktok Backstage..."
                                                    />
                                                    <div className="absolute top-2 right-2">
                                                        {cookie && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                                    </div>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">
                                                    ⚠️ Esta cookie es necesaria para validar si un creador está en agencia. Se almacena solo localmente en tu navegador.
                                                </p>
                                            </div>

                                            <div className="pt-4 border-t border-slate-800">
                                                <label className="block text-sm font-medium text-slate-400 mb-2">Llave de Licencia (Nexus Key)</label>
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={licenseKey}
                                                        onChange={(e) => setLicenseKey(e.target.value)}
                                                        className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm font-mono text-blue-400 focus:outline-none focus:border-blue-500 transition-colors"
                                                        placeholder="NEXUS-XXXX-XXXX"
                                                    />
                                                    <button
                                                        onClick={saveLicenseKey}
                                                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                                    >
                                                        Activar
                                                    </button>
                                                </div>
                                                <div className="mt-2 flex items-center gap-2">
                                                    <div className={cn("w-2 h-2 rounded-full",
                                                        licenseStatus === 'valid' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" :
                                                            licenseStatus === 'checking' ? "bg-yellow-500 animate-pulse" : "bg-red-500"
                                                    )} />
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                        Estado: {licenseStatus === 'valid' ? 'Licencia Activa' : licenseStatus === 'checking' ? 'Validando...' : 'Sin Licencia'}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={saveCookie}
                                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 rounded-xl transition-colors border border-slate-700 hover:border-slate-600"
                                            >
                                                Guardar Configuración
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* License Lockout Overlay */}
                        <AnimatePresence>
                            {licenseStatus === 'invalid' && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 text-center"
                                >
                                    <div className="max-w-md w-full space-y-6">
                                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20 mx-auto">
                                            <AlertTriangle className="w-10 h-10 text-red-500 animate-pulse" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
                                            <p className="text-slate-400 text-sm leading-relaxed">
                                                {licenseMessage || 'Tu licencia ha expirado o no es válida. Por favor, contacta con el administrador del sistema para activar tu acceso.'}
                                            </p>
                                        </div>
                                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-3 tracking-widest">Ingresa tu código para desbloquear</p>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={licenseKey}
                                                    onChange={(e) => setLicenseKey(e.target.value)}
                                                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-blue-400 outline-none focus:border-blue-500"
                                                    placeholder="LLAVE-DE-ACCESO"
                                                />
                                                <button
                                                    onClick={saveLicenseKey}
                                                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all"
                                                >
                                                    Desbloquear
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('settings')}
                                            className="text-xs text-slate-500 hover:text-white underline"
                                        >
                                            Ir a configuración
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
