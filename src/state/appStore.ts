import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupplementAnalysis } from "../api/supplement-backend";

// User tier levels
export type UserTier = "guest" | "free" | "premium";

export interface ScanRecord {
  id: string;
  timestamp: number;
  imageUri: string;
  analysis: SupplementAnalysis;
  score?: number; // Scoring system for supplements (0-100)
}

export interface FavoriteIngredient {
  id: string;
  name: string;
  addedAt: number;
}

export interface Stack {
  id: string;
  name: string;
  supplements: string[]; // supplement IDs or names
  reminders: StackReminder[];
  aiAnalysis?: {
    compatibility: number; // 0-100
    warnings: string[];
    recommendations: string[];
  };
}

export interface StackReminder {
  supplementName: string;
  time: string; // HH:MM format
  days: number[]; // 0-6 (Sunday-Saturday)
  enabled: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  tier: UserTier;
  registeredAt?: number;
  subscriptionExpiresAt?: number;
}

interface AppState {
  user: UserProfile;
  scans: ScanRecord[];
  favorites: FavoriteIngredient[];
  stacks: Stack[];
  
  // User actions
  setUserTier: (tier: UserTier) => void;
  registerUser: (email: string, name: string) => void;
  subscribeToPremium: () => void;
  
  // Scan actions
  addScan: (scan: ScanRecord) => void;
  canAccessDetailedAnalysis: () => boolean;
  
  // Favorites (free+ users)
  addFavorite: (ingredient: FavoriteIngredient) => void;
  removeFavorite: (id: string) => void;
  canAccessFavorites: () => boolean;
  
  // Stacks (premium only)
  addStack: (stack: Stack) => void;
  updateStack: (id: string, stack: Partial<Stack>) => void;
  removeStack: (id: string) => void;
  canAccessStacks: () => boolean;
  
  // Social features (premium only)
  canPostToFeed: () => boolean;
  canShareViaSMS: () => boolean;
  
  // Database access (premium only)
  canAccessFullDatabase: () => boolean;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: Date.now().toString(),
        name: "Гост",
        tier: "guest",
      },
      scans: [],
      favorites: [],
      stacks: [],

      // User tier management
      setUserTier: (tier) => {
        set((state) => ({
          user: { ...state.user, tier },
        }));
      },

      registerUser: (email, name) => {
        set((state) => ({
          user: {
            ...state.user,
            email,
            name,
            tier: "free",
            registeredAt: Date.now(),
          },
        }));
      },

      subscribeToPremium: () => {
        const now = Date.now();
        const expiresAt = now + 30 * 24 * 60 * 60 * 1000; // 30 days
        
        set((state) => ({
          user: {
            ...state.user,
            tier: "premium",
            subscriptionExpiresAt: expiresAt,
          },
        }));
      },

      // Scan management
      addScan: (scan) => {
        set((state) => ({
          scans: [scan, ...state.scans],
        }));
      },

      canAccessDetailedAnalysis: () => {
        const tier = get().user.tier;
        return tier === "free" || tier === "premium";
      },

      // Favorites (free+ only)
      addFavorite: (ingredient) => {
        const state = get();
        if (!state.canAccessFavorites()) return;
        
        set((state) => ({
          favorites: [...state.favorites, ingredient],
        }));
      },

      removeFavorite: (id) => {
        set((state) => ({
          favorites: state.favorites.filter((fav) => fav.id !== id),
        }));
      },

      canAccessFavorites: () => {
        const tier = get().user.tier;
        return tier === "free" || tier === "premium";
      },

      // Stacks (premium only)
      addStack: (stack) => {
        const state = get();
        if (!state.canAccessStacks()) return;
        
        set((state) => ({
          stacks: [...state.stacks, stack],
        }));
      },

      updateStack: (id, updates) => {
        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === id ? { ...stack, ...updates } : stack
          ),
        }));
      },

      removeStack: (id) => {
        set((state) => ({
          stacks: state.stacks.filter((stack) => stack.id !== id),
        }));
      },

      canAccessStacks: () => {
        return get().user.tier === "premium";
      },

      // Social features
      canPostToFeed: () => {
        return get().user.tier === "premium";
      },

      canShareViaSMS: () => {
        return get().user.tier === "premium";
      },

      // Database access
      canAccessFullDatabase: () => {
        return get().user.tier === "premium";
      },
    }),
    {
      name: "supplement-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
