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

export interface Message {
  id: string;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  content: string;
  timestamp: number;
  read: boolean;
  type: "message" | "supplement_share" | "stack_share";
  attachedData?: any; // supplement or stack data
}

export interface Notification {
  id: string;
  type: "friend_request" | "friend_accept" | "like" | "comment" | "share" | "new_product";
  fromUserId?: string;
  fromUserName?: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionData?: any;
}

export interface Friend {
  id: string;
  userId: string;
  name: string;
  status: "pending" | "accepted" | "blocked";
  since: number;
}

export interface PublicProfileCard {
  userId: string;
  name: string;
  bio?: string;
  interests: string[]; // ["Фитнес", "Здраве", "Вегетарианство"]
  isPublic: boolean;
  shareableInfo: {
    favoriteSupplements: boolean;
    stacks: boolean;
    goals: boolean;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  tier: UserTier;
  registeredAt?: number;
  subscriptionExpiresAt?: number;
  hasCompletedOnboarding: boolean;
  profileCard: PublicProfileCard;
}

interface AppState {
  user: UserProfile;
  scans: ScanRecord[];
  favorites: FavoriteIngredient[];
  stacks: Stack[];
  messages: Message[];
  notifications: Notification[];
  friends: Friend[];
  
  // User actions
  completeOnboarding: () => void;
  setUserTier: (tier: UserTier) => void;
  registerUser: (email: string, name: string) => void;
  subscribeToPremium: () => void;
  updateProfileCard: (card: Partial<PublicProfileCard>) => void;
  
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
  
  // Social features
  canPostToFeed: () => boolean;
  canShareViaSMS: () => boolean;
  canSendMessages: () => boolean;
  
  // Messages & Notifications
  addMessage: (message: Message) => void;
  markMessageAsRead: (id: string) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  getUnreadMessagesCount: () => number;
  getUnreadNotificationsCount: () => number;
  
  // Friends
  sendFriendRequest: (userId: string, userName: string) => void;
  acceptFriendRequest: (friendId: string) => void;
  removeFriend: (friendId: string) => void;
  getFriends: () => Friend[];
  
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
        hasCompletedOnboarding: false,
        profileCard: {
          userId: Date.now().toString(),
          name: "Гост",
          interests: [],
          isPublic: false,
          shareableInfo: {
            favoriteSupplements: false,
            stacks: false,
            goals: false,
          },
        },
      },
      scans: [],
      favorites: [],
      stacks: [],
      messages: [],
      notifications: [],
      friends: [],

      // User tier management
      completeOnboarding: () => {
        set((state) => ({
          user: { ...state.user, hasCompletedOnboarding: true },
        }));
      },

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

      // Profile card
      updateProfileCard: (card) => {
        set((state) => ({
          user: {
            ...state.user,
            profileCard: { ...state.user.profileCard, ...card },
          },
        }));
      },

      // Messages & Notifications
      canSendMessages: () => {
        return get().user.tier !== "guest";
      },

      addMessage: (message) => {
        set((state) => ({
          messages: [message, ...state.messages],
        }));
      },

      markMessageAsRead: (id) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, read: true } : msg
          ),
        }));
      },

      addNotification: (notification) => {
        set((state) => ({
          notifications: [notification, ...state.notifications],
        }));
      },

      markNotificationAsRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((notif) =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
        }));
      },

      getUnreadMessagesCount: () => {
        return get().messages.filter((msg) => !msg.read).length;
      },

      getUnreadNotificationsCount: () => {
        return get().notifications.filter((notif) => !notif.read).length;
      },

      // Friends
      sendFriendRequest: (userId, userName) => {
        const newFriend: Friend = {
          id: Date.now().toString(),
          userId,
          name: userName,
          status: "pending",
          since: Date.now(),
        };
        set((state) => ({
          friends: [...state.friends, newFriend],
        }));
      },

      acceptFriendRequest: (friendId) => {
        set((state) => ({
          friends: state.friends.map((friend) =>
            friend.id === friendId ? { ...friend, status: "accepted" } : friend
          ),
        }));
      },

      removeFriend: (friendId) => {
        set((state) => ({
          friends: state.friends.filter((friend) => friend.id !== friendId),
        }));
      },

      getFriends: () => {
        return get().friends.filter((f) => f.status === "accepted");
      },
    }),
    {
      name: "supplement-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
