import { Creator } from '@/types';

export const getTopCreators = (creators: Creator[], limit: number = 10): Creator[] => {
    return [...creators].sort((a, b) => b.diamonds - a.diamonds).slice(0, limit);
};

export const getRisingStars = (creators: Creator[]): Creator[] => {
    // New creators (< 30 days) with high diamonds (> 1000 or top 20% percentile logic if we had it)
    // For MVP: < 45 days tenure and > 500 diamonds
    return creators.filter(c => c.daysSinceJoin <= 45 && c.diamonds > 500)
        .sort((a, b) => b.diamondsGrowth - a.diamondsGrowth);
};

export const getAtRiskCreators = (creators: Creator[]): Creator[] => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedProgress = currentDay / daysInMonth; // e.g. 13/30 = 0.43 (43%)

    // Logic: At Risk if 'Month Progress' (diamondsAchieved) is significantly behind 'Expected Progress'
    // OR if 'Daily Trend' (diamondsGrowth) is severely negative (-50%+) indicating a crash today.
    return creators.filter(c => {
        const isVeteran = c.daysSinceJoin > 30; // Only check people who have been here a while

        // Lagging Month Progress: They have achieved less than 80% of what they should have by now
        // e.g. Expected 43%, they have < 34%
        const isLagging = c.diamondsAchieved < (expectedProgress * 0.8);

        // Crashing Daily: Today they did much worse than same day last month
        const isCrashingDaily = c.diamondsGrowth < -0.5;

        return isVeteran && (isLagging || isCrashingDaily);
    }).sort((a, b) => a.diamondsAchieved - b.diamondsAchieved); // Sort by lowest progress first
};

export const getBattleSpecialists = (creators: Creator[]): Creator[] => {
    // High ratio of Battle diamonds to Total diamonds
    return creators.filter(c => {
        const ratio = c.battleDiamonds / (c.diamonds || 1);
        return c.diamonds > 1000 && ratio > 0.4; // > 40% income from battles
    }).sort((a, b) => b.battleDiamonds - a.battleDiamonds);
};

export const generateAiAdvice = (creator: Creator): string => {
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const expectedProgressPercent = Math.round((currentDay / daysInMonth) * 100);
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

export const getConsistencyScore = (creator: Creator): number => {
    // Simple consistency score 0-100 based on valid days vs total days available (capped at 15 for calculation)
    const targetDays = Math.min(creator.daysSinceJoin, 15);
    if (targetDays === 0) return 100;
    return Math.round((creator.validDays / targetDays) * 100);
};
