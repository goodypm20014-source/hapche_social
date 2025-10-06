import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SupplementAnalysis } from "../api/supplement-backend";

export interface ScanRecord {
  id: string;
  timestamp: number;
  imageUri: string;
  analysis: SupplementAnalysis;
}

export interface UserProfile {
  name: string;
  isPro: boolean;
  scansThisMonth: number;
  monthStartDate: number; // timestamp
  totalScans: number;
}

interface AppState {
  user: UserProfile;
  scans: ScanRecord[];
  
  // Actions
  addScan: (scan: ScanRecord) => void;
  incrementScanCount: () => void;
  upgradeToPro: () => void;
  canScan: () => boolean;
  resetMonthlyScans: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        name: "Потребител",
        isPro: false,
        scansThisMonth: 0,
        monthStartDate: Date.now(),
        totalScans: 0,
      },
      scans: [],

      addScan: (scan) => {
        set((state) => ({
          scans: [scan, ...state.scans],
        }));
      },

      incrementScanCount: () => {
        const now = Date.now();
        const state = get();
        const monthInMs = 30 * 24 * 60 * 60 * 1000;
        
        // Reset if a month has passed
        if (now - state.user.monthStartDate > monthInMs) {
          set((state) => ({
            user: {
              ...state.user,
              scansThisMonth: 1,
              monthStartDate: now,
              totalScans: state.user.totalScans + 1,
            },
          }));
        } else {
          set((state) => ({
            user: {
              ...state.user,
              scansThisMonth: state.user.scansThisMonth + 1,
              totalScans: state.user.totalScans + 1,
            },
          }));
        }
      },

      upgradeToPro: () => {
        set((state) => ({
          user: {
            ...state.user,
            isPro: true,
          },
        }));
      },

      canScan: () => {
        const state = get();
        if (state.user.isPro) return true;
        return state.user.scansThisMonth < 5;
      },

      resetMonthlyScans: () => {
        set((state) => ({
          user: {
            ...state.user,
            scansThisMonth: 0,
            monthStartDate: Date.now(),
          },
        }));
      },
    }),
    {
      name: "supplement-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
