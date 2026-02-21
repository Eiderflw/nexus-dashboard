'use client';

import { Creator } from '@/types';
import { forwardRef } from 'react';
import { Diamond, Zap, Crown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const RankingCard = forwardRef<HTMLDivElement, { creators: Creator[] }>(({ creators }, ref) => {
    return (
        <div
            ref={ref}
            className="w-[1080px] h-[2200px] relative overflow-hidden flex flex-col font-sans"
            style={{
                backgroundColor: '#020617',
                color: '#ffffff'
            }}
        >
            {/* --- TECH-MATRIX EXPORT BACKGROUND --- */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, #020617 0%, #060b18 100%)' }}></div>

            <div
                className="absolute inset-0"
                style={{
                    opacity: '0.02',
                    backgroundImage: 'linear-gradient(#22d3ee22 1px, transparent 1px), linear-gradient(90deg, #22d3ee22 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                    transform: 'rotate(-5deg) scale(2)',
                    transformOrigin: 'center'
                }}
            />

            {/* --- PREMIUM DECORATIVE FRAME --- */}
            <div className="absolute inset-2 border-[1px] opacity-5 pointer-events-none" style={{ borderColor: '#22d3ee' }}></div>
            <div className="absolute top-2 left-2 w-16 h-16 border-t-[4px] border-l-[4px]" style={{ borderColor: '#facc15' }}></div>
            <div className="absolute top-2 right-2 w-16 h-16 border-t-[4px] border-r-[4px]" style={{ borderColor: '#facc15' }}></div>
            <div className="absolute bottom-2 left-2 w-16 h-16 border-b-[4px] border-l-[4px]" style={{ borderColor: '#facc15' }}></div>
            <div className="absolute bottom-2 right-2 w-16 h-16 border-b-[4px] border-r-[4px]" style={{ borderColor: '#facc15' }}></div>

            {/* Content Body */}
            <div className="relative z-10 flex flex-col h-full px-12">

                {/* --- Header Section --- */}
                <div className="text-center pt-28 pb-10">
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <Zap className="w-12 h-12" color="#facc15" fill="#facc1533" />
                        <span className="uppercase tracking-[1.8em] text-xl font-black italic" style={{ color: '#22d3ee' }}>
                            NEXUS COMMAND CENTER
                        </span>
                        <Zap className="w-12 h-12" color="#facc15" fill="#facc1533" />
                    </div>

                    <h1 className="text-[145px] font-black tracking-tighter uppercase leading-[0.65] mb-8" style={{
                        background: 'linear-gradient(to bottom, #ffffff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        RANKING<br />DIAMANTE
                    </h1>
                    <div
                        className="inline-block px-10 py-3 rounded-full border"
                        style={{
                            borderColor: 'rgba(34,211,238,0.2)',
                            backgroundColor: 'rgba(34,211,238,0.05)'
                        }}
                    >
                        <p className="text-2xl font-mono tracking-[0.4em] uppercase font-black" style={{ color: '#22d3ee' }}>FEBRERO 2026</p>
                    </div>
                </div>

                {/* --- Ranking List --- */}
                <div className="space-y-4 flex-1">
                    {creators.slice(0, 10).map((creator, index) => {
                        const dailyDelta = creator.dailyDiamondsChange || 0;
                        const momGrowth = (creator.diamondsGrowth || 0) * 100;

                        let displayGrowth = momGrowth;
                        if (dailyDelta !== 0 && creator.diamonds > 0) {
                            const prevVal = creator.diamonds - dailyDelta;
                            if (prevVal > 0) {
                                displayGrowth = (dailyDelta / prevVal) * 100;
                            }
                        }

                        const isPositive = displayGrowth >= 0;

                        return (
                            <div
                                key={creator.creatorId}
                                className="flex items-center p-3 rounded-[2.5rem] border relative overflow-hidden h-[155px]"
                                style={{
                                    background: 'rgba(15,23,42,0.6)',
                                    borderColor: index === 0 ? '#eab308aa' : index === 1 ? '#94a3b8aa' : index === 2 ? '#ea580caa' : 'rgba(255,255,255,0.1)'
                                }}
                            >
                                {/* Puesto */}
                                <div className="w-20 flex-shrink-0 text-center flex flex-col items-center justify-center">
                                    <span className="text-[56px] font-black italic leading-none" style={{
                                        color: index === 0 ? '#facc15' :
                                            index === 1 ? '#cbd5e1' :
                                                index === 2 ? '#fb923c' : '#334155'
                                    }}>
                                        #{index + 1}
                                    </span>
                                </div>

                                {/* Photo */}
                                <div className="w-24 h-24 rounded-full border-[4px] relative flex-shrink-0 mx-2"
                                    style={{
                                        borderColor: index === 0 ? '#eab308' : index === 1 ? '#94a3b8' : index === 2 ? '#ea580c' : '#1e293b',
                                        backgroundColor: '#020617'
                                    }}>
                                    <img
                                        src={creator.avatar || `/foto_perfil/${creator.username.replace(/[^a-zA-Z0-9_\.]/g, '')}.jpg`}
                                        onError={(e) => e.currentTarget.src = '/default-user.png'}
                                        className="w-full h-full rounded-full object-cover"
                                    />
                                    {index === 0 && <Crown className="absolute -top-8 -right-4 w-14 h-14 rotate-12" color="#facc15" fill="#facc1533" />}
                                </div>

                                {/* Horizontal Layout: Name -> Diamonds -> Growth */}
                                <div className="flex-1 min-w-0 flex items-center justify-between ml-6 mr-8">
                                    {/* Name */}
                                    <div className="flex-1 min-w-0 mr-8 flex flex-col justify-center">
                                        <h2 className="text-[46px] font-black tracking-tighter leading-tight truncate pb-4" style={{ color: '#ffffff', margin: 0 }}>
                                            {creator.username}
                                        </h2>
                                    </div>

                                    {/* Metrics Group */}
                                    <div className="flex items-center gap-8 flex-shrink-0">
                                        {/* Diamonds */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-[48px] font-mono font-black leading-none tracking-tighter" style={{ color: '#e2e8f0' }}>
                                                {creator.diamonds.toLocaleString()}
                                            </span>
                                            <Diamond className="w-8 h-8" color="#22d3ee" fill="#22d3ee33" />
                                        </div>

                                        {/* Separator */}
                                        <div className="h-[40px] w-[2px] rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}></div>

                                        {/* Growth */}
                                        <div className="flex items-center gap-2 min-w-[140px] justify-end">
                                            <span className="text-[42px] font-black leading-none" style={{ color: isPositive ? '#10b981' : '#f43f5e' }}>
                                                {Math.abs(Math.round(displayGrowth))}%
                                            </span>
                                            {isPositive
                                                ? <ArrowUpRight className="w-8 h-8" color="#10b981" strokeWidth={5} />
                                                : <ArrowDownRight className="w-8 h-8" color="#f43f5e" strokeWidth={5} />
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* --- Footer --- */}
                <div className="mt-auto py-8 text-center">
                    <div className="flex items-center justify-center gap-12 font-mono text-xl uppercase tracking-[1em]" style={{ color: '#4d5c70' }}>
                        <span className="font-bold">NX-FEB26</span>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22d3ee' }}></div>
                        <span className="italic">SYSTEM VERIFIED</span>
                    </div>
                </div>
            </div>
        </div>
    );
});

RankingCard.displayName = 'RankingCard';
