module.exports = [
"[project]/nexus-dashboard/components/RevenueSimulator.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RevenueSimulator
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$components$2f$KpiDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/components/KpiDetailModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/dollar-sign.js [app-ssr] (ecmascript) <export default as DollarSign>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/trending-up.js [app-ssr] (ecmascript) <export default as TrendingUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/zap.js [app-ssr] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/users.js [app-ssr] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/chevron-down.js [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/chevron-up.js [app-ssr] (ecmascript) <export default as ChevronUp>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/trophy.js [app-ssr] (ecmascript) <export default as Trophy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/message-circle.js [app-ssr] (ecmascript) <export default as MessageCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/target.js [app-ssr] (ecmascript) <export default as Target>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/search.js [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/arrow-up-down.js [app-ssr] (ecmascript) <export default as ArrowUpDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/copy.js [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
'use client';
;
;
;
;
;
// ─── Constants From User Screenshots ─────────────────────────────────────────
const CURRENT_STATE = {
    totalBonus: 1550,
    beginnerBonus: 1440,
    activityBonus: 110.70,
    revenueBonus: 0,
    missingDiamondsForRevenue: 535090,
    missingCreatorsForActivity: 3,
    nextActivityBonus: 135.35
};
function fmt(n) {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return n.toLocaleString();
}
function fmtUSD(n) {
    return `$${n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
// ─── Helper: Identify specific creators to target ─────────────────────────────
function identifyingGaps(creators) {
    // 1. Activity Gap
    const almostActivity = creators.filter((c)=>c.diamonds >= 150_000 && (c.validDays >= 8 || c.liveHours >= 15) && !(c.diamonds >= 200_000 && c.validDays >= 12 && c.liveHours >= 25)).sort((a, b)=>b.diamonds - a.diamonds).slice(0, 5);
    // 2. Revenue Gap
    const revenueDrivers = creators.filter((c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$components$2f$KpiDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCreatorCategory"])(c) === 'super' || (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$components$2f$KpiDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPotential"])(c)).sort((a, b)=>b.diamonds - a.diamonds).slice(0, 5);
    // 3. Beginners Push
    const beginnerPush = creators.filter((c)=>(c.graduationStatus?.toLowerCase().includes('principiante') || c.graduationStatus?.toLowerCase().includes('beginner')) && (c.diamonds >= 150_000 && c.diamonds < 200_000 || c.diamonds >= 400_000 && c.diamonds < 500_000)).sort((a, b)=>b.diamonds - a.diamonds).slice(0, 5);
    // 4. Inactive Rescue
    const sleepingGiants = creators.filter((c)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$components$2f$KpiDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCreatorCategory"])(c) === 'inactive' && (c.lastMonthDiamonds > 10000 || c.diamonds > 5000)).sort((a, b)=>b.lastMonthDiamonds - a.lastMonthDiamonds).slice(0, 5);
    return {
        almostActivity,
        revenueDrivers,
        beginnerPush,
        sleepingGiants
    };
}
// ─── Goal Generator Logic ─────────────────────────────────────────────────────
function generateCreatorGoal(c, daysLeft) {
    const isBeginner = c.graduationStatus?.toLowerCase().includes('principiante') || c.graduationStatus?.toLowerCase().includes('beginner');
    const category = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$components$2f$KpiDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getCreatorCategory"])(c);
    const potential = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$components$2f$KpiDetailModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isPotential"])(c);
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
            gainValue: 50,
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
            gainValue: 200,
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
            gainValue: 500,
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
function CreatorAvatar({ url, name, size = 'md' }) {
    const [imageSrc, setImageSrc] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: `${sClass} rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-slate-300 shrink-0 select-none`,
            children: initials
        }, void 0, false, {
            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
            lineNumber: 203,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `${sClass} rounded-full bg-slate-800 border border-slate-600 overflow-hidden shrink-0`,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
            src: imageSrc || localPath,
            alt: name,
            className: "w-full h-full object-cover",
            onError: (e)=>{
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
            }
        }, void 0, false, {
            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
            lineNumber: 211,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
        lineNumber: 210,
        columnNumber: 9
    }, this);
}
// ─── Sub-components ───────────────────────────────────────────────────────────
function EarningsCard({ label, value, sub, color = 'text-white', big = false }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-slate-800/60 rounded-xl p-3 text-center border border-slate-700/50",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] text-slate-500 uppercase tracking-wider mb-1",
                children: label
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 239,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `font-black font-mono ${big ? 'text-2xl' : 'text-lg'} ${color}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 240,
                columnNumber: 13
            }, this),
            sub && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-[10px] text-slate-500 mt-0.5",
                children: sub
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 241,
                columnNumber: 21
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
        lineNumber: 238,
        columnNumber: 9
    }, this);
}
function ScenarioCard({ scenario }) {
    const [open, setOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const copyMessage = (e)=>{
        e.stopPropagation();
        if (scenario.messageScript) {
            navigator.clipboard.writeText(scenario.messageScript);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        layout: true,
        className: `border ${scenario.borderColor} ${scenario.bgColor} rounded-2xl overflow-hidden cursor-pointer transition-all hover:bg-slate-800/60`,
        onClick: ()=>setOpen((o)=>!o),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `p-2 rounded-xl bg-slate-800 ${scenario.color} shrink-0`,
                                        children: scenario.icon
                                    }, void 0, false, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 281,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: `text-sm font-black ${scenario.color}`,
                                                children: scenario.title
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 285,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-slate-400 mt-0.5",
                                                children: scenario.description
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 286,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 284,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 280,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-right shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[10px] text-slate-500",
                                        children: "Ganancia Potencial"
                                    }, void 0, false, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 290,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-lg font-black text-emerald-400 font-mono",
                                        children: scenario.gain
                                    }, void 0, false, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 291,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 289,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 279,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center mt-2 text-slate-600",
                        children: open ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 295,
                            columnNumber: 29
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                            className: "w-4 h-4"
                        }, void 0, false, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 295,
                            columnNumber: 65
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 294,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 278,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                children: open && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        height: 0,
                        opacity: 0
                    },
                    animate: {
                        height: 'auto',
                        opacity: 1
                    },
                    exit: {
                        height: 0,
                        opacity: 0
                    },
                    className: "border-t border-slate-700/50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 space-y-5 bg-slate-900/30",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                                className: "w-3.5 h-3.5 text-yellow-500"
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 312,
                                                columnNumber: 37
                                            }, this),
                                            "Estrategia: ",
                                            scenario.eventTitle
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 311,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-slate-400 leading-relaxed bg-slate-800/50 p-3 rounded-lg border border-slate-700/50",
                                        children: scenario.eventIdea
                                    }, void 0, false, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 315,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 310,
                                columnNumber: 29
                            }, this),
                            scenario.targetList && scenario.targetList.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                        className: "flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                                                className: "w-3.5 h-3.5 text-blue-400"
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 324,
                                                columnNumber: 41
                                            }, this),
                                            scenario.targetListTitle || 'Creadores Clave'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 323,
                                        columnNumber: 37
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid gap-2",
                                        children: scenario.targetList.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between bg-slate-800 p-2 rounded-lg border border-slate-700",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatorAvatar, {
                                                                url: c.avatar,
                                                                name: c.username,
                                                                size: "sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                                lineNumber: 331,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-bold text-white max-w-[120px] truncate",
                                                                children: c.username
                                                            }, void 0, false, {
                                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                                lineNumber: 332,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 330,
                                                        columnNumber: 49
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-right",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-mono text-cyan-400 block",
                                                                children: [
                                                                    fmt(c.diamonds),
                                                                    " 💎"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                                lineNumber: 335,
                                                                columnNumber: 53
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-slate-500",
                                                                children: [
                                                                    c.validDays,
                                                                    " días · ",
                                                                    c.liveHours.toFixed(1),
                                                                    "h"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                                lineNumber: 336,
                                                                columnNumber: 53
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 334,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, c.creatorId, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 329,
                                                columnNumber: 45
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 327,
                                        columnNumber: 37
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 322,
                                columnNumber: 33
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$circle$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageCircle$3e$__["MessageCircle"], {
                                                        className: "w-3.5 h-3.5 text-emerald-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 350,
                                                        columnNumber: 41
                                                    }, this),
                                                    "Guion para WhatsApp"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 349,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: copyMessage,
                                                className: "text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded hover:bg-emerald-500/20 transition-colors",
                                                children: "Copiar mensaje"
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 353,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 348,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-slate-950/50 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed relative group",
                                        children: scenario.messageScript
                                    }, void 0, false, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 360,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 347,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 307,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                    lineNumber: 301,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 299,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
        lineNumber: 273,
        columnNumber: 9
    }, this);
}
// ─── Action Modal ─────────────────────────────────────────────────────────────
function ActionModal({ creator, target, onClose }) {
    const [copied, setCopied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleCopy = ()=>{
        navigator.clipboard.writeText(target.script);
        setCopied(true);
        setTimeout(()=>setCopied(false), 2000);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
            initial: {
                scale: 0.95,
                opacity: 0
            },
            animate: {
                scale: 1,
                opacity: 1
            },
            className: "bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-5 shadow-2xl",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatorAvatar, {
                            url: creator.avatar,
                            name: creator.username,
                            size: "xl"
                        }, void 0, false, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 391,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-bold text-white",
                                    children: creator.username
                                }, void 0, false, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 393,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-slate-400",
                                    children: target.goal
                                }, void 0, false, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 394,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 392,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                    lineNumber: 390,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-slate-800/50 p-3 rounded-xl border border-slate-700/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[10px] uppercase font-bold text-slate-500 mb-1",
                                    children: "Estrategia Recomendada"
                                }, void 0, false, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 399,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-bold text-emerald-400 flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trophy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trophy$3e$__["Trophy"], {
                                            className: "w-4 h-4"
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 401,
                                            columnNumber: 29
                                        }, this),
                                        " ",
                                        target.strategy
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 400,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 398,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center justify-between mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] uppercase font-bold text-slate-500",
                                            children: "Mensaje para WhatsApp"
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 406,
                                            columnNumber: 29
                                        }, this),
                                        copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-[10px] text-emerald-400 flex items-center gap-1 font-bold",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                    lineNumber: 409,
                                                    columnNumber: 37
                                                }, this),
                                                " Copiado"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 408,
                                            columnNumber: 33
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleCopy,
                                            className: "text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                    className: "w-3 h-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                    lineNumber: 413,
                                                    columnNumber: 37
                                                }, this),
                                                " Copiar"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 412,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 405,
                                    columnNumber: 25
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-slate-950 p-3 rounded-xl border border-slate-800 text-sm text-slate-300 font-mono leading-relaxed",
                                    children: target.script
                                }, void 0, false, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 417,
                                    columnNumber: 25
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 404,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-white transition-colors",
                            children: "Cerrar"
                        }, void 0, false, {
                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                            lineNumber: 421,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                    lineNumber: 397,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
            lineNumber: 384,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
        lineNumber: 383,
        columnNumber: 9
    }, this);
}
// ─── Main Table Component ─────────────────────────────────────────────────────
function AllCreatorsTable({ creators }) {
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [sortConfig, setSortConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedAction, setSelectedAction] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const dayOfMonth = new Date().getDate();
    const daysLeft = 28 - dayOfMonth;
    const data = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        let processed = creators.map((c)=>({
                ...c,
                target: generateCreatorGoal(c, daysLeft)
            }));
        if (sortConfig) {
            processed.sort((a, b)=>{
                let va = a[sortConfig.key];
                let vb = b[sortConfig.key];
                if (sortConfig.key === 'gain') {
                    va = a.target.gainValue;
                    vb = b.target.gainValue;
                }
                if (va < vb) return sortConfig.direction === 'asc' ? -1 : 1;
                if (va > vb) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        } else {
            processed.sort((a, b)=>{
                const pMap = {
                    'Crítica': 5,
                    'Muy Alta': 4,
                    'Alta': 3,
                    'Media': 2,
                    'Baja': 1,
                    'Media (Ex-Top)': 2.5
                };
                return (pMap[b.target.priority] || 0) - (pMap[a.target.priority] || 0) || b.diamonds - a.diamonds;
            });
        }
        return processed;
    }, [
        creators,
        daysLeft,
        sortConfig
    ]);
    const filtered = data.filter((c)=>{
        if (search && !c.username.toLowerCase().includes(search.toLowerCase())) return false;
        if (filter === 'all') return true;
        return c.target.type === filter;
    });
    const handleSort = (key)=>{
        let direction = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({
            key,
            direction
        });
    };
    const SortIcon = ({ colKey })=>{
        if (sortConfig?.key !== colKey) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$up$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowUpDown$3e$__["ArrowUpDown"], {
            className: "w-3 h-3 opacity-30"
        }, void 0, false, {
            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
            lineNumber: 482,
            columnNumber: 48
        }, this);
        return sortConfig.direction === 'asc' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUp$3e$__["ChevronUp"], {
            className: "w-3 h-3 text-emerald-400"
        }, void 0, false, {
            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
            lineNumber: 483,
            columnNumber: 49
        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
            className: "w-3 h-3 text-emerald-400"
        }, void 0, false, {
            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
            lineNumber: 483,
            columnNumber: 102
        }, this);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-8 bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-slate-800 bg-slate-900/60 sticky top-0 z-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-sm font-black text-white uppercase tracking-widest flex items-center gap-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                            className: "w-5 h-5 text-emerald-400"
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 492,
                                            columnNumber: 29
                                        }, this),
                                        "Plan de Vuelo: Todos los Creadores (",
                                        filtered.length,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 491,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 490,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                                            className: "w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2"
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 498,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Buscar creador...",
                                            className: "bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 w-40",
                                            value: search,
                                            onChange: (e)=>setSearch(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 499,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 497,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 496,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 489,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide",
                        children: [
                            {
                                id: 'all',
                                label: 'Todos'
                            },
                            {
                                id: 'beginner',
                                label: '💰 Principiantes'
                            },
                            {
                                id: 'activity',
                                label: '⚡ Actividad'
                            },
                            {
                                id: 'revenue',
                                label: '💎 Ingresos'
                            },
                            {
                                id: 'inactive',
                                label: '💤 Inactivos'
                            }
                        ].map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setFilter(f.id),
                                className: `px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${filter === f.id ? 'bg-emerald-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`,
                                children: f.label
                            }, f.id, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 517,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 509,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 488,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-h-[500px] overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "w-full text-left border-collapse",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-slate-900/80 sticky top-0 z-10 backdrop-blur-sm shadow-sm",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white",
                                            onClick: ()=>handleSort('username'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    "Creador ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                        colKey: "username"
                                                    }, void 0, false, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 535,
                                                        columnNumber: 82
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 535,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 534,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white",
                                            onClick: ()=>handleSort('diamonds'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    "Diamantes ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                        colKey: "diamonds"
                                                    }, void 0, false, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 538,
                                                        columnNumber: 84
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 538,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 537,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white",
                                            onClick: ()=>handleSort('validDays'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    "Días ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                        colKey: "validDays"
                                                    }, void 0, false, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 541,
                                                        columnNumber: 79
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 541,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 540,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white",
                                            onClick: ()=>handleSort('liveHours'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    "Horas ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                        colKey: "liveHours"
                                                    }, void 0, false, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 544,
                                                        columnNumber: 80
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 544,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 543,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 text-[10px] uppercase text-slate-500 font-bold cursor-pointer hover:text-white",
                                            onClick: ()=>handleSort('gain'),
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-1",
                                                children: [
                                                    "Ganancia ",
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SortIcon, {
                                                        colKey: "gain"
                                                    }, void 0, false, {
                                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                        lineNumber: 547,
                                                        columnNumber: 83
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 547,
                                                columnNumber: 33
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 546,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "p-3 text-[10px] uppercase text-slate-500 font-bold text-right",
                                            children: "Acción IA"
                                        }, void 0, false, {
                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                            lineNumber: 549,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                    lineNumber: 533,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 532,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "divide-y divide-slate-800/50",
                                children: filtered.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-slate-800/30 transition-colors group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CreatorAvatar, {
                                                            url: c.avatar,
                                                            name: c.username,
                                                            size: "md"
                                                        }, void 0, false, {
                                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                            lineNumber: 557,
                                                            columnNumber: 41
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs font-bold text-white max-w-[100px] md:max-w-[140px] truncate",
                                                                children: c.username
                                                            }, void 0, false, {
                                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                                lineNumber: 559,
                                                                columnNumber: 45
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                            lineNumber: 558,
                                                            columnNumber: 41
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                    lineNumber: 556,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 555,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-3 text-xs text-cyan-400 font-mono",
                                                children: fmt(c.diamonds)
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 563,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-3 text-xs text-slate-400",
                                                children: c.validDays
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 564,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-3 text-xs text-slate-400",
                                                children: [
                                                    c.liveHours.toFixed(1),
                                                    "h"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 565,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-black text-emerald-400 font-mono",
                                                    children: c.target.gain
                                                }, void 0, false, {
                                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                    lineNumber: 567,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 566,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "p-3 text-right",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSelectedAction({
                                                            creator: c,
                                                            target: c.target
                                                        }),
                                                    className: "text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-colors shadow-lg shadow-blue-900/20",
                                                    children: "Ver Plan"
                                                }, void 0, false, {
                                                    fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                    lineNumber: 570,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                                lineNumber: 569,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, c.creatorId, true, {
                                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                        lineNumber: 554,
                                        columnNumber: 29
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 552,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 531,
                        columnNumber: 17
                    }, this),
                    filtered.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-8 text-center text-slate-500 text-sm",
                        children: "No se encontraron creadores en esta categoría."
                    }, void 0, false, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 582,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 530,
                columnNumber: 13
            }, this),
            selectedAction && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionModal, {
                creator: selectedAction.creator,
                target: selectedAction.target,
                onClose: ()=>setSelectedAction(null)
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 588,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
        lineNumber: 487,
        columnNumber: 9
    }, this);
}
function RevenueSimulator({ creators }) {
    const gaps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>identifyingGaps(creators), [
        creators
    ]);
    const dayOfMonth = new Date().getDate();
    const daysLeft = 28 - dayOfMonth;
    const scenarios = [
        {
            id: 'revenue_gap',
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trending$2d$up$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__TrendingUp$3e$__["TrendingUp"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 607,
                columnNumber: 19
            }, this),
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
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 622,
                columnNumber: 19
            }, this),
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
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 637,
                columnNumber: 19
            }, this),
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
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 652,
                columnNumber: 19
            }, this),
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        initial: {
            opacity: 0,
            y: 20
        },
        animate: {
            opacity: 1,
            y: 0
        },
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 pb-1 border-b border-slate-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$dollar$2d$sign$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__DollarSign$3e$__["DollarSign"], {
                        className: "w-5 h-5 text-emerald-400"
                    }, void 0, false, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 674,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-black text-white uppercase tracking-widest",
                        children: "Tus Bonos Reales"
                    }, void 0, false, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 675,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 673,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-slate-900/60 border border-slate-800 rounded-2xl p-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-base font-black text-white uppercase tracking-wide",
                                children: "Ganado hasta hoy"
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 681,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-slate-500",
                                children: "Sincronizado con tus reportes"
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 682,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 680,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EarningsCard, {
                                label: "Bonus Principiantes",
                                value: fmtUSD(CURRENT_STATE.beginnerBonus),
                                color: "text-emerald-400"
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 686,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EarningsCard, {
                                label: "Bonus Actividad",
                                value: fmtUSD(CURRENT_STATE.activityBonus),
                                color: "text-purple-400",
                                sub: "Faltan 3 para nivel sig."
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 687,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EarningsCard, {
                                label: "Tarea Incremento",
                                value: "$0.00",
                                color: "text-slate-500",
                                sub: `Faltan ${fmt(CURRENT_STATE.missingDiamondsForRevenue)} 💎`
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 688,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EarningsCard, {
                                label: "TOTAL GANADO",
                                value: fmtUSD(CURRENT_STATE.totalBonus),
                                color: "text-emerald-400",
                                big: true
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 689,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 685,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 679,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-slate-500 uppercase font-bold mb-3 flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$target$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Target$3e$__["Target"], {
                                className: "w-3.5 h-3.5"
                            }, void 0, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 696,
                                columnNumber: 21
                            }, this),
                            "Estrategias de Impacto Inmediato"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 695,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: scenarios.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ScenarioCard, {
                                scenario: s
                            }, s.id, false, {
                                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                                lineNumber: 701,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                        lineNumber: 699,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 694,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AllCreatorsTable, {
                creators: creators
            }, void 0, false, {
                fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
                lineNumber: 707,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/nexus-dashboard/components/RevenueSimulator.tsx",
        lineNumber: 668,
        columnNumber: 9
    }, this);
}
}),
];

//# sourceMappingURL=nexus-dashboard_components_RevenueSimulator_tsx_7e8d2806._.js.map