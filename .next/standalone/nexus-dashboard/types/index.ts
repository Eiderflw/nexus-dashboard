export interface Creator {
    period: string; // Periodo de datos
    creatorId: string; // ID del creador
    username: string; // Nombre de usuario del creador
    group: string; // Grupo
    agent: string; // Agente
    joinTime: string; // Hora de incorporación
    daysSinceJoin: number; // Días desde la incorporación
    avatar?: string; // URL del avatar (TikTok)

    // Current Period Metrics
    diamonds: number;
    diamondsGrowth: number; // vs Last Month Total (Goal Progress)
    diamondsDailyTrend?: number; // vs Last Month Daily Avg (Trend)

    liveHours: number;
    liveHoursGrowth: number;

    validDays: number;
    validDaysGrowth: number;

    newFollowers: number;
    newFollowersGrowth: number;

    liveSessions: number;
    liveSessionsGrowth: number;

    // Last Month Metrics (Baseline)
    lastMonthDiamonds: number;
    lastMonthLiveHours: number;
    lastMonthValidDays: number;
    lastMonthNewFollowers: number;
    lastMonthLiveSessions: number;

    // Achievement Percentages
    diamondsAchieved: number;
    liveHoursAchieved: number;
    validDaysAchieved: number;
    newFollowersAchieved: number;
    liveSessionsAchieved: number;

    // Interactive/Battle Metrics
    battles: number; // Partidas
    battleDiamonds: number; // Diamantes de partidas
    newLiveCreators: number; // Nuevos creadores LIVE
    multiGuestDiamonds: number; // Diamantes del modo de varios invitados
    multiGuestHostDiamonds: number; // Diamantes de varios invitados (como anfitrión)
    multiGuestGuestDiamonds: number; // Diamantes del modo de varios invitados (como invitado)

    // Meta
    baseDiamondsBeforeJoin: number; // Base de Diamantes antes de unirse
    graduationStatus: string; // Estado de graduación

    // Daily Comparison (DoD)
    dailyDiamondsChange?: number;
    dailyLiveHoursChange?: number;
    dailyValidDaysChange?: number;

    // Contact Info (Persisted)
    whatsapp?: string;
    phoneCode?: string;
}

export type SortField = keyof Creator;
export type SortOrder = 'asc' | 'desc';
