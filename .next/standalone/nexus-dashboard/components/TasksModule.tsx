'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Creator } from '@/types';
import { getCreatorCategory, isPotential } from './KpiDetailModal';
import { TrendingUp, Zap, Star, AlertTriangle, Target, Users, Diamond, Clock, Lightbulb, ChevronRight } from 'lucide-react';

interface Props {
    creators: Creator[];
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
}

function ProgressBar({ value, max, color = 'bg-cyan-500', showPct = true }: { value: number; max: number; color?: string; showPct?: boolean }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
                className={`h-full rounded-full ${color}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
            />
        </div>
    );
}

function SectionHeader({ icon, title, subtitle, badge }: { icon: React.ReactNode; title: string; subtitle: string; badge?: string }) {
    return (
        <div className="flex items-start gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-slate-800 shrink-0">{icon}</div>
            <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-black text-white uppercase tracking-wide">{title}</h3>
                    {badge && <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{badge}</span>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            </div>
        </div>
    );
}

function TipCard({ tip, color = 'border-blue-500/30 bg-blue-500/5' }: { tip: string; color?: string }) {
    return (
        <div className={`flex items-start gap-2 p-3 rounded-xl border ${color}`}>
            <Lightbulb className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
        </div>
    );
}

// ─── Task 1: Diamond Revenue ─────────────────────────────────────────────────

const BONUS_LEVELS = [
    { pct: 70, bonus: 2, label: 'Nivel 1' },
    { pct: 80, bonus: 5, label: 'Nivel 2' },
    { pct: 90, bonus: 7, label: 'Nivel 3' },
    { pct: 100, bonus: 9, label: 'Nivel 4' },
    { pct: 110, bonus: 11, label: 'Nivel 5' },
    { pct: 120, bonus: 13, label: 'Nivel 6' },
    { pct: 130, bonus: 15, label: 'Nivel 7' },
];

function Task1({ creators }: { creators: Creator[] }) {
    const totalDiamonds = creators.reduce((s, c) => s + c.diamonds, 0);
    // Reference = sum of last month diamonds (our best estimate of TikTok's target)
    const referenceTarget = creators.reduce((s, c) => s + (c.lastMonthDiamonds || 0), 0) || totalDiamonds * 1.1;
    const fulfillmentPct = referenceTarget > 0 ? (totalDiamonds / referenceTarget) * 100 : 0;

    const currentLevel = BONUS_LEVELS.slice().reverse().find(l => fulfillmentPct >= l.pct);
    const nextLevel = BONUS_LEVELS.find(l => fulfillmentPct < l.pct);
    const diamondsToNext = nextLevel ? Math.ceil((nextLevel.pct / 100) * referenceTarget) - totalDiamonds : 0;

    // Estimated bonus $ (using 1 diamond ≈ $0.005 as rough TikTok rate)
    const estimatedRevenue = totalDiamonds * 0.005;
    const bonusRate = currentLevel?.bonus ?? 0;
    const estimatedBonus = estimatedRevenue * (bonusRate / 100);

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <SectionHeader
                icon={<TrendingUp className="w-5 h-5 text-cyan-400" />}
                title="Tarea 1 — Incremento de Ingresos"
                subtitle="Cuanto mayor sea la tasa de cumplimiento, mayor el bono"
                badge={currentLevel ? `${currentLevel.label} · ${currentLevel.bonus}% bono` : 'Sin nivel aún'}
            />

            {/* Progress */}
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Cumplimiento: <strong className="text-white">{fulfillmentPct.toFixed(1)}%</strong></span>
                    <span className="text-slate-400">Meta ref: <strong className="text-white">{fmt(referenceTarget)}</strong> 💎</span>
                </div>
                <ProgressBar value={fulfillmentPct} max={130} color={fulfillmentPct >= 100 ? 'bg-emerald-500' : fulfillmentPct >= 70 ? 'bg-cyan-500' : 'bg-red-500'} />
                <div className="flex justify-between text-[10px] text-slate-600">
                    {BONUS_LEVELS.map(l => (
                        <span key={l.pct} className={fulfillmentPct >= l.pct ? 'text-emerald-400 font-bold' : ''}>{l.pct}%</span>
                    ))}
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Diamantes</p>
                    <p className="text-lg font-black text-cyan-400 font-mono">{fmt(totalDiamonds)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Bono Actual</p>
                    <p className="text-lg font-black text-emerald-400">{bonusRate}%</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Para siguiente</p>
                    <p className="text-lg font-black text-orange-400 font-mono">{nextLevel ? `+${fmt(diamondsToNext)}` : '✅ Máx'}</p>
                </div>
            </div>

            {/* Tips */}
            <div className="space-y-2">
                {fulfillmentPct < 70 && (
                    <TipCard color="border-red-500/30 bg-red-500/5" tip={`⚠️ Estás por debajo del 70%. Activa a tus ${creators.filter(c => getCreatorCategory(c) === 'inactive').length} creadores inactivos — incluso 1h diaria de cada uno puede mover la aguja.`} />
                )}
                {fulfillmentPct >= 70 && fulfillmentPct < 100 && nextLevel && (
                    <TipCard color="border-yellow-500/30 bg-yellow-500/5" tip={`🎯 Te faltan ${fmt(diamondsToNext)} diamantes para el ${nextLevel.label} (${nextLevel.bonus}% bono). Enfócate en tus Potenciales Dormidos — ya saben generar, solo necesitan más horas.`} />
                )}
                {fulfillmentPct >= 100 && (
                    <TipCard color="border-emerald-500/30 bg-emerald-500/5" tip={`🏆 ¡Superaste el 100%! Sigue empujando hacia el 130% para maximizar el bono al 15%. Cada diamante extra vale más ahora.`} />
                )}
            </div>
        </div>
    );
}

// ─── Task 2: Beginner Bonus ──────────────────────────────────────────────────

const BEGINNER_MILESTONES = [
    { id: 'M0.5', diamonds: 100_000, bonus: 200, label: 'M0.5' },
    { id: 'M1R', diamonds: 200_000, bonus: 320, label: 'M1R' },
    { id: 'M1', diamonds: 200_000, bonus: 400, label: 'M1' },
    { id: 'M2', diamonds: 500_000, bonus: 1000, label: 'M2' },
];

function Task2({ creators }: { creators: Creator[] }) {
    const beginners = creators.filter(c =>
        c.graduationStatus?.toLowerCase().includes('principiante') ||
        c.graduationStatus?.toLowerCase().includes('beginner')
    );

    const qualifying = beginners.filter(c => c.validDays >= 7 && c.liveHours >= 15);
    const almostQualifying = beginners.filter(c => !qualifying.includes(c) && (c.validDays >= 4 || c.liveHours >= 8));

    // Map each qualifying beginner to their milestone
    const milestoneMap = BEGINNER_MILESTONES.reduce((acc, m) => {
        acc[m.id] = qualifying.filter(c => c.diamonds >= m.diamonds);
        return acc;
    }, {} as Record<string, Creator[]>);

    const totalBonusEarned = qualifying.reduce((sum, c) => {
        const m = BEGINNER_MILESTONES.slice().reverse().find(m => c.diamonds >= m.diamonds);
        return sum + (m?.bonus ?? 0);
    }, 0);

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <SectionHeader
                icon={<Star className="w-5 h-5 text-yellow-400" />}
                title="Tarea 2 — Bonus Principiantes"
                subtitle="Principiantes con ≥7 días válidos y ≥15h LIVE"
                badge={`$${totalBonusEarned.toLocaleString()} ganados`}
            />

            {/* Milestone grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                {BEGINNER_MILESTONES.map(m => {
                    const count = milestoneMap[m.id]?.length ?? 0;
                    return (
                        <div key={m.id} className={`rounded-xl p-3 text-center border ${count > 0 ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-slate-800/50 border-slate-700/50'}`}>
                            <p className={`text-xs font-black mb-1 ${count > 0 ? 'text-yellow-400' : 'text-slate-500'}`}>{m.label}</p>
                            <p className={`text-xl font-black font-mono ${count > 0 ? 'text-white' : 'text-slate-600'}`}>{count}</p>
                            <p className="text-[10px] text-slate-500 mt-1">${m.bonus} c/u</p>
                        </div>
                    );
                })}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Principiantes</p>
                    <p className="text-lg font-black text-white">{beginners.length}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Califican</p>
                    <p className="text-lg font-black text-emerald-400">{qualifying.length}</p>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase mb-1">Casi califican</p>
                    <p className="text-lg font-black text-orange-400">{almostQualifying.length}</p>
                </div>
            </div>

            {/* Near-miss list */}
            {almostQualifying.length > 0 && (
                <div className="mb-4">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">⚡ Casi califican — actívalos ahora:</p>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto custom-scrollbar">
                        {almostQualifying.slice(0, 8).map(c => (
                            <div key={c.creatorId} className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs">
                                <span className="text-white font-medium truncate max-w-[120px]">{c.username}</span>
                                <div className="flex gap-3 text-slate-400">
                                    <span className={c.validDays >= 7 ? 'text-emerald-400' : 'text-red-400'}>{c.validDays}d/{7}d</span>
                                    <span className={c.liveHours >= 15 ? 'text-emerald-400' : 'text-red-400'}>{c.liveHours.toFixed(0)}h/{15}h</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <TipCard color="border-yellow-500/30 bg-yellow-500/5" tip={`💡 Cada principiante que llegue a M2 (500K 💎) te da $1,000 extra. Prioriza a los que ya tienen más de 200K — solo necesitan más horas y días.`} />
                {almostQualifying.length > 0 && (
                    <TipCard color="border-orange-500/30 bg-orange-500/5" tip={`🔥 Tienes ${almostQualifying.length} principiantes que casi califican. Escríbeles hoy — con 2-3 días más de LIVE ya entran al programa de bonus.`} />
                )}
            </div>
        </div>
    );
}

// ─── Task 3: Activity Task ───────────────────────────────────────────────────

const ACTIVITY_LEVELS = [
    { level: 1, diamonds: 200_000, days: 12, hours: 25, bonusPct: 2 },
    { level: 2, diamonds: 200_000, days: 15, hours: 40, bonusPct: 3 },
    { level: 3, diamonds: 200_000, days: 20, hours: 60, bonusPct: 4 },
    { level: 4, diamonds: 200_000, days: 20, hours: 80, bonusPct: 5 },
    { level: 5, diamonds: 200_000, days: 22, hours: 100, bonusPct: 6 },
];

function Task3({ creators }: { creators: Creator[] }) {
    const levelCounts = ACTIVITY_LEVELS.map(l => ({
        ...l,
        qualifying: creators.filter(c => c.diamonds >= l.diamonds && c.validDays >= l.days && c.liveHours >= l.hours),
    }));

    // Near-miss: has 200K diamonds but missing days or hours for level 1
    const nearMiss = creators.filter(c =>
        c.diamonds >= 200_000 &&
        !(c.validDays >= 12 && c.liveHours >= 25) &&
        (c.validDays >= 8 || c.liveHours >= 15)
    );

    const totalQualifying = levelCounts[0].qualifying.length;

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <SectionHeader
                icon={<Zap className="w-5 h-5 text-purple-400" />}
                title="Tarea 3 — Tarea de Actividad"
                subtitle="Todos los anfitriones · ≥200K 💎 + días + horas"
                badge={`${totalQualifying} califican`}
            />

            {/* Level bars */}
            <div className="space-y-2.5 mb-4">
                {levelCounts.map(l => {
                    const maxPossible = creators.filter(c => c.diamonds >= l.diamonds).length;
                    return (
                        <div key={l.level} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-400">
                                    <span className={`font-bold ${l.qualifying.length > 0 ? 'text-purple-400' : 'text-slate-500'}`}>Nivel {l.level}</span>
                                    <span className="text-slate-600 ml-2">≥{l.days}d · ≥{l.hours}h · {l.bonusPct}% bono</span>
                                </span>
                                <span className={`font-black ${l.qualifying.length > 0 ? 'text-white' : 'text-slate-600'}`}>{l.qualifying.length}</span>
                            </div>
                            <ProgressBar
                                value={l.qualifying.length}
                                max={Math.max(maxPossible, 1)}
                                color={l.qualifying.length > 0 ? 'bg-purple-500' : 'bg-slate-700'}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Near-miss */}
            {nearMiss.length > 0 && (
                <div className="mb-4">
                    <p className="text-[10px] text-slate-500 uppercase font-bold mb-2">🎯 Tienen 200K+ 💎 pero les faltan días/horas para Nivel 1:</p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                        {nearMiss.slice(0, 10).map(c => {
                            const daysLeft = Math.max(0, 12 - c.validDays);
                            const hoursLeft = Math.max(0, 25 - c.liveHours);
                            return (
                                <div key={c.creatorId} className="flex items-center justify-between px-3 py-1.5 bg-slate-800/50 rounded-lg text-xs">
                                    <span className="text-white font-medium truncate max-w-[120px]">{c.username}</span>
                                    <div className="flex gap-3 text-slate-400">
                                        <span className="text-cyan-400 font-mono">{fmt(c.diamonds)}</span>
                                        {daysLeft > 0 && <span className="text-red-400">-{daysLeft}d</span>}
                                        {hoursLeft > 0 && <span className="text-orange-400">-{hoursLeft.toFixed(0)}h</span>}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                {nearMiss.length > 0 && (
                    <TipCard color="border-purple-500/30 bg-purple-500/5" tip={`🚀 ${nearMiss.length} creadores ya tienen +200K 💎 pero no califican al Nivel 1. Si cada uno agrega 3-4 días más de LIVE, entran al programa y tú ganas el 2% de bono sobre sus diamantes.`} />
                )}
                <TipCard color="border-blue-500/30 bg-blue-500/5" tip={`📊 El Nivel 5 (22 días + 100h) da el 6% de bono. Un creador con 500K 💎 en Nivel 5 te genera ~$150 extra solo en bono de actividad.`} />
            </div>
        </div>
    );
}

// ─── Segment Advice ──────────────────────────────────────────────────────────

function SegmentAdvice({ creators }: { creators: Creator[] }) {
    const inactive = creators.filter(c => getCreatorCategory(c) === 'inactive');
    const regular = creators.filter(c => getCreatorCategory(c) === 'regular');
    const superW = creators.filter(c => getCreatorCategory(c) === 'super');
    const potential = creators.filter(isPotential);
    const dayOfMonth = new Date().getDate();
    const daysLeft = 28 - dayOfMonth; // Feb 2026

    const advices = [
        {
            segment: `😴 Inactivos (${inactive.length})`,
            color: 'border-red-500/30 bg-red-500/5',
            icon: <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />,
            tips: [
                `Quedan ${daysLeft} días del mes. Incluso si se conectan 1h al día, pueden sumar ${daysLeft} días válidos y pasar a "Regular".`,
                `Envíales un mensaje de WhatsApp personalizado hoy. Los inactivos suelen responder a mensajes directos mejor que a grupos.`,
                `Ofrece un reto: "Si te conectas 5 días esta semana, te doy un bono de $X". El incentivo inmediato funciona mejor que el largo plazo.`,
            ]
        },
        {
            segment: `🕐 Regulares (${regular.length})`,
            color: 'border-yellow-500/30 bg-yellow-500/5',
            icon: <Clock className="w-4 h-4 text-yellow-400 shrink-0" />,
            tips: [
                `Los regulares están a mitad del camino. Si aumentan su frecuencia de 3-4 días/semana a 5, pasan a Super Trabajadores.`,
                `Crea un grupo de "Reto Semanal" con ellos — la competencia entre pares aumenta la actividad hasta un 40%.`,
                `Revisa cuáles tienen buena tendencia (+%) — esos ya están creciendo, solo necesitan más consistencia.`,
            ]
        },
        {
            segment: `⚡ Super Trabajadores (${superW.length})`,
            color: 'border-purple-500/30 bg-purple-500/5',
            icon: <Zap className="w-4 h-4 text-purple-400 shrink-0" />,
            tips: [
                `Estos son tu motor. Asegúrate de que estén en camino al Nivel 3+ de la Tarea 3 (≥20 días + ≥60h).`,
                `Dales feedback positivo y visibilidad — los Super Trabajadores se desmotivan si sienten que su esfuerzo no es reconocido.`,
                `Analiza sus horarios de LIVE — si transmiten en horas de bajo tráfico, ayúdalos a cambiar al horario pico de su audiencia.`,
            ]
        },
        {
            segment: `💎 Potenciales Dormidos (${potential.length})`,
            color: 'border-orange-500/30 bg-orange-500/5',
            icon: <Diamond className="w-4 h-4 text-orange-400 shrink-0" />,
            tips: [
                `Estos son tu mayor oportunidad de ROI. Ya saben generar diamantes — solo necesitan más tiempo en vivo.`,
                `Analiza por qué no se conectan más: ¿horario, motivación, técnica? Una llamada de 15 min puede desbloquear semanas de actividad.`,
                `Si un Potencial tiene +100K 💎 con pocas horas, imagina cuánto generaría con el doble de horas. Prioriza su activación sobre los inactivos totales.`,
            ]
        },
    ];

    return (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <SectionHeader
                icon={<Lightbulb className="w-5 h-5 text-yellow-400" />}
                title="Estrategias por Segmento"
                subtitle={`Consejos para maximizar ingresos — quedan ${daysLeft} días del mes`}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {advices.map(a => (
                    <div key={a.segment} className={`border rounded-xl p-4 ${a.color}`}>
                        <div className="flex items-center gap-2 mb-3">
                            {a.icon}
                            <p className="text-sm font-black text-white">{a.segment}</p>
                        </div>
                        <ul className="space-y-2">
                            {a.tips.map((tip, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs text-slate-300 leading-relaxed">
                                    <ChevronRight className="w-3 h-3 text-slate-500 shrink-0 mt-0.5" />
                                    {tip}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main Export ─────────────────────────────────────────────────────────────

export default function TasksModule({ creators }: Props) {
    if (creators.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
        >
            {/* Header */}
            <div className="flex items-center gap-3 pb-1 border-b border-slate-800">
                <Target className="w-5 h-5 text-nexus-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Tareas TikTok · Febrero 2026</h2>
                <span className="text-[10px] text-slate-500 ml-auto">Datos del Excel sincronizado</span>
            </div>

            {/* 3 Tasks */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <Task1 creators={creators} />
                <Task2 creators={creators} />
                <Task3 creators={creators} />
            </div>

            {/* Segment Advice */}
            <SegmentAdvice creators={creators} />
        </motion.div>
    );
}
