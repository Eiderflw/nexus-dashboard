'use client';

import { useState } from 'react';
import { Radio, RefreshCw, Wifi, WifiOff, Users, Diamond, CheckCircle, Activity, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists
import { AnimatePresence, motion } from 'framer-motion';
import { mapTiKTokAnalysisToCreators } from '@/lib/tiktok-mapper';
import { useCreatorStore } from '@/store/useCreatorStore';

export default function LivePanel() {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const TIKTOK_API_URL = "https://live-backstage.tiktok.com/portal/data/data";

    const { setCreators } = useCreatorStore();

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Start Sync (Fire and Forget)
            const encodedUrl = encodeURIComponent(TIKTOK_API_URL);
            const startRes = await fetch(`/api/tiktok/proxy?url=${encodedUrl}`);
            const startJson = await startRes.json();

            if (startJson.error) throw new Error(startJson.error);

            // 2. Poll for Completion (Max 3 mins)
            const startTime = Date.now();
            while (Date.now() - startTime < 180000) {
                await new Promise(r => setTimeout(r, 2000));

                try {
                    const statusRes = await fetch(`/sync_status.json?t=${Date.now()}`);
                    if (!statusRes.ok) continue;

                    const status = await statusRes.json();

                    // Check if this status is fresh (from this run) or old?
                    // Ideally we'd check timestamp, but let's assume "running" means this run or "success" with recent timestamp.
                    // For now, simpler: just check status.

                    if (status.status === 'success') {
                        // 3. Fetch Final Data
                        const dataRes = await fetch(`/tiktok_full_data.json?t=${Date.now()}`);
                        const finalData = await dataRes.json();

                        setData(finalData);
                        setLastUpdated(new Date(status.timestamp));

                        if (finalData.analysis) {
                            console.log("Sync Complete. Updating Store.");
                            const mappedCreators = mapTiKTokAnalysisToCreators(finalData.analysis);
                            if (mappedCreators.length > 0) {
                                setCreators(mappedCreators);
                            }
                        }
                        return; // Done
                    }

                    if (status.status === 'error') {
                        throw new Error(status.error || 'Error en el script de sincronización');
                    }
                } catch (e) {
                    // Ignore JSON parse errors during polling (race conditions)
                }
            }
            throw new Error("Tiempo de espera agotado (3 min). Verifique el servidor.");

        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8 relative overflow-hidden group">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none -mr-32 -mt-32" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Activity className="w-6 h-6 text-purple-400" />
                        PANEL ONLINE
                        {loading && <span className="text-xs font-normal text-purple-400/80 animate-pulse">Sincronizando...</span>}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">
                        Conexión en Tiempo Real con TikTok Backstage
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {lastUpdated && (
                        <span className="text-xs text-slate-500 font-mono hidden md:block">
                            Actualizado: {lastUpdated.toLocaleTimeString()}
                        </span>
                    )}
                    <button
                        onClick={fetchData}
                        disabled={loading}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all shadow-lg",
                            loading
                                ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                                : "bg-purple-600 hover:bg-purple-500 text-white hover:shadow-purple-500/25 active:scale-95"
                        )}
                    >
                        {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Wifi className="w-4 h-4" />
                        )}
                        {loading ? 'Conectando...' : 'Sincronizar Ahora'}
                    </button>
                </div>
            </div>

            {/* Error Display */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4 text-red-400"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <span className="font-semibold">{error}</span>
                        </div>
                        {data?.raw && (
                            <details className="mt-2 text-xs text-red-300">
                                <summary className="cursor-pointer hover:text-red-200">Ver respuesta raw (Debug)</summary>
                                <pre className="mt-2 p-2 bg-black/40 rounded overflow-x-auto whitespace-pre-wrap">
                                    {data.raw}
                                </pre>
                            </details>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {data?.analysis && (
                <div className="mb-4 bg-emerald-900/20 border border-emerald-500/30 p-3 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-emerald-500/20 p-1.5 rounded-full">
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-emerald-400">Datos Históricos Actualizados</div>
                            <div className="text-[10px] text-emerald-500/70">
                                {data.analysis.data?.anchorAnalysisDataInfos?.length || 0} creadores procesados
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Data Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Live Data Rendering */}
                {data?.live?.data?.online_anchor_list?.map((item: any) => {
                    const info = item.user_base_info;
                    // Live data usually has different field names. Mapping based on common TikTok API.
                    // If fields are missing, we fallback gracefully.
                    const viewerCount = item.authorization_info?.viewer_count || item.viewer_count || 0;
                    const diamondCount = item.income_info?.diamond_count || 0;
                    const duration = item.live_info?.duration || 0;

                    return (
                        <div key={info.user_id} className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 flex flex-col gap-3 relative overflow-hidden group/card hover:border-purple-500/30 transition-all hover:bg-slate-900/60">
                            {/* Live Badge */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-red-500 tracking-wider">LIVE</span>
                            </div>

                            {/* User Header */}
                            <div className="flex items-center gap-3">
                                <img src={info.avatar_url || info.avatar} alt={info.nickname} className="w-10 h-10 rounded-full border border-slate-700 object-cover" />
                                <div>
                                    <div className="text-sm font-bold text-white leading-tight">{info.nickname}</div>
                                    <div className="text-[10px] text-slate-500 font-mono">@{info.display_id}</div>
                                </div>
                            </div>

                            {/* Metrics Grid */}
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                        <Diamond className="w-3 h-3 text-cyan-400" /> Diamantes
                                    </div>
                                    <div className="text-sm font-mono font-bold text-white">
                                        {diamondCount.toLocaleString()}
                                    </div>
                                </div>
                                <div className="bg-slate-900/50 p-2 rounded-lg border border-slate-800/50">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5 flex items-center gap-1">
                                        <Users className="w-3 h-3 text-purple-400" /> Espectadores
                                    </div>
                                    <div className="text-sm font-mono font-bold text-white">
                                        {viewerCount.toLocaleString()}
                                    </div>
                                </div>
                                <div className="col-span-2 bg-slate-900/50 p-2 rounded-lg border border-slate-800/50 flex justify-between items-center">
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Duración</div>
                                    <div className="text-xs font-mono text-slate-300">
                                        {Math.floor(duration / 60)}m {duration % 60}s
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {(!data?.live?.data?.online_anchor_list || data.live.data.online_anchor_list.length === 0) && !loading && (
                    <div className="col-span-full py-8 text-center text-slate-500 italic flex flex-col items-center gap-2">
                        <WifiOff className="w-8 h-8 opacity-20" />
                        No hay creadores en vivo detectados.
                        {data?.analysis && <span className="text-xs text-emerald-500">Pero los datos históricos se han actualizado correctamente.</span>}
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 text-[10px] text-slate-600 text-center">
                * Nota: Al sincronizar, se abrirá una ventana de Chrome en el servidor (tu PC) para validar la sesión de TikTok. No la cierres manualmente.
            </div>
        </div>
    );
}
