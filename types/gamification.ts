export interface Mission {
    id: string;
    title: string;
    description: string;
    icon: string;
    targetType: 'diamonds' | 'hours' | 'days';
    targetValue: number;
    reward: string;
    xp: number;
    color: string;
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    unlockLevel?: number; // Keep for backward compatibility or remove if replacing logic
    targetType?: 'diamonds' | 'hours' | 'days' | 'level';
    targetValue?: number;
    assignee?: 'all' | string; // 'all' or creatorId
    image?: string;
    claimedBy?: string[]; // Array of creatorIds who claimed it
    stock?: number; // How many available? Default 1 for "first one wins"
    maxStock?: number;
}

export interface UserProgress {
    creatorId: string;
    xp: number;
    level: number;
    completedMissions: string[];
    claimedRewards: string[];
}

export interface League {
    id: string;
    name: string;
    minDiamonds: number;
    icon: React.ReactNode;
    color: string;
    borderColor: string;
    bgGradient: string;
}
