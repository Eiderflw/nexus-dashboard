import { Creator } from '@/types';
import { X, Copy, MessageCircle, TrendingUp, AlertTriangle, Save, Phone, Download, Share2 } from 'lucide-react';
import { generateAiAdvice } from '@/lib/analysis';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useCreatorStore } from '@/store/useCreatorStore';
import { ShareableCard } from './ShareableCard';
import html2canvas from 'html2canvas';

interface CreatorModalProps {
    creator: Creator | null;
    onClose: () => void;
}

export default function CreatorModal({ creator, onClose }: CreatorModalProps) {
    const defaultPhone = "57";
    const [copied, setCopied] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phone, setPhone] = useState(creator?.whatsapp || '');
    const [isDownloading, setIsDownloading] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const { updateCreator } = useCreatorStore();

    if (!creator) return null;

    const advice = generateAiAdvice(creator);
    const isGrowing = creator.diamondsGrowth >= 0;

    // Determine Status Logic (Same as Table)
    let statusMsg = "🚀 ¡Vas por buen camino!";
    let category = "STANDARD";
    if (creator.diamonds > 100000 || (creator.diamonds > 50000 && creator.liveHours > 40)) {
        statusMsg = "👑 ¡ERES ELITE! Estás rompiendo todos los récords.";
        category = "ELITE";
    } else if ((creator.diamonds > 10000 && creator.diamonds <= 100000) || (creator.liveHours > 30)) {
        statusMsg = "⭐ ¡GRAN TRABAJO! Estás muy cerca de subir de nivel.";
        category = "RISING";
    }
    // If declining
    if (creator.diamondsGrowth < -0.1) {
        statusMsg = "⚠️ HEMOS NOTADO UNA BAJA. Vamos a recuperar esos números.";
        category = "RISK";
    }

    const handleSavePhone = () => {
        updateCreator(creator.creatorId, { whatsapp: phone });
        setIsEditingPhone(false);
    };

    const handleDownloadCard = async () => {
        if (!cardRef.current) return;
        setIsDownloading(true);
        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 2,
                backgroundColor: '#020617',
                useCORS: true,
                allowTaint: true,
            });
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = `Nexus-Card-${creator.username}.png`;
            link.click();
        } catch (err) {
            console.error("Card download failed", err);
        }
        setIsDownloading(false);
    };

    const generateMessage = () => {
        return `Hola ${creator.username}!! ${category === 'ELITE' ? '👑' : '🌟'}
    
${statusMsg}

📊 *Tu Reporte Actual:*
💎 Diamantes: ${creator.diamonds.toLocaleString()} (${isGrowing ? '+' : ''}${(creator.diamondsGrowth * 100).toFixed(1)}%)
⏳ Horas: ${creator.liveHours.toFixed(1)}h
📅 Días: ${creator.validDays}

💡 *Estrategia para ti:*
${advice}

${category === 'RISK' ? '🚨 Necesitamos agendar una reunión urgente para ver qué pasa.' : '¡Sigue así, vamos por la siguiente meta! 💪'}`;
    };

    const whatsappLink = phone.length > 5
        ? `https://wa.me/${phone}?text=${encodeURIComponent(generateMessage())}`
        : `https://wa.me/?text=${encodeURIComponent(generateMessage())}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(generateMessage());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
            {/* Hidden Card for Capture */}
            <div className="absolute left-[9999px]">
                <ShareableCard ref={cardRef} creator={creator} />
            </div>

            <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative flex flex-col max-h-[90vh]">

                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-nexus-900/50 to-transparent pointer-events-none" />

                {/* Header */}
                <div className="p-6 relative z-10 shrink-0">
                    <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors bg-black/20 rounded-full p-2">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center">
                        <div className={`w-24 h-24 rounded-full p-1 ${isGrowing ? 'bg-gradient-to-br from-green-400 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-700'} shadow-xl mb-4 relative group`}>
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center border-4 border-slate-900 overflow-hidden relative">
                                <img
                                    src={creator.avatar || `/foto_perfil/${creator.username.replace(/[^a-zA-Z0-9_\.]/g, '')}.jpg`}
                                    onError={(e) => { e.currentTarget.src = '/default-user.png'; }}
                                    className="w-full h-full object-cover"
                                />
                                {/* Hover Overlay for Photo Actions if needed */}
                            </div>
                            {/* Download Button Small */}
                            <button
                                onClick={handleDownloadCard}
                                disabled={isDownloading}
                                className="absolute -bottom-2 -right-2 bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-full shadow-lg border border-slate-600 transition-colors tooltip"
                                title="Descargar Tarjeta"
                            >
                                {isDownloading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Download className="w-4 h-4" />}
                            </button>
                        </div>
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            {creator.username}
                            {category === 'ELITE' && <span className="text-xs bg-emerald-500 text-black px-2 py-0.5 rounded-full font-black tracking-tighter">ELITE</span>}
                            {category === 'RISK' && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-black tracking-tighter">RIESGO</span>}
                        </h2>
                        <p className="text-nexus-300 font-mono text-xs tracking-wider uppercase opacity-80">ID: {creator.creatorId}</p>
                    </div>
                </div>

                {/* Scrollable Body */}
                <div className="px-6 pb-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center hover:border-nexus-500/30 transition-colors">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Diamantes</p>
                            <p className="text-xl font-black text-white">{creator.diamonds.toLocaleString()}</p>
                            <p className={`text-[10px] ${isGrowing ? 'text-green-400' : 'text-red-400'}`}>
                                {isGrowing ? '+' : ''}{(creator.diamondsGrowth * 100).toFixed(0)}%
                            </p>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center hover:border-nexus-500/30 transition-colors">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Horas Live</p>
                            <p className="text-xl font-black text-blue-400">{creator.liveHours.toFixed(1)}h</p>
                        </div>
                        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-center hover:border-nexus-500/30 transition-colors">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Días Válidos</p>
                            <p className="text-xl font-black text-purple-400">{creator.validDays}</p>
                        </div>
                    </div>

                    {/* Daily Progress Section (DoD) */}
                    {(creator.dailyDiamondsChange !== undefined || creator.dailyLiveHoursChange !== undefined) && (
                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/50">
                            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" /> Progreso Diario (vs Ayer)
                            </h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Diamantes</p>
                                    <div className={cn("text-sm font-bold flex items-center justify-center gap-1",
                                        (creator.dailyDiamondsChange || 0) > 0 ? "text-emerald-400" : (creator.dailyDiamondsChange || 0) < 0 ? "text-rose-400" : "text-slate-500"
                                    )}>
                                        {(creator.dailyDiamondsChange || 0) > 0 ? <TrendingUp className="w-3 h-3" /> : (creator.dailyDiamondsChange || 0) < 0 ? <TrendingUp className="w-3 h-3 rotate-180" /> : null}
                                        {(creator.dailyDiamondsChange || 0) > 0 ? '+' : ''}{(creator.dailyDiamondsChange || 0).toLocaleString()}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Horas</p>
                                    <div className={cn("text-sm font-bold flex items-center justify-center gap-1",
                                        (creator.dailyLiveHoursChange || 0) > 0 ? "text-emerald-400" : (creator.dailyLiveHoursChange || 0) < 0 ? "text-rose-400" : "text-slate-500"
                                    )}>
                                        {(creator.dailyLiveHoursChange || 0) > 0 ? '+' : ''}{(creator.dailyLiveHoursChange || 0).toFixed(1)}h
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 mb-1">Días</p>
                                    <div className={cn("text-sm font-bold flex items-center justify-center gap-1",
                                        (creator.dailyValidDaysChange || 0) > 0 ? "text-emerald-400" : "text-slate-500"
                                    )}>
                                        {(creator.dailyValidDaysChange || 0) > 0 ? '+' : ''}{creator.dailyValidDaysChange || 0}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Historical Comparison (User Request: "Why did I drop/rise?") */}
                    <div className="bg-slate-800/30 p-4 rounded-2xl border border-slate-700/50">
                        <h3 className="text-xs font-bold text-nexus-300 uppercase mb-3 flex items-center gap-2">
                            📊 Comparativa Mensual (Mes Pasado vs Actual)
                        </h3>
                        <div className="space-y-3">
                            {/* Diamonds Row */}
                            <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                <span className="text-slate-400">Diamantes</span>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500">Mes Pasado</p>
                                        <p className="font-mono text-slate-300">{creator.lastMonthDiamonds.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500">Este Mes</p>
                                        <p className="font-mono font-bold text-white">{creator.diamonds.toLocaleString()}</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${creator.diamondsGrowth >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {creator.diamondsGrowth >= 0 ? '+' : ''}{(creator.diamondsGrowth * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            {/* Hours Row */}
                            <div className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                                <span className="text-slate-400">Horas Transmitidas</span>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500">Mes Pasado</p>
                                        <p className="font-mono text-slate-300">{creator.lastMonthLiveHours.toFixed(1)}h</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500">Este Mes</p>
                                        <p className="font-mono font-bold text-white">{creator.liveHours.toFixed(1)}h</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${creator.liveHoursGrowth >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {creator.liveHoursGrowth >= 0 ? '+' : ''}{(creator.liveHoursGrowth * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>

                            {/* Days Row */}
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-400">Días Válidos</span>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500">Mes Pasado</p>
                                        <p className="font-mono text-slate-300">{creator.lastMonthValidDays}d</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-500">Este Mes</p>
                                        <p className="font-mono font-bold text-white">{creator.validDays}d</p>
                                    </div>
                                    <div className={`px-2 py-1 rounded-lg text-xs font-bold ${creator.validDaysGrowth >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                        {creator.validDaysGrowth >= 0 ? '+' : ''}{(creator.validDaysGrowth * 100).toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* AI Insight Section */}
                    <div className={`p-5 rounded-2xl border ${category === 'RISK' ? 'bg-red-950/20 border-red-500/30' : category === 'ELITE' ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-slate-800/40 border-slate-700'}`}>
                        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-nexus-400" />
                            Análisis de Inteligencia
                        </h3>
                        <div className="flex gap-3">
                            <div className={`min-w-[4px] rounded-full ${category === 'ELITE' ? 'bg-emerald-500' : category === 'RISK' ? 'bg-red-500' : 'bg-nexus-500/50'}`} />
                            <p className="text-slate-300 text-sm leading-relaxed italic">
                                "{advice}"
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 bg-slate-900 border-t border-slate-800 shrink-0">
                    {/* Phone Editor */}
                    <div className="flex items-center gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 transition-all focus-within:border-nexus-500/50">
                        <Phone className="w-4 h-4 text-slate-500" />
                        <span className="text-slate-600 text-sm font-medium">WhatsApp:</span>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            disabled={!isEditingPhone}
                            placeholder="Ej: 573001234567"
                            className="bg-transparent border-none focus:ring-0 text-sm text-white flex-1 placeholder-slate-600 font-mono focus:outline-none"
                        />
                        {isEditingPhone ? (
                            <button onClick={handleSavePhone} className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors"><Save className="w-4 h-4" /></button>
                        ) : (
                            <button onClick={() => setIsEditingPhone(true)} className="text-nexus-400 text-xs hover:text-nexus-300 font-medium px-2 py-1 hover:bg-nexus-500/10 rounded">Editar</button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleCopy}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-slate-600"
                        >
                            {copied ? <span className="text-emerald-400 font-bold">¡Copiado!</span> : <><Copy className="w-4 h-4" /> Copiar</>}
                        </button>
                        <button
                            onClick={handleDownloadCard}
                            disabled={isDownloading}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 transition-all border border-slate-700 hover:border-slate-600"
                        >
                            {isDownloading ? <span className="animate-pulse">Generando...</span> : <><Download className="w-4 h-4" /> Tarjeta</>}
                        </button>
                        <button
                            onClick={() => window.open(whatsappLink, '_blank')}
                            className={`col-span-2 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${phone.length > 5 ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20' : 'bg-slate-700 cursor-not-allowed opacity-50'}`}
                        >
                            <MessageCircle className="w-4 h-4" /> Enviar Chat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
