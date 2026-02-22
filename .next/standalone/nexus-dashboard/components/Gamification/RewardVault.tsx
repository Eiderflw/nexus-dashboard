'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Lock, Plus, X, Users, User, Trophy, Diamond, Clock, Calendar, Check, AlertCircle } from 'lucide-react';
import { Reward } from '@/types/gamification';
import { Creator } from '@/types';

// Mock initial rewards with new structure
const INITIAL_REWARDS: Reward[] = [
    {
        id: 'overlay_pack',
        title: 'Pack de Overlays Premium',
        description: 'Personaliza tu stream con marcos y alertas animadas.',
        unlockLevel: 1, // Legacy support
        targetType: 'diamonds', // New logic
        targetValue: 10000,
        assignee: 'all',
        claimedBy: []
    },
    {
        id: 'cash_bonus',
        title: 'Bono en Efectivo $100',
        description: 'Recompensa directa por rendimiento excepcional.',
        targetType: 'diamonds',
        targetValue: 500000,
        assignee: 'all',
        claimedBy: []
    }
];

export default function RewardVault({ creators }: { creators: Creator[] }) {
    const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
    const [isAdding, setIsAdding] = useState(false);

    // New Reward Form State
    const [newReward, setNewReward] = useState<Partial<Reward>>({
        title: '',
        description: '',
        targetType: 'diamonds',
        targetValue: 0,
        assignee: 'all'
    });

    const handleAddReward = () => {
        if (!newReward.title || !newReward.targetValue) return;

        const reward: Reward = {
            id: Date.now().toString(),
            title: newReward.title!,
            description: newReward.description || '',
            targetType: newReward.targetType as any,
            targetValue: Number(newReward.targetValue),
            assignee: newReward.assignee || 'all',
            claimedBy: []
        };

        setRewards([reward, ...rewards]); // Add to top
        setIsAdding(false);
        setNewReward({ title: '', description: '', targetType: 'diamonds', targetValue: 0, assignee: 'all' });
    };

    const handleClaim = (rewardId: string, creatorId: string) => {
        setRewards(rewards.map(r => {
            if (r.id === rewardId) {
                // Check if already claimed/stock limits
                if (r.claimedBy?.includes(creatorId)) return r;
                return { ...r, claimedBy: [...(r.claimedBy || []), creatorId] };
            }
            return r;
        }));
    };

    return (
        <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800/50 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-purple-400" />
                    Bóveda de Premios
                </h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                >
                    <Plus className="w-4 h-4" /> Agregar Premio
                </button>
            </div>

            {/* Add Reward Form */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-4 mb-4">
                            <h4 className="font-bold text-white text-sm">Configurar Nuevo Premio</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    placeholder="Título del Premio"
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    value={newReward.title}
                                    onChange={e => setNewReward({ ...newReward, title: e.target.value })}
                                />
                                <input
                                    type="text"
                                    placeholder="Descripción corta..."
                                    className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                    value={newReward.description}
                                    onChange={e => setNewReward({ ...newReward, description: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Tipo de Meta</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        value={newReward.targetType}
                                        onChange={e => setNewReward({ ...newReward, targetType: e.target.value as any })}
                                    >
                                        <option value="diamonds">Diamantes</option>
                                        <option value="hours">Horas Live</option>
                                        <option value="days">Días Válidos</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Valor Meta</label>
                                    <input
                                        type="number"
                                        placeholder="Ej: 100000"
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        value={newReward.targetValue}
                                        onChange={e => setNewReward({ ...newReward, targetValue: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] uppercase font-bold text-slate-500">Asignar a</label>
                                    <select
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                                        value={newReward.assignee}
                                        onChange={e => setNewReward({ ...newReward, assignee: e.target.value })}
                                    >
                                        <option value="all">General (Todos)</option>
                                        {creators.map(c => (
                                            <option key={c.creatorId} value={c.creatorId}>{c.username}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAddReward}
                                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20"
                                >
                                    Guardar Premio
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Rewards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                    <RewardCard
                        key={reward.id}
                        reward={reward}
                        creators={creators}
                        onClaim={handleClaim}
                    />
                ))}
            </div>
        </div>
    );
}

function RewardCard({ reward, creators, onClaim }: { reward: Reward, creators: Creator[], onClaim: (rid: string, cid: string) => void }) {
    // 1. Identify Eligible Candidates
    const candidates = reward.assignee === 'all'
        ? creators
        : creators.filter(c => c.creatorId === reward.assignee);

    // 2. Check who met the target
    const winners = candidates.filter(c => {
        if (reward.targetType === 'diamonds') return c.diamonds >= (reward.targetValue || 0);
        if (reward.targetType === 'hours') return c.liveHours >= (reward.targetValue || 0);
        if (reward.targetType === 'days') return c.validDays >= (reward.targetValue || 0);
        return false;
    });

    const isClaimed = (reward.claimedBy?.length || 0) > 0;
    const winnerName = isClaimed
        ? creators.find(c => c.creatorId === reward.claimedBy![0])?.username
        : null;

    return (
        <motion.div
            layout
            className={`cursor-pointer relative overflow-hidden rounded-xl border p-4 transition-all flex flex-col justify-between h-full ${isClaimed
                    ? 'bg-slate-900 border-slate-800 opacity-75'
                    : 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50 hover:bg-slate-800'
                }`}
        >
            <div>
                {/* Header Badge */}
                <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${isClaimed ? 'bg-slate-800 text-slate-500' : 'bg-purple-500/20 text-purple-400'}`}>
                        <Gift className="w-5 h-5" />
                    </div>
                    {reward.assignee === 'all' ? (
                        <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded flex items-center gap-1">
                            <Users className="w-3 h-3" /> General
                        </span>
                    ) : (
                        <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-2 py-1 rounded flex items-center gap-1">
                            <User className="w-3 h-3" /> Personal
                        </span>
                    )}
                </div>

                <h4 className="font-bold text-sm text-white mb-1">{reward.title}</h4>
                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{reward.description}</p>

                {/* Target Info */}
                <div className="bg-slate-950/50 rounded-lg p-2 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 uppercase font-bold">Meta:</span>
                        <span className="text-white font-mono font-bold">
                            {reward.targetValue?.toLocaleString()}
                            {reward.targetType === 'diamonds' && ' 💎'}
                            {reward.targetType === 'hours' && ' h'}
                            {reward.targetType === 'days' && ' días'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Footer Action */}
            <div className="mt-auto">
                {isClaimed ? (
                    <div className="w-full py-2 bg-slate-950 text-emerald-500 font-bold rounded-lg border border-emerald-900/30 text-xs text-center flex items-center justify-center gap-2">
                        <Check className="w-3 h-3" /> Entregado a {winnerName}
                    </div>
                ) : winners.length > 0 ? (
                    <div className="space-y-2">
                        <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Trophy className="w-3 h-3" /> {winners.length} Ganadores Eligibles
                        </div>
                        {winners.slice(0, 3).map(winner => (
                            <button
                                key={winner.creatorId}
                                onClick={() => onClaim(reward.id, winner.creatorId)}
                                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-colors text-xs flex items-center justify-center gap-2"
                            >
                                Entregar a {winner.username}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-2 bg-slate-800 text-slate-500 font-bold rounded-lg border border-slate-700 text-xs text-center flex items-center justify-center gap-2">
                        <Clock className="w-3 h-3" /> En Progreso...
                    </div>
                )}
            </div>
        </motion.div>
    );
}
