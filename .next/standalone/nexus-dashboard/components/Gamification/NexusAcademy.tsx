'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Lock, Zap, Target, Award, Gem, Clock, Calendar } from 'lucide-react';
import { Creator } from '@/types';
import MissionControl from './MissionControl';
import RewardVault from './RewardVault';
import LeagueStandings from './LeagueStandings';

import Link from 'next/link';

export default function NexusAcademy({ creators }: { creators: Creator[] }) {
    const [activeTab, setActiveTab] = useState<'missions' | 'leagues' | 'rewards'>('missions');

    return (
        <div className="w-full">
            {/* Header */}
            <div className="bg-slate-900 border-b border-slate-800 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                            <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                                NEXUS ACADEMY
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                                    Gamification Core
                                </span>
                            </h2>
                            <p className="text-sm text-slate-400">Sistema de Misiones, Ligas y Recompensas</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-4 text-xs font-mono text-slate-500">
                        <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5 text-blue-400" /> 12 Misiones Activas</span>
                        <span className="flex items-center gap-1.5"><Award className="w-3.5 h-3.5 text-yellow-400" /> 5 Premios Disponibles</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="bg-slate-950/50 rounded-b-2xl p-6 space-y-6">

                {/* Navigation Tabs */}
                <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
                    <button
                        onClick={() => setActiveTab('missions')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'missions'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <Target className="w-4 h-4" /> Misiones
                    </button>
                    <button
                        onClick={() => setActiveTab('leagues')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'leagues'
                            ? 'bg-yellow-600 text-white shadow-lg shadow-yellow-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <Trophy className="w-4 h-4" /> Ligas
                    </button>
                    <button
                        onClick={() => setActiveTab('rewards')}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'rewards'
                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                            }`}
                    >
                        <Gem className="w-4 h-4" /> Bóveda de Premios
                    </button>
                </div>

                {/* Content Modules */}
                <div className="bg-slate-900/50 rounded-2xl border border-slate-800/50 p-1">
                    {activeTab === 'missions' && <MissionControl creators={creators} />}
                    {activeTab === 'leagues' && <LeagueStandings creators={creators} />}
                    {activeTab === 'rewards' && <RewardVault creators={creators} />}
                </div>
            </div>
        </div>
    );
}
