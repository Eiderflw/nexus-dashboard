'use client';

import { useState, useEffect } from 'react';
import { HistorySnapshot, compareSnapshots, ComparisonResult } from '@/lib/history';
import { ArrowLeft, ArrowRight, TrendingUp, TrendingDown, Users, Calendar, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import AuthGuard from '@/components/AuthGuard';

export default function HistoryPage() {
    const [snapshots, setSnapshots] = useState<HistorySnapshot[]>([]);
    const [dateA, setDateA] = useState<string>('');
    const [dateB, setDateB] = useState<string>('');
    const [comparison, setComparison] = useState<ComparisonResult | null>(null);

    useEffect(() => {
        fetch('/api/history')
            .then(res => res.json())
            .then(data => {
                if (data.snapshots) {
                    setSnapshots(data.snapshots);
                    // Default to latest two if available
                    if (data.snapshots.length >= 2) {
                        setDateB(data.snapshots[0].date); // Newest
                        setDateA(data.snapshots[1].date); // Previous
                    } else if (data.snapshots.length === 1) {
                        setDateB(data.snapshots[0].date);
                        setDateA(data.snapshots[0].date);
                    }
                }
            });
    }, []);

    useEffect(() => {
        if (!dateA || !dateB) return;

        const loadAndCompare = async () => {
            // Fetch full data for selected dates
            const [resA, resB] = await Promise.all([
                fetch(`/api/history?date=${dateA}`).then(r => r.json()),
                fetch(`/api/history?date=${dateB}`).then(r => r.json())
            ]);

            if (resA.creators && resB.creators) {
                const result = compareSnapshots(resA.creators, resB.creators);
                result.dateA = dateA;
                result.dateB = dateB;
                setComparison(result);
            }
        };

        loadAndCompare();
    }, [dateA, dateB]);

    return (
        <AuthGuard>
            <main className="min-h-screen bg-slate-950 text-white p-8 font-sans">
                <header className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 bg-slate-900 rounded-full hover:bg-slate-800 transition-colors">
                            <ArrowLeft className="w-6 h-6 text-slate-400" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                Máquina del Tiempo
                            </h1>
                            <p className="text-slate-400 text-sm">Comparativa Histórica de Agencia</p>
                        </div>
                    </div>
                </header>

                {/* Controls */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row items-center gap-8 justify-center">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">Fecha Inicial (Base)</label>
                        <select
                            value={dateA}
                            onChange={(e) => setDateA(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {snapshots.map(s => <option key={s.date} value={s.date}>{s.date}</option>)}
                        </select>
                    </div>

                    <div className="bg-slate-800 p-2 rounded-full">
                        <ArrowRight className="w-6 h-6 text-slate-400" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-xs text-slate-500 uppercase font-bold">Fecha Final (Comparar)</label>
                        <select
                            value={dateB}
                            onChange={(e) => setDateB(e.target.value)}
                            className="bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:ring-2 focus:ring-purple-500"
                        >
                            {snapshots.map(s => <option key={s.date} value={s.date}>{s.date}</option>)}
                        </select>
                    </div>
                </div>

                {/* Results */}
                {comparison ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {/* Summary Cards */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div className="bg-slate-900/80 p-6 rounded-xl border border-emerald-500/20 shadow-lg">
                                <div className="flex items-center gap-3 text-emerald-400 mb-2">
                                    <TrendingUp className="w-5 h-5" />
                                    <span className="font-bold">Crecimiento Neto</span>
                                </div>
                                <div className="text-3xl font-mono font-bold text-white">
                                    {comparison.newCreators.length - comparison.lostCreators.length > 0 ? '+' : ''}
                                    {comparison.newCreators.length - comparison.lostCreators.length}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Creadores (Nuevos - Perdidos)</p>
                            </div>

                            <div className="bg-slate-900/80 p-6 rounded-xl border border-blue-500/20 shadow-lg">
                                <div className="flex items-center gap-3 text-blue-400 mb-2">
                                    <Users className="w-5 h-5" />
                                    <span className="font-bold">Nuevos Talentos</span>
                                </div>
                                <div className="text-3xl font-mono font-bold text-white">
                                    {comparison.newCreators.length}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Se unieron en este periodo</p>
                            </div>

                            <div className="bg-slate-900/80 p-6 rounded-xl border border-red-500/20 shadow-lg">
                                <div className="flex items-center gap-3 text-red-400 mb-2">
                                    <TrendingDown className="w-5 h-5" />
                                    <span className="font-bold">Fuga de Talento</span>
                                </div>
                                <div className="text-3xl font-mono font-bold text-white">
                                    {comparison.lostCreators.length}
                                </div>
                                <p className="text-xs text-slate-500 mt-1">Dejaron de aparecer en el reporte</p>
                            </div>
                        </div>

                        {/* Top Growth */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-fit">
                            <h3 className="text-lg font-bold text-emerald-400 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" /> Top Crecimiento
                            </h3>
                            <div className="space-y-3">
                                {comparison.growth.slice(0, 5).map((g, i) => (
                                    <div key={g.creatorId} className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 font-mono text-sm w-4">#{i + 1}</span>
                                            <span className="text-white font-medium text-sm">{g.username}</span>
                                        </div>
                                        <span className="text-emerald-400 text-xs font-mono font-bold">+{g.diamondDelta.toLocaleString()} 💎</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Biggest Drop */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-fit">
                            <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
                                <TrendingDown className="w-5 h-5" /> Mayores Caídas
                            </h3>
                            <div className="space-y-3">
                                {comparison.growth.slice().reverse().slice(0, 5).map((g, i) => (
                                    <div key={g.creatorId} className="flex justify-between items-center border-b border-slate-800 pb-2">
                                        <div className="flex items-center gap-3">
                                            <span className="text-slate-500 font-mono text-sm w-4">#{i + 1}</span>
                                            <span className="text-white font-medium text-sm">{g.username}</span>
                                        </div>
                                        <span className="text-red-400 text-xs font-mono font-bold">{g.diamondDelta.toLocaleString()} 💎</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lost List */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 h-fit">
                            <h3 className="text-lg font-bold text-slate-400 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5" /> Lista de Bajas ({comparison.lostCreators.length})
                            </h3>
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar space-y-2">
                                {comparison.lostCreators.map(c => (
                                    <div key={c.creatorId} className="bg-slate-950 p-2 rounded text-xs text-slate-400 flex justify-between">
                                        <span>{c.username}</span>
                                        <span className="font-mono">{c.diamonds.toLocaleString()} (Previo)</span>
                                    </div>
                                ))}
                                {comparison.lostCreators.length === 0 && <p className="text-slate-500 text-sm italic">Sin bajas registradas.</p>}
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-500">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Selecciona dos fechas para comenzar la comparación.</p>
                    </div>
                )}
            </main>
        </AuthGuard>
    );
}
