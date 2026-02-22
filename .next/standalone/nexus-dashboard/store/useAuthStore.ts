import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthStore {
    isAuthenticated: boolean;
    login: () => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            login: () => set({ isAuthenticated: true }),
            logout: () => set({ isAuthenticated: false }),
        }),
        {
            name: 'nexus-auth-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
