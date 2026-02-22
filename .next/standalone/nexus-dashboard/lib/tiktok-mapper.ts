import { Creator } from '@/types';

export function mapTiKTokAnalysisToCreators(analysisData: any): Creator[] {
    if (!analysisData?.data?.anchorAnalysisDataInfos) {
        console.error("Invalid Analysis Data format");
        return [];
    }

    return analysisData.data.anchorAnalysisDataInfos.map((item: any) => {
        const info = item.anchorBaseInfo;
        const user = info?.user_base_info || item.user_base_info; // Fallback

        if (!user) return null; // Skip if no user

        // Helper to safely get current value or 0
        const getVal = (metric: any) => metric?.current || 0;

        // --- METRICS CALCULATION ---
        // We now have "last" injected by scraper for previous month total

        const diamonds = getVal(item.income);
        const lastDiamonds = item.income?.last || 0;

        // Growth: ((Current - Last) / Last) * 100
        const calcGrowth = (current: number, last: number) => {
            if (last === 0) return 100; // New or infinite growth
            return ((current - last) / last) * 100;
        };

        const liveHoursSec = getVal(item.liveDuration);
        const liveHours = parseFloat((liveHoursSec / 3600).toFixed(2));
        const lastLiveHours = parseFloat(((item.liveDuration?.last || 0) / 3600).toFixed(2));

        const validDays = getVal(item.validDay);
        const lastValidDays = item.validDay?.last || 0;

        const newFollowers = getVal(item.fanRise);
        const lastNewFollowers = item.fanRise?.last || 0;

        const liveSessions = getVal(item.liveCount);
        const lastLiveSessions = item.liveCount?.last || 0;

        return {
            period: "Live Sync",
            creatorId: user.user_id || user.CreatorID,
            username: user.nickname || "Unknown",
            avatar: user.avatar || user.avatar_url,
            group: "N/A",
            agent: "N/A",
            joinTime: item.joinedTime ? new Date(Number(item.joinedTime) * 1000).toISOString() : new Date().toISOString(),
            daysSinceJoin: item.daysSinceJoin || 0,

            // Metrics
            diamonds,
            liveHours,
            validDays,
            newFollowers,
            liveSessions,

            // Last Month (Growth Baseline)
            lastMonthDiamonds: lastDiamonds,
            lastMonthLiveHours: lastLiveHours,
            lastMonthValidDays: lastValidDays,
            lastMonthNewFollowers: lastNewFollowers,
            lastMonthLiveSessions: lastLiveSessions,

            // Achievements
            diamondsAchieved: 0,
            liveHoursAchieved: 0,
            validDaysAchieved: 0,
            newFollowersAchieved: 0,
            liveSessionsAchieved: 0,

            // Growth (Calculated Locally)
            // 1. Total Growth (Goal Progress): (Current - Last) / Last
            diamondsGrowth: calcGrowth(diamonds, lastDiamonds),

            // 2. Daily Trend (Pace): (CurrentDailyAvg - LastMonthDailyAvg) / LastMonthDailyAvg
            // This approximates "Are we earning faster than last month?"
            // Note: This relies on "days elapsed" in current month.
            diamondsDailyTrend: (() => {
                const now = new Date();
                const daysElapsed = Math.max(1, now.getDate()); // 1 to 31
                const currentDaily = diamonds / daysElapsed;

                // Last month average (Approx 30 days)
                const lastDaily = lastDiamonds / 30;

                return calcGrowth(currentDaily, lastDaily);
            })(),

            liveHoursGrowth: calcGrowth(liveHours, lastLiveHours),
            validDaysGrowth: calcGrowth(validDays, lastValidDays),
            newFollowersGrowth: calcGrowth(newFollowers, lastNewFollowers),
            liveSessionsGrowth: calcGrowth(liveSessions, lastLiveSessions),

            // Interactive
            battles: getVal(item.pkCount),
            battleDiamonds: getVal(item.pkIncome),
            newLiveCreators: 0,
            multiGuestDiamonds: getVal(item.multiGuestIncome),
            multiGuestHostDiamonds: getVal(item.multiGuestHostDiamonds),
            multiGuestGuestDiamonds: getVal(item.multiGuestGuestDiamonds),

            // Meta
            baseDiamondsBeforeJoin: 0,
            graduationStatus: "Active",

            whatsapp: "",
            phoneCode: ""
        };
    }).filter(Boolean); // Remove nulls
}
