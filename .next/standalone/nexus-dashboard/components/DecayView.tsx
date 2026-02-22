import { Creator } from '@/types';
import { motion } from 'framer-motion';
import { X, Copy, MessageCircle, AlertTriangle, Clock, TrendingDown } from 'lucide-react';
import { generateAiAdvice } from '@/lib/analysis';
import { useState } from 'react';

interface DecayViewProps {
    creators: Creator[];
    onClose: () => void;
}

export default function DecayView({ creators, onClose }: DecayViewProps) {
    const [selectedMessage, setSelectedMessage] = useState<{ id: string, text: string } | null>(null);

    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedProgress = Math.round((currentDay / daysInMonth) * 100);

    const handleGenerateMessage = (creator: Creator) => {
        const message = generateAiAdvice(creator);
        setSelectedMessage({ id: creator.creatorId, text: message });
        navigator.clipboard.writeText(message);
        // Could show a toast here in a real app
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-slate-900 border border-red-900/50 w-full max-w-7xl h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                {/* Header */}
                <div className="p-6 border-b border-red-900/30 flex justify-between items-center bg-red-950/20">
                    <div>
                        <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                            <AlertTriangle className="w-6 h-6" /> Centro de Recuperación ({creators.length})
                        </h2>
                        <div className="flex items-center gap-4 text-slate-400 text-sm mt-1">
                            <span>📅 Día {currentDay}/{daysInMonth}</span>
                            <span className="text-red-400 font-bold">🎯 Meta Experada: {expectedProgress}%</span>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 custom-scrollbar">
                    {creators.map(creator => {
                        const achieved = Math.round((creator.diamondsAchieved || 0) * 100);
                        const dailyTrend = Math.round((creator.diamondsDailyTrend || 0) * 100);

                        // Status: Critical if way behind schedule
                        const isCritical = achieved < expectedProgress * 0.7;

                        const isSelected = selectedMessage?.id === creator.creatorId;

                        return (
                            <div key={creator.creatorId} className={`bg-slate-950 border rounded-xl p-4 transition-all group ${isCritical ? 'border-red-600/50 shadow-[0_0_10px_rgba(220,38,38,0.1)]' : 'border-red-900/20'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-red-500/30">
                                        <img
                                            src={`/foto_perfil/${creator.username.replace(/[^a-zA-Z0-9_\.]/g, '')}.jpg`}
                                            alt={creator.username}
                                            className="w-full h-full object-cover"
                                            onError={(e) => e.currentTarget.src = '/default-user.png'}
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-white truncate">{creator.username}</h3>
                                        {/* Progress Bar */}
                                        <div className="mt-1 w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${isCritical ? 'bg-red-500' : 'bg-yellow-500'}`}
                                                style={{ width: `${Math.min(100, achieved)}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-[10px] mt-1">
                                            <span className={isCritical ? 'text-red-400 font-bold' : 'text-slate-400'}>{achieved}% Logrado</span>
                                            <span className="text-slate-500">Meta: {expectedProgress}%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-4 bg-black/20 p-2 rounded-lg">
                                    <div className="col-span-2 border-b border-white/5 pb-1 mb-1 flex justify-between">
                                        <span className="uppercase text-[10px] font-bold">Tendencia Hoy (vs Mes Pasado)</span>
                                        <span className={`${dailyTrend < 0 ? 'text-red-400' : 'text-green-400'} font-black`}>
                                            {dailyTrend > 0 ? '+' : ''}{dailyTrend}%
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-600 uppercase text-[10px]">Total Mes</span>
                                        <span className="text-white font-mono">{creator.diamonds.toLocaleString()} 💎</span>
                                    </div>
                                    <div>
                                        <span className="block text-slate-600 uppercase text-[10px]">Horas</span>
                                        <span className={`${creator.liveHours < 10 ? 'text-red-400' : 'text-white'} font-mono`}>{creator.liveHours.toFixed(1)}h</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleGenerateMessage(creator)}
                                    className={`w-full py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${isSelected
                                        ? 'bg-green-600 text-white shadow-[0_0_15px_rgba(22,163,74,0.5)]'
                                        : 'bg-red-900/30 hover:bg-red-600 text-red-200 hover:text-white border border-red-800 hover:border-red-500'
                                        }`}
                                >
                                    {isSelected ? (
                                        <>¡Copiado! <Copy className="w-4 h-4" /></>
                                    ) : (
                                        <>Generar Mensaje <MessageCircle className="w-4 h-4" /></>
                                    )}
                                </button>

                                {isSelected && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        className="mt-3 text-[11px] text-slate-300 bg-black/40 p-2 rounded border border-green-900/50 italic leading-tight"
                                    >
                                        "{selectedMessage.text}"
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
