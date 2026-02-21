module.exports = [
"[project]/nexus-dashboard/lib/excel-parser.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "parseExcel",
    ()=>parseExcel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/xlsx/xlsx.mjs [app-ssr] (ecmascript)");
;
const parseExcel = (file, onProgress)=>{
    return new Promise((resolve, reject)=>{
        const reader = new FileReader();
        reader.onprogress = (e)=>{
            if (e.lengthComputable && onProgress) {
                const percent = Math.round(e.loaded / e.total * 50); // Reading is 50% of the work
                onProgress(percent);
            }
        };
        reader.onload = (e)=>{
            try {
                if (onProgress) onProgress(60); // File read complete
                const data = e.target?.result;
                const workbook = __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["read"](data, {
                    type: 'binary'
                });
                if (onProgress) onProgress(80); // Workbook parsed
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];
                const jsonData = __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$xlsx$2f$xlsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["utils"].sheet_to_json(sheet);
                if (jsonData.length === 0) {
                    throw new Error("El archivo Excel está vacío o no se pudieron leer las filas.");
                }
                // Validation: Check for critical columns in the first row
                const firstRow = jsonData[0];
                const requiredColumns = [
                    'ID del creador',
                    'Nombre de usuario del creador',
                    'Diamantes',
                    'Duración de LIVE'
                ];
                const missingColumns = requiredColumns.filter((col)=>!(col in firstRow));
                if (missingColumns.length > 0) {
                    throw new Error(`Faltan columnas obligatorias: ${missingColumns.join(', ')}. Por favor verifica el formato del archivo.`);
                }
                const creators = jsonData.map((row)=>({
                        period: row['Periodo de datos'] || '',
                        creatorId: String(row['ID del creador'] || ''),
                        username: row['Nombre de usuario del creador'] || 'Unknown',
                        group: row['Grupo'] || '',
                        agent: row['Agente'] || '',
                        joinTime: row['Hora de incorporación'] || '',
                        daysSinceJoin: Number(row['Días desde la incorporación']) || 0,
                        diamonds: Number(row['Diamantes']) || 0,
                        liveHours: parseDuration(row['Duración de LIVE']),
                        validDays: Number(row['Días válidos de emisiones LIVE']) || 0,
                        newFollowers: Number(row['Nuevos seguidores']) || 0,
                        liveSessions: Number(row['Emisiones LIVE']) || 0,
                        lastMonthDiamonds: Number(row['Diamantes en el último mes']) || 0,
                        lastMonthLiveHours: Number(row['Duración de emisiones LIVE (en horas) durante el último mes']) || 0,
                        lastMonthValidDays: Number(row['Días válidos de emisiones LIVE del mes pasado']) || 0,
                        lastMonthNewFollowers: Number(row['Nuevos seguidores en el último mes']) || 0,
                        lastMonthLiveSessions: Number(row['Emisiones LIVE en el último mes']) || 0,
                        diamondsAchieved: parsePercentage(row['Diamantes - Porcentaje logrado']),
                        liveHoursAchieved: parsePercentage(row['Duración de LIVE - Porcentaje logrado']),
                        validDaysAchieved: parsePercentage(row['Días válidos de emisiones LIVE - Porcentaje logrado']),
                        newFollowersAchieved: parsePercentage(row['Nuevos seguidores - Porcentaje logrado']),
                        liveSessionsAchieved: parsePercentage(row['Emisiones LIVE - Porcentaje logrado']),
                        diamondsGrowth: parsePercentage(row['Diamantes - frente al mes pasado']),
                        liveHoursGrowth: parsePercentage(row['Duración de LIVE - frente al mes pasado']),
                        validDaysGrowth: parsePercentage(row['Días válidos de emisiones LIVE - frente al mes pasado']),
                        newFollowersGrowth: parsePercentage(row['Nuevos seguidores - frente al mes pasado']),
                        liveSessionsGrowth: parsePercentage(row['Emisiones LIVE - frente al mes pasado']),
                        battles: Number(row['Partidas']) || 0,
                        battleDiamonds: Number(row['Diamantes de partidas']) || 0,
                        newLiveCreators: Number(row['Nuevos creadores LIVE']) || 0,
                        multiGuestDiamonds: Number(row['Diamantes del modo de varios invitados']) || 0,
                        multiGuestHostDiamonds: Number(row['Diamantes de varios invitados (como anfitrión)']) || 0,
                        multiGuestGuestDiamonds: Number(row['Diamantes del modo de varios invitados (como invitado)']) || 0,
                        baseDiamondsBeforeJoin: Number(row['Base de Diamantes antes de unirse']) || 0,
                        graduationStatus: row['Estado de graduación'] || ''
                    }));
                if (onProgress) onProgress(100); // Done
                resolve(creators);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error)=>reject(new Error("Error al leer el archivo."));
        reader.readAsBinaryString(file);
    });
};
const parseDuration = (value)=>{
    if (typeof value === 'number') return value * 24; // Excel stores time as fraction of day usually, but here it might be explicit. 
    // If it's just a number like 26.5, return it. If it's < 1 and > 0, likely a day fraction? 
    // Let's assume if it's a number it's hours if > 1, or check context. 
    // Actually, looking at screenshot, it's a string. If Excel parses it as number, it's usually days.
    // Safest is to handle string.
    if (typeof value === 'string') {
        value = value.trim();
        let hours = 0;
        let minutes = 0;
        let seconds = 0;
        const hMatch = value.match(/(\d+)\s*h/);
        const mMatch = value.match(/(\d+)\s*min/);
        const sMatch = value.match(/(\d+)\s*s/);
        if (hMatch) hours = parseInt(hMatch[1], 10);
        if (mMatch) minutes = parseInt(mMatch[1], 10);
        if (sMatch) seconds = parseInt(sMatch[1], 10);
        return hours + minutes / 60 + seconds / 3600;
    }
    return 0;
};
const parsePercentage = (value)=>{
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
        return parseFloat(value.replace('%', '')) / 100;
    }
    return 0;
};
}),
"[project]/nexus-dashboard/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/nexus-dashboard/lib/analysis.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateAiAdvice",
    ()=>generateAiAdvice,
    "getAtRiskCreators",
    ()=>getAtRiskCreators,
    "getBattleSpecialists",
    ()=>getBattleSpecialists,
    "getConsistencyScore",
    ()=>getConsistencyScore,
    "getRisingStars",
    ()=>getRisingStars,
    "getTopCreators",
    ()=>getTopCreators
]);
const getTopCreators = (creators, limit = 10)=>{
    return [
        ...creators
    ].sort((a, b)=>b.diamonds - a.diamonds).slice(0, limit);
};
const getRisingStars = (creators)=>{
    // New creators (< 30 days) with high diamonds (> 1000 or top 20% percentile logic if we had it)
    // For MVP: < 45 days tenure and > 500 diamonds
    return creators.filter((c)=>c.daysSinceJoin <= 45 && c.diamonds > 500).sort((a, b)=>b.diamondsGrowth - a.diamondsGrowth);
};
const getAtRiskCreators = (creators)=>{
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedProgress = currentDay / daysInMonth; // e.g. 13/30 = 0.43 (43%)
    // Logic: At Risk if 'Month Progress' (diamondsAchieved) is significantly behind 'Expected Progress'
    // OR if 'Daily Trend' (diamondsGrowth) is severely negative (-50%+) indicating a crash today.
    return creators.filter((c)=>{
        const isVeteran = c.daysSinceJoin > 30; // Only check people who have been here a while
        // Lagging Month Progress: They have achieved less than 80% of what they should have by now
        // e.g. Expected 43%, they have < 34%
        const isLagging = c.diamondsAchieved < expectedProgress * 0.8;
        // Crashing Daily: Today they did much worse than same day last month
        const isCrashingDaily = c.diamondsGrowth < -0.5;
        return isVeteran && (isLagging || isCrashingDaily);
    }).sort((a, b)=>a.diamondsAchieved - b.diamondsAchieved); // Sort by lowest progress first
};
const getBattleSpecialists = (creators)=>{
    // High ratio of Battle diamonds to Total diamonds
    return creators.filter((c)=>{
        const ratio = c.battleDiamonds / (c.diamonds || 1);
        return c.diamonds > 1000 && ratio > 0.4; // > 40% income from battles
    }).sort((a, b)=>b.battleDiamonds - a.battleDiamonds);
};
const generateAiAdvice = (creator)=>{
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedProgressPercent = Math.round(currentDay / daysInMonth * 100);
    const achievedPercent = Math.round((creator.diamondsAchieved || 0) * 100);
    const dailyTrendPercent = Math.round((creator.diamondsDailyTrend || 0) * 100);
    // 1. Critical Decline (Decay Recovery Message - User Request)
    // If lagging behind monthly schedule
    if (achievedPercent < expectedProgressPercent * 0.9) {
        return `Hola ${creator.username}! 📉 Análisis de tu Agencia: Hoy es día ${currentDay} y llevas un PROGRESO DEL ${achievedPercent}% de tu meta mensual. Deberías ir por el ${expectedProgressPercent}% para superar tu mes anterior. 💡 TU TENDENCIA HOY: ${dailyTrendPercent > 0 ? '+' : ''}${dailyTrendPercent}% vs este día el mes pasado. ¡Aura! Necesitas apretar el paso: transmite horas extras y activa batallas PK YA. 🚀`;
    }
    // 2. Low Consistency (Yellow Flag)
    if (creator.validDays < 5 && creator.daysSinceJoin > 10) {
        return "⚠️ CONSISTENCIA BAJA: No está cumpliendo los días mínimos. Sugerencia: Establecer un horario fijo y publicarlo en sus estados.";
    }
    // 3. High Potential (Green Flag)
    if (creator.newFollowers > 50 && creator.diamondsGrowth > 0.1) {
        return "🚀 TENDENCIA VIRAL: Está ganando seguidores rápido. Sugerencia: Pedir a los nuevos fans que se unan al grupo de fans o Discord.";
    }
    // 4. Whale Hunter (Blue Flag)
    if (creator.diamonds > 10000 && creator.liveHours < 10) {
        return "💎 EFICIENCIA ALTA: Gana mucho en poco tiempo. Sugerencia: Si transmite 1 hora más, podría duplicar sus ingresos.";
    }
    // 5. Stable (Grey Flag)
    return "✅ DESEMPEÑO ESTABLE: Mantener el ritmo actual. Sugerencia: Probar nuevas dinámicas para romper la rutina.";
};
const getConsistencyScore = (creator)=>{
    // Simple consistency score 0-100 based on valid days vs total days available (capped at 15 for calculation)
    const targetDays = Math.min(creator.daysSinceJoin, 15);
    if (targetDays === 0) return 100;
    return Math.round(creator.validDays / targetDays * 100);
};
}),
"[project]/nexus-dashboard/store/useCreatorStore.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useCreatorStore",
    ()=>useCreatorStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/zustand/esm/react.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/nexus-dashboard/node_modules/zustand/esm/middleware.mjs [app-ssr] (ecmascript)");
;
;
const useCreatorStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        creators: [],
        lastUpdated: null,
        loadContacts: async ()=>{
            try {
                const response = await fetch('/api/contacts');
                const contacts = await response.json();
                set((state)=>({
                        creators: state.creators.map((c)=>({
                                ...c,
                                whatsapp: contacts[c.creatorId] || c.whatsapp
                            }))
                    }));
            } catch (e) {
                console.error("Failed to load contacts", e);
            }
        },
        setCreators: (newCreators)=>{
            const previousCreators = get().creators;
            // Calculate comparison with previous data (yesterday) AND PERSERVE DATA (WhatsApp)
            const enhancedCreators = newCreators.map((nc)=>{
                const prev = previousCreators.find((pc)=>pc.creatorId === nc.creatorId);
                if (prev) {
                    return {
                        ...nc,
                        // Persist Contact Info (First from memory, verify with API later if needed)
                        whatsapp: prev.whatsapp,
                        phoneCode: prev.phoneCode,
                        // Persist Avatar if missing in new data (unlikely if synced)
                        avatar: nc.avatar || prev.avatar,
                        // Calculate Deltas
                        dailyDiamondsChange: nc.diamonds - prev.diamonds,
                        dailyLiveHoursChange: nc.liveHours - prev.liveHours,
                        dailyValidDaysChange: nc.validDays - prev.validDays
                    };
                }
                return nc; // New creator or no history
            });
            set({
                creators: enhancedCreators,
                lastUpdated: new Date()
            });
            get().loadContacts(); // Refresh from DB just in case
        },
        updateCreator: async (creatorId, updates)=>{
            // Optimistic Update
            set((state)=>({
                    creators: state.creators.map((c)=>c.creatorId === creatorId ? {
                            ...c,
                            ...updates
                        } : c)
                }));
            // Persist to File if whatsapp changed
            if (updates.whatsapp) {
                try {
                    await fetch('/api/contacts', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            creatorId,
                            whatsapp: updates.whatsapp
                        })
                    });
                } catch (e) {
                    console.error("Failed to save contact to file", e);
                }
            }
        }
    }), {
    name: 'nexus-storage',
    storage: (0, __TURBOPACK__imported__module__$5b$project$5d2f$nexus$2d$dashboard$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createJSONStorage"])(()=>localStorage)
}));
}),
];

//# sourceMappingURL=nexus-dashboard_11364550._.js.map