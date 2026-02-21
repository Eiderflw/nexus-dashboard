import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Creator } from '@/types';

interface CreatorStore {
    creators: Creator[];
    setCreators: (newCreators: Creator[]) => void;
    updateCreator: (creatorId: string, updates: Partial<Creator>) => void;
    lastUpdated: Date | null;
    loadContacts: () => Promise<void>; // New action to load contacts
}

export const useCreatorStore = create<CreatorStore>()(
    persist(
        (set, get) => ({
            creators: [],
            lastUpdated: null,
            loadContacts: async () => {
                try {
                    const response = await fetch('/api/contacts');
                    const contacts = await response.json();

                    set((state) => ({
                        creators: state.creators.map(c => ({
                            ...c,
                            whatsapp: contacts[c.creatorId] || c.whatsapp
                        }))
                    }));
                } catch (e) {
                    console.error("Failed to load contacts", e);
                }
            },
            setCreators: (newCreators) => {
                const previousCreators = get().creators;

                // Calculate comparison with previous data (yesterday) AND PERSERVE DATA (WhatsApp)
                const enhancedCreators = newCreators.map(nc => {
                    const prev = previousCreators.find(pc => pc.creatorId === nc.creatorId);
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

                set({ creators: enhancedCreators, lastUpdated: new Date() });
                get().loadContacts(); // Refresh from DB just in case
            },
            updateCreator: async (creatorId, updates) => {
                // Optimistic Update
                set((state) => ({
                    creators: state.creators.map((c) =>
                        c.creatorId === creatorId ? { ...c, ...updates } : c
                    ),
                }));

                // Persist to File if whatsapp changed
                if (updates.whatsapp) {
                    try {
                        await fetch('/api/contacts', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ creatorId, whatsapp: updates.whatsapp })
                        });
                    } catch (e) {
                        console.error("Failed to save contact to file", e);
                    }
                }
            },
        }),
        {
            name: 'nexus-storage', // unique name
            storage: createJSONStorage(() => localStorage),
        }
    )
);
