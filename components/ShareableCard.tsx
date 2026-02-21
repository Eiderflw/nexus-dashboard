'use client';

import { Creator } from '@/types';
import { forwardRef } from 'react';
import { Trophy, TrendingUp, Calendar, Zap, Star, ShieldCheck } from 'lucide-react';

// This component is designed to be rendered visibly or invisibly for capture
export const ShareableCard = forwardRef<HTMLDivElement, { creator: Creator }>(({ creator }, ref) => {
    const isTopPerformer = creator.diamonds > 50000;
    const isElite = creator.diamonds > 100000;
    const safeUsername = creator.username.replace(/[^a-zA-Z0-9_\.]/g, '');

    return (
        <div
            ref={ref}
            className="w-[400px] h-[640px] relative overflow-hidden flex flex-col items-center justify-between font-sans shadow-2xl"
            style={{
                backgroundColor: '#020617', // slate-950
                color: '#ffffff',
                borderColor: '#0f172a', // slate-900
                borderWidth: '4px',
                colorScheme: 'dark'
            }}
        >
            {/* --- GALACTIC BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 40%, #1e1b4b 0%, #020617 100%)' }}></div>
                {/* Stars/Dust */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                {/* Glowing Nebulas */}
                <div className="absolute top-[-10%] left-[-20%] w-[80%] h-[60%] rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(147, 51, 234, 0.2)' }}></div>
                <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(79, 70, 229, 0.2)' }}></div>

                {/* Floating Stars */}
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-white rounded-full opacity-40"
                        style={{
                            width: Math.random() * 3 + 'px',
                            height: Math.random() * 3 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            boxShadow: '0 0 10px white'
                        }}
                    ></div>
                ))}
            </div>

            {/* --- HEADER --- */}
            <div className="z-10 mt-12 text-center px-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="h-px w-8" style={{ background: 'linear-gradient(to right, transparent, rgba(234, 179, 8, 0.5))' }}></div>
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4" color="#eab308" />
                        <span className="uppercase tracking-[0.4em] text-[10px] font-black" style={{ color: '#eab308' }}>Nexus Agency Élite</span>
                    </div>
                    <div className="h-px w-8" style={{ background: 'linear-gradient(to left, transparent, rgba(234, 179, 8, 0.5))' }}></div>
                </div>
                <h1 className="text-4xl font-black drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)] tracking-tighter uppercase leading-tight" style={{ color: '#ffffff' }}>
                    {creator.username}
                </h1>
                <div className="mt-1 flex items-center justify-center gap-2">
                    <span className="font-mono text-xs tracking-widest uppercase" style={{ color: '#64748b' }}>{creator.creatorId}</span>
                </div>
            </div>

            {/* --- IMAGE / AVATAR --- */}
            <div className="relative z-20 my-2">
                {/* Outer Glow Ring */}
                <div className="absolute inset-[-20px] rounded-full blur-3xl opacity-40" style={{ backgroundColor: isElite ? '#eab308' : '#6366f1' }}></div>

                {/* Avatar Border */}
                <div className="p-1 rounded-full shadow-2xl relative" style={{ background: isElite ? 'linear-gradient(to bottom, #fef08a, #eab308, #854d0e)' : 'linear-gradient(to bottom, #334155, #0f172a)' }}>
                    <div className="w-44 h-44 rounded-full border-4 overflow-hidden relative" style={{ borderColor: '#020617', backgroundColor: '#0f172a' }}>
                        <img
                            src={creator.avatar || `/foto_perfil/${safeUsername}.jpg`}
                            onError={(e) => e.currentTarget.src = '/default-user.png'}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                        />
                    </div>

                    {/* Position Label */}
                    <div
                        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full font-black text-[10px] tracking-widest uppercase border-2 shadow-xl flex items-center gap-1.5 min-w-max"
                        style={{
                            backgroundColor: isElite ? '#eab308' : '#4f46e5',
                            color: isElite ? '#451a03' : '#ffffff',
                            borderColor: isElite ? '#fef08a' : '#818cf8',
                            boxShadow: isElite ? '0 0 15px rgba(234, 179, 8, 0.2)' : '0 0 15px rgba(99, 102, 241, 0.2)'
                        }}
                    >
                        {isElite ? <Trophy className="w-3 h-3" /> : <Star className="w-3 h-3" />}
                        {isElite ? 'Top Global' : 'Creador Destacado'}
                    </div>
                </div>
            </div>

            {/* --- MAIN STATS BOX --- */}
            <div className="z-10 w-full px-8 mb-4">
                <div className="backdrop-blur-xl rounded-[2rem] p-8 border shadow-2xl relative overflow-hidden"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.4)', borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                    {/* Geometric Detail */}
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" style={{ backgroundColor: 'rgba(234, 179, 8, 0.05)' }}></div>

                    <div className="flex flex-col items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: '#94a3b8' }}>Diamantes Recaudados</span>
                        <div className="text-5xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
                            {creator.diamonds.toLocaleString()}
                        </div>
                        {creator.diamondsGrowth > 0 && (
                            <div className="mt-2 text-xs font-bold flex items-center gap-1 px-3 py-1 rounded-full border"
                                style={{
                                    color: '#34d399',
                                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                                    borderColor: 'rgba(16, 185, 129, 0.2)'
                                }}>
                                <TrendingUp className="w-3 h-3" />
                                +{Math.round(creator.diamondsGrowth * 100)}% Crecimiento
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                        <div className="text-center">
                            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Horas Live</div>
                            <div className="text-2xl font-black text-white tracking-tight">{creator.liveHours.toFixed(1)}h</div>
                        </div>
                        <div className="text-center border-l" style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#64748b' }}>Días Válidos</div>
                            <div className="text-2xl font-black text-white tracking-tight">{creator.validDays}d</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- BRAND FOOTER --- */}
            <div className="z-10 w-full pb-10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-4 opacity-30">
                    <div className="h-px w-20 bg-white"></div>
                    <div className="w-2 h-2 rounded-full border border-white"></div>
                    <div className="h-px w-20 bg-white"></div>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black" style={{ color: '#64748b' }}>
                        Nexus Agency Social Card
                    </p>
                    <p className="text-[8px] mt-1 font-mono tracking-tighter" style={{ color: '#475569' }}>
                        Verification ID: {new Date().getTime().toString(36).toUpperCase()}-{creator.creatorId}
                    </p>
                </div>
            </div>
        </div>
    );
});

ShareableCard.displayName = 'ShareableCard';
