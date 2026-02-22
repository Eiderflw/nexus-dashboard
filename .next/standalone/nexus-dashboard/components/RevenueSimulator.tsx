'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Creator } from '@/types';
import { getCreatorCategory, isPotential } from './KpiDetailModal';
import { DollarSign, TrendingUp, Zap, Users, ChevronDown, ChevronUp, Trophy, MessageCircle, Star, Target, ArrowRight, Search, Filter, Diamond, ArrowUpDown, Copy, Check } from 'lucide-react';

interface Props {
    creators: Creator[];
}

// ─── Constants From User Screenshots ─────────────────────────────────────────
const CURRENT_STATE = {
    totalBonus: 1550, // $1.55K
    beginnerBonus: 1440, // $1.44K
    activityBonus: 110.70, // $110.70
    revenueBonus: 0,
    missingDiamondsForRevenue: 535090, // 535.09K
    missingCreatorsForActivity: 3,
    nextActivityBonus: 135.35, // Add $135.35 more
};

function fmt(n: number): string {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
}

function fmtUSD(n: number): string {
    return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Helper: Identify specific creators to target ─────────────────────────────
function identifyingGaps(creators: Creator[]) {
    // 1. Activity Gap
    const almostActivity = creators.filter(c =>
        c.diamonds >= 150_000 &&
        (c.validDays >= 8 || c.liveHours >= 15) &&
        !(c.diamonds >= 200_000 && c.validDays >= 12 && c.liveHours >= 25)
    ).sort((a, b) => b.diamonds - a.diamonds).slice(0, 5);

    // 2. Revenue Gap
    const revenueDrivers = creators
        .filter(c => getCreatorCategory(c) === 'super' || isPotential(c))
        .sort((a, b) => b.diamonds - a.diamonds)
        .slice(0, 5);

    // 3. Beginners Push
    const beginnerPush = creators.filter(c =>
        (c.graduationStatus?.toLowerCase().includes('principiante') || c.graduationStatus?.toLowerCase().includes('beginner')) &&
        ((c.diamonds >= 150_000 && c.diamonds < 200_000) || (c.diamonds >= 400_000 && c.diamonds < 500_000))
    ).sort((a, b) => b.diamonds - a.diamonds).slice(0, 5);

    // 4. Inactive Rescue
    const sleepingGiants = creators
        .filter(c => getCreatorCategory(c) === 'inactive' && (c.lastMonthDiamonds > 10000 || c.diamonds > 5000))
        .sort((a, b) => b.lastMonthDiamonds - a.lastMonthDiamonds)
        .slice(0, 5);

    return { almostActivity, revenueDrivers, beginnerPush, sleepingGiants };
}

// ─── Goal Generator Logic ─────────────────────────────────────────────────────
function generateCreatorGoal(c: Creator, daysLeft: number) {
    const isBeginner = c.graduationStatus?.toLowerCase().includes('principiante') || c.graduationStatus?.toLowerCase().includes('beginner');
    const category = getCreatorCategory(c);
    const potential = isPotential(c);

    // 1. Beginner Logic
    if (isBeginner) {
        if (c.diamonds < 100_000) return {
            type: 'beginner',
            goal: 'Llegar a 100K (M0.5)',
            missing: `${fmt(100000 - c.diamonds)} 💎`,
            gainValue: 200,
            gain: '+$200 USD',
            strategy: 'Fiesta de Debut',
            priority: 'Alta',
            script: `🌟 ¡Hola ${c.username}! Estás a nada de tu primer hito de 100K. Si llegamos esta semana, aseguras tu primer bono. ¿Hacemos un evento de debut?`
        };
        if (c.diamonds < 200_000) return {
            type: 'beginner',
            goal: 'Llegar a 200K (M1)',
            missing: `${fmt(200000 - c.diamonds)} 💎`,
            gainValue: 400,
            gain: '+$400 USD',
            strategy: 'Push de Mitad de Mes',
            priority: 'Muy Alta',
            script: `🚀 ${c.username}, vas increíble. Te faltan solo ${fmt(200000 - c.diamonds)} diamantes para los 200K. Es el salto grande. ¡Vamos con toda!`
        };
        if (c.diamonds < 500_000) return {
            type: 'beginner',
            goal: 'Llegar a 500K (M2)',
            missing: `${fmt(500000 - c.diamonds)} 💎`,
            gainValue: 1000,
            gain: '+$1,000 USD',
            strategy: 'Evento de Graduación',
            priority: 'Crítica',
            script: `🏆 ¡${c.username}! Estás a un paso de los 500K. Eso es ligas mayores. Organizaremos tu "Graduación" para cerrar la meta.`
        };
    }

    // 2. Inactive Logic
    if (category === 'inactive') {
        if (c.lastMonthDiamonds > 10000) return {
            type: 'inactive',
            goal: 'Reactivación (1 Live)',
            missing: '1 hora de live',
            gainValue: 50, // Potential future value
            gain: 'Recuperar Talento',
            strategy: 'Operación Fénix',
            priority: 'Media (Ex-Top)',
            script: `👻 Hola ${c.username}, te extrañamos. Tienes mucho potencial dormido. ¿Te animas a prender hoy 1 hora sin presiones? Solo saludar.`
        };
        return {
            type: 'inactive',
            goal: 'Primer Live del Mes',
            missing: 'Conexión',
            gainValue: 10,
            gain: 'Base de creadores',
            strategy: 'Mensaje de Hola',
            priority: 'Baja',
            script: `👋 Hola ${c.username}, ¿cómo vas? Hace mucho no te vemos en live. ¡Anímate hoy!`
        };
    }

    // 3. Activity Bonus Logic
    if (c.diamonds > 150_000) {
        if (c.validDays < 12 || c.liveHours < 25) return {
            type: 'activity',
            goal: 'Nivel 1 Actividad',
            missing: `+${Math.max(0, 12 - c.validDays)}d / +${Math.max(0, 25 - c.liveHours).toFixed(0)}h`,
            gainValue: 135,
            gain: 'Contribuye a +$135',
            strategy: 'Maratón de Horas',
            priority: 'Alta',
            script: `⚡ ${c.username}, ¡alerta de bono! Tienes los diamantes pero te faltan días/horas. No pierdas dinero por no prender. ¡Maratón hoy!`
        };
        if (c.validDays < 15 || c.liveHours < 40) return {
            type: 'activity',
            goal: 'Nivel 2 Actividad',
            missing: `+${Math.max(0, 15 - c.validDays)}d / +${Math.max(0, 40 - c.liveHours).toFixed(0)}h`,
            gainValue: 200, // Estimated value of jumping tier
            gain: 'Sube Bono al 3%',
            strategy: 'Reto de Constancia',
            priority: 'Media',
            script: `📈 ${c.username}, estás cerca de subir de nivel de bonificación de actividad. Mantén el ritmo de 2h diarias.`
        };
    }

    // 4. Revenue Logic
    if (potential || category === 'super') {
        const target = Math.ceil(c.diamonds * 1.2);
        return {
            type: 'revenue',
            goal: `Crecer 20% (${fmt(target)})`,
            missing: `+${fmt(target - c.diamonds)} 💎`,
            gainValue: 500, // Estimated revenue impact
            gain: 'Bono Incremento',
            strategy: 'Batalla PK',
            priority: 'Alta',
            script: `🔥 ${c.username}, eres top. Vamos por un 20% más este mes. Te tengo una batalla PK programada para el viernes. ¿Te sumas?`
        };
    }

    // Default Regular
    return {
        type: 'regular',
        goal: 'Mantener Constancia',
        missing: 'Seguir así',
        gainValue: 20,
        gain: 'Estabilidad',
        strategy: 'Seguimiento Semanal',
        priority: 'Baja',
        script: `👍 Hola ${c.username}, buen trabajo esta semana. Sigue así.`
    };
}

// ─── Avatar Component ─────────────────────────────────────────────────────────
function CreatorAvatar({ url, name, size = 'md' }: { url?: string; name: string; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);

    // Initials logic
    const initials = name ? name.substring(0, 2).toUpperCase() : '??';

    // Size classes
    const sizeClasses = {
        sm: 'w-6 h-6 text-[9px]',
        md: 'w-8 h-8 text-[10px]',
        lg: 'w-10 h-10 text-xs',
        xl: 'w-12 h-12 text-sm'
    };
    const sClass = sizeClasses[size];

    // Determine initial source (Local > Remote)
    // Format: /foto_perfil/[username].jpg
    const localPath = `/foto_perfil/${name}.jpg`;

    if (error) {
        return (
            <div className={`${sClass} rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300 shrink-0 select-none`}>
                {initials}
            </div>
        );
    }

    return (
        <div className={`${sClass} rounded-full bg-slate-800 border border-slate-600 overflow-hidden shrink-0`}>
            <img
                src={imageSrc || localPath}
                alt={name}
                className="w-full h-full object-cover"
                onError={(e) => {
                    // Try local -> then remote -> then error
                    if (imageSrc === localPath || !imageSrc) {
                        if (url && url !== localPath) {
                            setImageSrc(url);
                        } else {
                            setError(true);
                        }
                    } else {
                        // If remote fails too
                        setError(true);
                    }
                }}
            />
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function EarningsCard({ label, value, sub, color = 'text-white', big = false }: {
    label: string; value: string; sub?: string; color?: string; big?: boolean;
}) {
    return (
        <div className="bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/50">
            <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            <p className={`font-black font-mono ${big ? 'text-2xl' : 'text-lg'} ${color}`}>{value}</p>
            {sub && <p className="text-[10px] text-slate-500 mt-0.5">{sub}</p>}
        </div>
    );
}

interface Scenario {
    id: string;
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    borderColor: string;
    bgColor: string;
    gain: string;
    eventTitle?: string;
    eventIdea?: string;
    messageScript?: string;
    targetListTitle?: string;
    targetList?: Creator[];
}

function ScenarioCard({ scenario }: { scenario: Scenario }) {
    const [open, setOpen] = useState(false);

    const copyMessage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (scenario.messageScript) {
            navigator.clipboard.writeText(scenario.messageScript);
        }
    };

    return (
        <motion.div
            layout
            className={`border ${scenario.borderColor} ${scenario.bgColor} rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-slate-800/60`}
            onClick={() => setOpen(o => !o)}
        >
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-slate-800 ${scenario.color} shrink-0`}>
                            {scenario.icon}
                        </div>
                        <div>
                            <p className={`text-sm font-black ${scenario.color}`}>{scenario.title}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{scenario.description}</p>
                        </div>
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-500">Ganancia Potencial</p>
                        <p className="text-lg font-black text-emerald-400 font-mono">{scenario.gain}</p>
                    </div>
                </div>
                <div className="flex items-center justify-center mt-2 text-slate-600">
                    {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-700/50"
                    >
                        <div className="p-4 space-y-5 bg-slate-900/30">

                            {/* 1. The Strategy / Event */}
                            <div className="space-y-2">
                                <h4 className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                    <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                                    Estrategia: {scenario.eventTitle}
                                </h4>
                                <p className="text-sm text-slate-400 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                                    {scenario.eventIdea}
                                </p>
                            </div>

                            {/* 2. Target Creators */}
                            {scenario.targetList && scenario.targetList.length > 0 && (
                                <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <Users className="w-3.5 h-3.5 text-blue-400" />
                                        {scenario.targetListTitle || 'Creadores Clave'}
                                    </h4>
                                    <div className="grid gap-2">
                                        {scenario.targetList.map(c => (
                                            <div key={c.creatorId} className="flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700">
                                                <div className="flex items-center gap-2">
                                                    <CreatorAvatar url={c.avatar} name={c.username} size="sm" />
                                                    <span className="text-sm font-bold text-white max-w-[120px] truncate">{c.username}</span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-mono text-cyan-400 block">{fmt(c.diamonds)} 💎</span>
                                                    <span className="text-[10px] text-slate-500">
                                                        {c.validDays} días · {c.liveHours.toFixed(1)}h
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. The Message Script */}
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                                        Guion para WhatsApp
                                    </h4>
                                    <button
                                        onClick={copyMessage}
                                        className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors"
                                    >
                                        Copiar mensaje
                                    </button>
                                </div>
                                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed relative group">
                                    {scenario.messageScript}
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Action Modal ─────────────────────────────────────────────────────────────
function ActionModal({ creator, target, onClose }: { creator: Creator; target: any; onClose: () => void }) {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(target.script);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-4">
                    <CreatorAvatar url={creator.avatar} name={creator.username} size="xl" />
                    <div>
                        <h3 className="text-lg font-bold text-white">{creator.username}</h3>
                        <p className="text-xs text-slate-400">{target.goal}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                        <p className="text-[10px] uppercase font-bold text-slate-500 mb-1">Estrategia Recomendada</p>
                        <p className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                            <Trophy className="w-4 h-4" /> {target.strategy}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] uppercase font-bold text-slate-500">Mensaje para WhatsApp</p>
                            {copied ? (
                                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-bold">
                                    <Check className="w-3 h-3" /> Copiado
                                </span>
                            ) : (
                                <button onClick={handleCopy} className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1">
                                    <Copy className="w-3 h-3" /> Copiar
                                </button>
                            )}
                        </div>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono leading-relaxed">
                            {target.script}
                        </div>
                    </div>
                    <button onClick={onClose} className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white transition-colors">
                        Cerrar
                    </button>
                </div>
            </motion.div>
        </div>
    );
}

// ─── Main Table Component ─────────────────────────────────────────────────────
function AllCreatorsTable({ creators }: { creators: Creator[] }) {
    const [filter, setFilter] = useState<'all' | 'beginner' | 'activity' | 'revenue' | 'inactive'>('all');
    const [search, setSearch] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
    const [selectedAction, setSelectedAction] = useState<{ creator: Creator; target: any } | null>(null);

    const dayOfMonth = new Date().getDate();
    const daysLeft = 28 - dayOfMonth;

    const data = useMemo(() => {
        let processed = creators.map(c => ({
            ...c,
            target: generateCreatorGoal(c, daysLeft)
        }));

        if (sortConfig) {
            processed.sort((a, b) => {
                let va: any = a[sortConfig.key as keyof Creator];
                let vb: any = b[sortConfig.key as keyof Creator];
                if (sortConfig.key === 'gain') {
                    va = a.target.gainValue;
                    vb = b.target.gainValue;
                }
                if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
                if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            processed.sort((a, b) => {
                const pMap: Record<string, number> = { 'Crítica': 5, 'Muy Alta': 4, 'Alta': 3, 'Media': 2, 'Baja': 1, 'Media (Ex-Top)': 2.5 };
                return (pMap[b.target.priority] || 0) - (pMap[a.target.priority] || 0) || b.diamonds - a.diamonds;
            });
        }
        return processed;
    }, [creators, daysLeft, sortConfig]);

    const filtered = data.filter(c => {
        if (search && !c.username.toLowerCase().includes(search.toLowerCase())) return false;
        if (filter === 'all') return true;
        return c.target.type === filter;
    });

    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ colKey }: { colKey: string }) => {
        if (sortConfig?.key !== colKey) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
        return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 text-emerald-400" /> : <ChevronDown className="w-3 h-3 text-emerald-400" />;
    };

    return (
        <div className="mt-8 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-400" />
                            Plan de Vuelo: Todos los Creadores ({filtered.length})
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Buscar creador..."
                                className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-40"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'beginner', label: '💰 Principiantes' },
                        { id: 'activity', label: '⚡ Actividad' },
                        { id: 'revenue', label: '💎 Ingresos' },
                        { id: 'inactive', label: '💤 Inactivos' }
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id as any)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${filter === f.id
                                ? 'bg-emerald-500 text-slate-900'
                                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm">
                        <tr>
                            <th className="p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('username')}>
                                <div className="flex items-center gap-1">Creador <SortIcon colKey="username" /></div>
                            </th>
                            <th className="p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('diamonds')}>
                                <div className="flex items-center gap-1">Diamantes <SortIcon colKey="diamonds" /></div>
                            </th>
                            <th className="p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('validDays')}>
                                <div className="flex items-center gap-1">Días <SortIcon colKey="validDays" /></div>
                            </th>
                            <th className="p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('liveHours')}>
                                <div className="flex items-center gap-1">Horas <SortIcon colKey="liveHours" /></div>
                            </th>
                            <th className="p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white" onClick={() => handleSort('gain')}>
                                <div className="flex items-center gap-1">Ganancia <SortIcon colKey="gain" /></div>
                            </th>
                            <th className="p-3 text-[10px] uppercase text-slate-500 font-bold text-right">Acción IA</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {filtered.map(c => (
                            <tr key={c.creatorId} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="p-3">
                                    <div className="flex items-center gap-3">
                                        <CreatorAvatar url={c.avatar} name={c.username} size="md" />
                                        <div>
                                            <p className="text-xs font-bold text-white max-w-[100px] md:max-w-[140px] truncate">{c.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-3 text-xs text-cyan-400 font-mono">{fmt(c.diamonds)}</td>
                                <td className="p-3 text-xs text-slate-400">{c.validDays}</td>
                                <td className="p-3 text-xs text-slate-400">{c.liveHours.toFixed(1)}h</td>
                                <td className="p-3">
                                    <p className="text-xs font-black text-emerald-400 font-mono">{c.target.gain}</p>
                                </td>
                                <td className="p-3 text-right">
                                    <button
                                        onClick={() => setSelectedAction({ creator: c, target: c.target })}
                                        className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20"
                                    >
                                        Ver Plan
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-500 text-sm">
                        No se encontraron creadores en esta categoría.
                    </div>
                )}
            </div>
            {selectedAction && (
                <ActionModal
                    creator={selectedAction.creator}
                    target={selectedAction.target}
                    onClose={() => setSelectedAction(null)}
                />
            )}
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RevenueSimulator({ creators }: Props) {
    const gaps = useMemo(() => identifyingGaps(creators), [creators]);
    const dayOfMonth = new Date().getDate();
    const daysLeft = 28 - dayOfMonth;

    const scenarios: Scenario[] = [
        {
            id: 'revenue_gap',
            icon: <TrendingUp className="w-4 h-4" />,
            title: 'Cerrar Brecha de Ingresos ($1,660 USD)',
            description: `Te faltan 535K diamantes. Activa a tus Top Generadores.`,
            color: 'text-cyan-400',
            borderColor: 'border-cyan-500/30',
            bgColor: 'bg-cyan-500/5',
            gain: '+$1,660 USD',
            eventTitle: 'Batalla de Titanes (Fin de Semana)',
            eventIdea: `Organiza un torneo triangular PK este fin de semana entre tus Top 3 generadores. La competencia puede generar los 50-100K diarios que necesitas.`,
            targetListTitle: 'Tu Escuadrón de Elite',
            targetList: gaps.revenueDrivers,
            messageScript: `🔥 ¡Hola [Nombre]! Eres de nuestros mejores talentos y quiero invitarte al "Desafío de Titanes" este fin de semana.\n\nVamos a hacer PKs oficiales con apoyo de la agencia. Si logramos romper la meta de 500K puntos en equipo, habrá premios.\n\n¿Cuento contigo para una batalla el viernes a las 8pm? 🚀`
        },
        {
            id: 'activity_gap',
            icon: <Zap className="w-4 h-4" />,
            title: 'Rescate de Actividad ($135 USD)',
            description: `Solo necesitas 3 creadores más para subir de nivel de bono.`,
            color: 'text-purple-400',
            borderColor: 'border-purple-500/30',
            bgColor: 'bg-purple-500/5',
            gain: '+$135.35 USD',
            eventTitle: 'Operación "Última Milla"',
            eventIdea: `Estos 3 creadores ya tienen los diamantes (>200K) pero les falta consistencia. Ofréceles una "maratón de horas" acompañada.`,
            targetListTitle: 'Casi Calificados (Focus Group)',
            targetList: gaps.almostActivity,
            messageScript: `👋 Hola [Nombre], ¡tengo una excelente noticia! Revisé tus métricas y ESTÁS A NADA de desbloquear un bono extra de visibilidad.\n\nSolo te faltan [X] días/horas de live. Tienes los diamantes de sobra, es una lástima perder el bono por no prender.\n\n¿Hacemos un live hoy de 2 horitas? Yo me paso a saludar. ¡Vamos que tú puedes! 💪`
        },
        {
            id: 'beginner_push',
            icon: <Star className="w-4 h-4" />,
            title: 'Bonus Principiantes ($320 USD)',
            description: `Activa a 1 principiante clave para saltar de nivel.`,
            color: 'text-yellow-400',
            borderColor: 'border-yellow-500/30',
            bgColor: 'bg-yellow-500/5',
            gain: '+$320 USD',
            eventTitle: 'Debut Estelar',
            eventIdea: `Identifica al principiante más cerca de los 200K. Organiza su "Fiesta de Bienvenida" invitando a otros creadores.`,
            targetListTitle: 'Principiantes Promesa',
            targetList: gaps.beginnerPush,
            messageScript: `🌟 ¡Hola [Nombre]! Vas increíble para ser tu primer mes. Estás súper cerca de tu primera gran meta de 200K.\n\nSi aprietas el acelerador estos días, te consagras como "Rookie del Mes".\n\n¿Qué te parece si organizamos una dinámica especial en tu próximo live? Avísame y te ayudo a prepararla. ✨`
        },
        {
            id: 'inactive_rescue',
            icon: <Users className="w-4 h-4" />,
            title: 'Reactivación de Dormidos (Largo Plazo)',
            description: `Inactivos con potencial histórico. Recupéralos.`,
            color: 'text-red-400',
            borderColor: 'border-red-500/30',
            bgColor: 'bg-red-500/5',
            gain: 'Potencial Futuro',
            eventTitle: 'Operación Fénix',
            eventIdea: `No les pidas diamantes. Pídeles presencia. Crea el "Reto 3 Días": Si transmiten 3 días seguidos (mínimo 1h), entran a un sorteo interno.`,
            targetListTitle: 'Gigantes Dormidos',
            targetList: gaps.sleepingGiants,
            messageScript: `👻 ¡Hola [Nombre]! Te extrañamos en la agencia. Tienes un perfil con mucho potencial y es una pena verlo en pausa.\n\nQueremos reactivarte con el "Reto Fénix": solo 3 lives esta semana, sin presión de diamantes. Solo volver a conectar con tu audiencia.\n\n¿Te animas a probar uno hoy? ¡Avísame y te apoyo! 🔥`
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
        >
            <div className="flex items-center gap-3 pb-1 border-b border-slate-800">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm font-black text-white uppercase tracking-widest">Tus Bonos Reales</h2>
            </div>

            {/* Current Real State */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-black text-white uppercase tracking-wide">Ganado hasta hoy</h3>
                    <span className="text-xs text-slate-500">Sincronizado con tus reportes</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                    <EarningsCard label="Bonus Principiantes" value={fmtUSD(CURRENT_STATE.beginnerBonus)} color="text-emerald-400" />
                    <EarningsCard label="Bonus Actividad" value={fmtUSD(CURRENT_STATE.activityBonus)} color="text-purple-400" sub="Faltan 3 para nivel sig." />
                    <EarningsCard label="Tarea Incremento" value="$0.00" color="text-slate-500" sub={`Faltan ${fmt(CURRENT_STATE.missingDiamondsForRevenue)} 💎`} />
                    <EarningsCard label="TOTAL GANADO" value={fmtUSD(CURRENT_STATE.totalBonus)} color="text-emerald-400" big />
                </div>
            </div>

            {/* Strategic Actions (Restored) */}
            <div>
                <p className="text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    Estrategias de Impacto Inmediato
                </p>
                <div className="space-y-3">
                    {scenarios.map(s => (
                        <ScenarioCard key={s.id} scenario={s} />
                    ))}
                </div>
            </div>

            {/* The Big Table */}
            <AllCreatorsTable creators={creators} />
        </motion.div>
    );
}
