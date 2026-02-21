'use client';

import { Creator } from '@/types';
import { Trophy, Medal, Crown, Star, Sparkles, TrendingUp, Flame, Zap, Binary, Diamond } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Podium({ top3 }: { top3: Creator[] }) {
    if (!top3 || top3.length === 0) return null;

    const [first, second, third] = top3;

    // Helper for safe username (for file paths)
    const getSafeName = (name: string) => name.replace(/[^a-zA-Z0-9_\.]/g, '');

    return (
        <div className="relative py-8 md:py-16 mb-16 px-4 group/podium scale-[0.8] md:scale-95 origin-top" style={{ color: '#ffffff', perspective: '2000px' }}>

            {/* --- ADVANCED TECH-MATRIX BACKGROUND --- */}
            <div className="absolute inset-0 -z-20 overflow-hidden pointer-events-none rounded-[3rem] md:rounded-[5rem]" style={{ backgroundColor: '#020617' }}>
                <motion.div
                    animate={{ opacity: [0.1, 0.2, 0.1], scale: [1, 1.05, 1] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `linear-gradient(#0ea5e911 1px, transparent 1px), linear-gradient(90deg, #0ea5e911 1px, transparent 1px)`,
                        backgroundSize: '40px 40px',
                        transform: 'perspective(800px) rotateX(65deg) translateY(-60px)',
                        transformOrigin: 'top'
                    }}
                />
                <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'radial-gradient(circle at 50% 50%, transparent 20%, #020617 100%)' }} />
            </div>

            {/* Header section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 relative"
            >
                <div
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-full mb-4 border"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        borderColor: 'rgba(34,211,238,0.2)',
                        backdropFilter: 'blur(20px)',
                    }}
                >
                    <Binary className="w-4 h-4" color="#22d3ee" strokeWidth={3} />
                    <span className="text-[9px] font-black tracking-[0.4em] uppercase italic" style={{ color: '#22d3ee' }}>
                        NEXUS COMMAND CENTER
                    </span>
                    <Binary className="w-4 h-4" color="#22d3ee" strokeWidth={3} />
                </div>

                <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase leading-none">
                    <span style={{
                        background: 'linear-gradient(to bottom, #ffffff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        RANKING <span style={{ color: '#22d3ee', WebkitTextFillColor: '#22d3ee' }}>ÉLITE</span>
                    </span>
                </h3>
            </motion.div>

            <div className="flex flex-col md:grid md:grid-cols-3 gap-6 md:gap-8 items-center md:items-end max-w-6xl mx-auto relative z-10">

                {/* --- 2nd Place (Silver) --- */}
                {second && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="order-2 md:order-1 relative w-full max-w-[320px] md:max-w-none"
                    >
                        <div
                            className="relative overflow-hidden rounded-[2.5rem] p-6 border-2 flex flex-col items-center h-[420px] md:h-[460px] justify-between"
                            style={{
                                backgroundColor: 'rgba(15,23,42,0.95)',
                                borderColor: 'rgba(148,163,184,0.3)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div className="flex flex-col items-center w-full">
                                <div className="relative mb-6">
                                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full p-2 relative z-10" style={{ background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)', boxShadow: '0 0 30px rgba(148,163,184,0.3)' }}>
                                        <div className="w-full h-full rounded-full overflow-hidden border-4" style={{ borderColor: '#020617', backgroundColor: '#1e293b' }}>
                                            <img
                                                src={`/foto_perfil/${getSafeName(second.username)}.jpg`}
                                                onError={(e) => e.currentTarget.src = '/default-user.png'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    {/* LOWERED BADGE */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 min-w-[140px]">
                                        <div className="px-5 py-1.5 rounded-xl font-black border-2 shadow-2xl text-[10px] md:text-xs uppercase italic whitespace-nowrap text-center"
                                            style={{ backgroundColor: '#f1f5f9', color: '#020617', borderColor: '#94a3b8' }}>
                                            TOP 2 ELITE
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className="font-black text-xl md:text-2xl tracking-tighter w-full mb-1 truncate px-4" style={{ color: '#ffffff' }}>
                                        {second.username}
                                    </h3>
                                    <p className="text-[8px] uppercase font-black tracking-[0.4em] mb-4" style={{ color: '#64748b' }}>Unidad Platinum</p>
                                </div>
                            </div>

                            <div className="w-full px-2">
                                <div className="px-4 py-3 rounded-2xl border flex items-center justify-center gap-2"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(148,163,184,0.1)' }}>
                                    <span className="text-xl md:text-2xl font-mono font-black" style={{ color: '#f1f5f9' }}>
                                        {second.diamonds.toLocaleString()}
                                    </span>
                                    <Diamond className="w-4 h-4 md:w-5 md:h-5" color="#22d3ee" fill="rgba(34,211,238,0.2)" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- 1st Place (Gold) --- */}
                {first && (
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="order-1 md:order-2 z-20 relative w-full max-w-[360px] md:max-w-none"
                    >
                        <div
                            className="relative overflow-hidden rounded-[3.5rem] md:rounded-[4rem] p-1 border-2"
                            style={{
                                background: 'linear-gradient(135deg, #fef08a, #eab308, #b45309)',
                                borderColor: 'rgba(250,204,21,0.4)',
                                boxShadow: '0 0 60px rgba(234,179,8,0.2)'
                            }}
                        >
                            <div className="rounded-[3.4rem] md:rounded-[3.8rem] p-8 md:p-12 relative overflow-hidden flex flex-col items-center h-[580px] md:h-[620px] justify-between" style={{ backgroundColor: '#020617' }}>
                                <div className="flex flex-col items-center w-full">
                                    <div className="relative mb-10">
                                        <motion.div animate={{ y: [-10, 5, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-16 left-1/2 -translate-x-1/2 z-30">
                                            <Crown className="w-16 h-16 md:w-20 md:h-20" color="#facc15" fill="rgba(234,179,8,0.3)" />
                                        </motion.div>

                                        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full p-2.5 relative z-10" style={{ background: 'linear-gradient(135deg, #fde68a, #f59e0b)', boxShadow: '0 0 50px rgba(234,179,8,0.4)' }}>
                                            <div className="w-full h-full rounded-full overflow-hidden border-[6px]" style={{ borderColor: '#451a03', backgroundColor: '#020617' }}>
                                                <img
                                                    src={`/foto_perfil/${getSafeName(first.username)}.jpg`}
                                                    onError={(e) => e.currentTarget.src = '/default-user.png'}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        </div>

                                        {/* LOWERED BADGE */}
                                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[240px] md:w-[320px]">
                                            <div className="p-[2px] rounded-xl md:rounded-[1.5rem]" style={{ background: 'linear-gradient(90deg, #ca8a04, #ffffff, #ca8a04)' }}>
                                                <div className="px-6 md:px-8 py-2 md:py-3 rounded-[0.9rem] md:rounded-[1.4rem] font-black text-lg md:text-2xl tracking-tighter uppercase italic text-center"
                                                    style={{ backgroundColor: '#451a03', color: '#fef08a' }}>
                                                    LEYENDA SUPREMA
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8 text-center">
                                        <h3 className="font-black text-3xl md:text-4xl tracking-tighter w-full mb-1 truncate px-4" style={{ color: '#ffffff' }}>
                                            {first.username}
                                        </h3>
                                        <p className="text-[10px] uppercase font-black tracking-[0.6em] mb-6" style={{ color: 'rgba(234,179,8,0.6)' }}>Supreme Command</p>
                                    </div>
                                </div>

                                <div className="w-full px-4">
                                    <div className="px-8 py-5 md:px-10 md:py-6 rounded-[2rem] md:rounded-[2.5rem] border-2 flex items-center justify-center gap-3 md:gap-4"
                                        style={{ backgroundColor: 'rgba(234,179,8,0.1)', borderColor: 'rgba(234,179,8,0.3)' }}>
                                        <span className="text-4xl md:text-5xl font-mono font-black" style={{ color: '#ffffff' }}>
                                            {first.diamonds.toLocaleString()}
                                        </span>
                                        <Diamond className="w-8 h-8 md:w-10 md:h-10" color="#22d3ee" fill="rgba(34,211,238,0.2)" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* --- 3rd Place (Bronze) --- */}
                {third && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="order-3 relative w-full max-w-[320px] md:max-w-none"
                    >
                        <div
                            className="relative overflow-hidden rounded-[2.5rem] p-6 border-2 flex flex-col items-center h-[380px] md:h-[420px] justify-between"
                            style={{
                                backgroundColor: 'rgba(26,20,16,0.95)',
                                borderColor: 'rgba(234,88,12,0.3)',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
                            }}
                        >
                            <div className="flex flex-col items-center w-full">
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full p-2 relative z-10" style={{ background: 'linear-gradient(135deg, #fdba74, #7c2d12)', boxShadow: '0 0 30px rgba(234,88,12,0.3)' }}>
                                        <div className="w-full h-full rounded-full overflow-hidden border-4" style={{ borderColor: '#1a1410', backgroundColor: '#110c0a' }}>
                                            <img
                                                src={`/foto_perfil/${getSafeName(third.username)}.jpg`}
                                                onError={(e) => e.currentTarget.src = '/default-user.png'}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                    {/* LOWERED BADGE */}
                                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 min-w-[140px]">
                                        <div className="px-5 py-1.5 rounded-xl font-black border-2 shadow-xl text-[10px] md:text-xs uppercase italic whitespace-nowrap text-center"
                                            style={{ backgroundColor: '#ea580c', color: '#ffffff', borderColor: '#fb923c' }}>
                                            TOP 3 ELITE
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 text-center">
                                    <h3 className="font-black text-xl md:text-2xl tracking-tighter w-full mb-1 truncate px-4" style={{ color: '#ffffff' }}>
                                        {third.username}
                                    </h3>
                                    <p className="text-[8px] uppercase font-black tracking-[0.4em] mb-4" style={{ color: 'rgba(234,88,12,0.4)' }}>Unidad Alpha</p>
                                </div>
                            </div>

                            <div className="w-full px-2">
                                <div className="px-4 py-3 rounded-2xl border flex items-center justify-center gap-2"
                                    style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderColor: 'rgba(234,88,12,0.1)' }}>
                                    <span className="text-xl md:text-2xl font-mono font-black" style={{ color: '#fb923c' }}>
                                        {third.diamonds.toLocaleString()}
                                    </span>
                                    <Diamond className="w-4 h-4 md:w-5 md:h-5" color="#22d3ee" fill="rgba(34,211,238,0.2)" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
