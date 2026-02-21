'use client';

import AuthGuard from '@/components/AuthGuard';
import FileUpload from '@/components/FileUpload';
import LivePanel from '@/components/LivePanel';
import BackgroundParticles from '@/components/BackgroundParticles';
import { PhotoManager } from '@/components/PhotoManager';
import { useCreatorStore } from '@/store/useCreatorStore';
import TopPerformersChart from '@/components/CreatorChart';
import CreatorTable from '@/components/CreatorTable';
import CreatorModal from '@/components/CreatorModal';
import { Users, Diamond, Clock, Trophy, TrendingUp, AlertTriangle, Download, Zap, Star, History, Sparkles, Menu, UserCheck, GraduationCap, Crosshair } from 'lucide-react';
import { getAtRiskCreators, getRisingStars, getTopCreators } from '@/lib/analysis';
import { useState } from 'react';
import { Creator } from '@/types';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import Podium from '@/components/Podium';
import { useRef } from 'react';
import { RankingCard } from '@/components/RankingCard'; // Kept import if needed, but not using as row
import BattleChart from '@/components/BattleChart';
import CohortChart from '@/components/CohortChart';
import MultiGuestChart from '@/components/MultiGuestChart';
import DecayView from '@/components/DecayView';
import KpiDetailModal, { KpiCategory, getCreatorCategory, isPotential } from '@/components/KpiDetailModal';
import TasksModule from '@/components/TasksModule';
import RevenueSimulator from '@/components/RevenueSimulator';
import CreatorFinderModal from '@/components/Scraper/CreatorFinderModal';
import NexusAcademyModal from '@/components/Gamification/NexusAcademyModal';

export default function Home() {
    const { creators } = useCreatorStore();
    const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
    const [showDecayModal, setShowDecayModal] = useState(false);
    const [activeKpi, setActiveKpi] = useState<KpiCategory | null>(null);
    const [showGamification, setShowGamification] = useState(false);
    const [showCreatorFinder, setShowCreatorFinder] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const totalDiamonds = creators.reduce((sum, c) => sum + c.diamonds, 0);
    const totalHours = creators.reduce((sum, c) => sum + c.liveHours, 0);
    const activeCreators = creators.filter(c => c.validDays > 0).length;

    // Advanced Segments
    const atRisk = getAtRiskCreators(creators);
    const risingStars = getRisingStars(creators);
    const top3 = getTopCreators(creators, 3);

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100
            }
        }
    };

    const rankingRef = useRef<HTMLDivElement>(null);
    const [isExportingRanking, setIsExportingRanking] = useState(false);

    const handleExport = async () => {
        const element = document.getElementById('dashboard-content');
        if (!element) return;

        try {
            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#020617', // slate-950
                useCORS: true,
                logging: false,
                ignoreElements: (element) => element.classList.contains('no-export')
            });
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `Reporte-Nexus-${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
            link.click();
        } catch (err) {
            console.error('Export failed:', err);
            alert('Error al exportar. Intenta de nuevo.');
        }
    };

    const handleExportRanking = async () => {
        const container = rankingRef.current;
        if (!container) return;

        setIsExportingRanking(true);
        try {
            // Wait for images and animations to stabilize
            await new Promise(r => setTimeout(r, 1000));

            const canvas = await html2canvas(container, {
                scale: 2,
                backgroundColor: '#020617', // Match RankingCard bg
                useCORS: true,
                logging: false,
                width: 1080, // Force width/height to match component
                height: 2200,
                windowWidth: 1080,
                windowHeight: 2200
            });

            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `Ranking-Oficial-${new Date().toLocaleDateString().replace(/\//g, '-')}.png`;
            link.click();
        } catch (err) {
            console.error('Ranking export failed:', err);
            alert('Error al exportar ranking.');
        } finally {
            setIsExportingRanking(false);
        }
    };

    const staggerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const cardVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 text-slate-200 selection:bg-emerald-500/30 relative overflow-x-hidden">
            <BackgroundParticles />
            {/* Header / Nav */}
            <nav className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-[95vw] mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Menu Trigger */}
                        {/* Menu Trigger */}
                        <div className="relative">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                                className="p-2 mr-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors group relative z-[200]"
                                title="Menú Principal"
                            >
                                <Menu className="w-6 h-6" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse-glow" />
                            </motion.button>

                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-full left-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-[300]"
                                    >
                                        <div className="p-1 flex flex-col gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowGamification(true); setIsMenuOpen(false); }}
                                                className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">Nexus Academy</div>
                                                    <div className="text-[10px] text-slate-500">Gamificación y Misiones</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={(e) => { e.stopPropagation(); setShowCreatorFinder(true); setIsMenuOpen(false); }}
                                                className="w-full text-left px-3 py-3 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white text-sm font-medium flex items-center gap-3 transition-colors cursor-pointer"
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                                                    <Crosshair className="w-4 h-4 text-blue-500" />
                                                </div>
                                                <div>
                                                    <div className="text-white font-bold">Creator Hunter</div>
                                                    <div className="text-[10px] text-slate-500">Scraper y Validación</div>
                                                </div>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
                        </div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                            NEXUS <span className="text-emerald-500">DASHBOARD</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <FileUpload />
                        <PhotoManager creators={creators} />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExport}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-700 hover:border-slate-500 hover:text-white"
                        >
                            <Download className="w-4 h-4" /> Exportar Reporte
                        </motion.button>
                    </div>
                </div>
            </nav>

            <motion.div
                id="dashboard-content"
                className="max-w-[95vw] mx-auto px-4 py-8 space-y-8"
                variants={staggerVariants}
                initial="hidden"
                animate="visible"
            >

                {/* KPI Cards Row */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4"
                >
                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('total_diamonds')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-emerald rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                                <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-emerald-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch">Diamantes</span>
                                    <Diamond className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform group-hover:text-emerald-300 animate-pulse-glow" />
                                </div>
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">{totalDiamonds.toLocaleString()}</div>
                                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1 relative z-10">
                                    <TrendingUp className="w-3 h-3" /> +12.5%
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('active_creators')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-blue rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-blue-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch">Activos</span>
                                    <Users className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform group-hover:text-blue-300" />
                                </div>
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">{activeCreators} <span className="text-slate-500 text-sm font-medium">/ {creators.length}</span></div>
                                <div className="text-[10px] text-slate-500 mt-1 relative z-10">
                                    {((activeCreators / creators.length) * 100).toFixed(0)}% Activos
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('total_hours')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-purple rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                                <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-purple-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch">Horas</span>
                                    <Clock className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform group-hover:text-purple-300" />
                                </div>
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">{totalHours.toFixed(0)}h</div>
                                <div className="text-[10px] text-purple-400 mt-1 relative z-10">
                                    Avg {(totalHours / (activeCreators || 1)).toFixed(1)}h
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('super')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-gold rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_30px_rgba(251,191,36,0.6)]">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-amber-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch">Super Top</span>
                                    <Trophy className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform animate-float" />
                                </div>
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">{top3.length}</div>
                                <div className="text-[10px] text-slate-400 mt-1 relative z-10">
                                    40% Ingresos
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('potential')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-cyan rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-cyan-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch">Potenciales</span>
                                    <Zap className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse-glow" />
                                </div>
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                                    {creators.filter(isPotential).length}
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 relative z-10">
                                    Altos 💎, baja const.
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('regulars')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-blue rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-10 transition-opacity" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-indigo-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch">Regulares</span>
                                    <UserCheck className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform animate-bounce" />
                                </div>
                                {/* Simple calculation estimate for placeholder, needs proper logic upstream if possible, or inline here */}
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">
                                    {activeCreators - top3.length - creators.filter(isPotential).length}
                                </div>
                                <div className="text-[10px] text-indigo-400 mt-1 relative z-10">
                                    Constantes
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div variants={cardVariants} whileHover={{ scale: 1.05 }} onClick={() => setActiveKpi('at_risk')} className="cursor-pointer group">
                        <div className="animate-border-glow border-glow-red rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-900 h-full rounded-2xl p-4 relative overflow-hidden transition-all group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                                <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-20 transition-opacity" />
                                <div className="flex items-center justify-between mb-2 relative z-10">
                                    <span className="text-red-400/80 text-xs font-bold uppercase tracking-wider group-hover:animate-glitch-slow">En Riesgo</span>
                                    <AlertTriangle className="w-4 h-4 text-red-500 animate-heartbeat" />
                                </div>
                                <div className="text-xl lg:text-2xl font-black text-white tracking-tight relative z-10 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">{atRisk.length}</div>
                                <div className="text-[10px] text-red-400 mt-1 relative z-10">
                                    Atención urgente
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Podium & Battle */}
                    <div className="space-y-8 lg:col-span-2">
                        <div id="ranking-container" className="relative bg-slate-950 p-4 rounded-3xl border border-slate-900">
                            {/* Header for Ranking */}
                            <div className="flex items-center justify-between mb-6 px-2">
                                <div>
                                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                                        <Trophy className="w-6 h-6 text-yellow-500" />
                                        Hall de la Fama
                                    </h3>
                                    <p className="text-xs text-slate-500 font-medium">Top Generadores de esta temporada</p>
                                </div>
                                <button
                                    onClick={handleExportRanking}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-400 px-3 py-1.5 rounded-lg transition-colors border border-slate-700 flex items-center gap-2"
                                >
                                    <Download className="w-3 h-3" /> {isExportingRanking ? 'Procesando...' : 'Descargar Oficial'}
                                </button>
                            </div>

                            <Podium top3={top3} />

                            <div className="mt-6 grid gap-3">
                                {getTopCreators(creators, 10).slice(3).map((creator, index) => (
                                    <div
                                        key={creator.creatorId}
                                        className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-slate-500 text-sm">
                                            #{index + 4}
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
                                            <img
                                                src={creator.avatar || `/foto_perfil/${creator.username.replace(/[^a-zA-Z0-9_\.]/g, '')}.jpg`}
                                                alt={creator.username}
                                                className="w-full h-full object-cover"
                                                onError={(e) => e.currentTarget.src = '/default-user.png'}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{creator.username}</p>
                                            <p className="text-[10px] text-slate-400">{creator.validDays} días · {creator.liveHours.toFixed(0)}h</p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-sm font-black font-mono text-cyan-400">{creator.diamonds.toLocaleString()}</p>
                                            <p className="text-[9px] text-slate-500 uppercase">Diamantes</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <BattleChart creators={creators} />
                        <MultiGuestChart creators={creators} />
                    </div>

                    {/* Right Column: Charts & Analysis */}
                    <div className="space-y-8">
                        <TopPerformersChart creators={creators} metric="diamonds" />
                        <CohortChart creators={creators} />
                        {showDecayModal && <DecayView creators={creators} onClose={() => setShowDecayModal(false)} />}
                        {!showDecayModal && (
                            <button onClick={() => setShowDecayModal(true)} className="w-full py-3 bg-red-900/20 hover:bg-red-900/30 border border-red-900/50 rounded-xl text-red-400 font-bold flex items-center justify-center gap-2 transition-all">
                                <AlertTriangle className="w-4 h-4" /> Ver Centro de Recuperación
                            </button>
                        )}
                        <div className="p-6 bg-slate-900/50 rounded-2xl border border-slate-800">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <History className="w-4 h-4 text-purple-400" /> Historial de Cambios
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3 text-sm">
                                    <div className="w-1 bg-slate-800 rounded-full" />
                                    <div>
                                        <div className="text-slate-400 text-xs">Hace 2 horas</div>
                                        <div className="text-slate-300">Sincronización automática de diamantes completada.</div>
                                    </div>
                                </div>
                                <div className="flex gap-3 text-sm">
                                    <div className="w-1 bg-emerald-500/50 rounded-full" />
                                    <div>
                                        <div className="text-slate-400 text-xs">Hace 5 horas</div>
                                        <div className="text-slate-300">Nuevo creador <span className="text-white font-bold">@mariana_live</span> detectado.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* New Tasks Module */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="animate-border-glow border-glow-blue rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-950 h-full rounded-2xl overflow-hidden">
                                <TasksModule creators={creators} />
                            </div>
                        </div>
                    </motion.div>

                    {/* Revenue Simulator Module */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="animate-border-glow border-glow-emerald rounded-2xl p-[1px] h-full">
                            <div className="bg-slate-950 h-full rounded-2xl overflow-hidden">
                                <RevenueSimulator creators={creators} />
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Main Table */}
                <div className="animate-border-glow border-glow-purple rounded-2xl p-[1px] shadow-2xl shadow-purple-900/20">
                    <div className="bg-slate-900 rounded-2xl overflow-hidden">
                        <CreatorTable creators={creators} />
                    </div>
                </div>
            </motion.div>

            {/* Hidden Ranking Card for Export */}
            <div style={{ position: 'fixed', top: '-9999px', left: '-9999px', width: '1080px', height: '2200px', pointerEvents: 'none' }}>
                <RankingCard ref={rankingRef} creators={creators} />
            </div>

            {/* Modals */}
            <AnimatePresence>
                {selectedCreator && (
                    <CreatorModal creator={selectedCreator} onClose={() => setSelectedCreator(null)} />
                )}
                {activeKpi && (
                    <KpiDetailModal
                        category={activeKpi}
                        creators={creators}
                        top3={top3}
                        atRisk={atRisk}
                        onClose={() => setActiveKpi(null)}
                    />
                )}
            </AnimatePresence>

            <NexusAcademyModal isOpen={showGamification} onClose={() => setShowGamification(false)} creators={creators} />

            <CreatorFinderModal
                isOpen={showCreatorFinder}
                onClose={() => setShowCreatorFinder(false)}
            />
        </main>
    );
}
