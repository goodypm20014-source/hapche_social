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

export interface StackComment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: number;
}

export interface Stack {
  id: string;
  name: string;
  description?: string;
  supplements: string[]; // supplement IDs or names
  reminders: StackReminder[];
  aiAnalysis?: {
    compatibility: number; // 0-100
    warnings: string[];
    recommendations: string[];
  };
  // Social features
  isPublic: boolean;
  createdBy: string; // userId
  createdByName: string;
  likes: string[]; // array of userIds who liked
  comments: StackComment[];
  followers: string[]; // array of userIds following this stack
  createdAt: number;
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

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string; // ionicon name
  earnedAt: number;
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
  // Social features
  rating: number; // 0-5 user reputation score
  badges: Badge[];
  following: string[]; // userIds being followed
  followers: string[]; // userIds following this user
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
  toggleStackPublic: (stackId: string) => void;
  likeStack: (stackId: string) => void;
  unlikeStack: (stackId: string) => void;
  addStackComment: (stackId: string, content: string) => void;
  followStack: (stackId: string) => void;
  unfollowStack: (stackId: string) => void;
  
  // Social features
  canPostToFeed: () => boolean;
  canShareViaSMS: () => boolean;
  canSendMessages: () => boolean;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  isFollowingUser: (userId: string) => boolean;
  
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
  
  // Dev helpers
  addMockData: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: {
        id: Date.now().toString(),
        name: "Гост",
        tier: "guest",
        hasCompletedOnboarding: false,
        rating: 0,
        badges: [],
        following: [],
        followers: [],
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

      // Stack social features
      toggleStackPublic: (stackId) => {
        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === stackId ? { ...stack, isPublic: !stack.isPublic } : stack
          ),
        }));
      },

      likeStack: (stackId) => {
        const userId = get().user.id;
        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === stackId && !stack.likes.includes(userId)
              ? { ...stack, likes: [...stack.likes, userId] }
              : stack
          ),
        }));
      },

      unlikeStack: (stackId) => {
        const userId = get().user.id;
        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === stackId
              ? { ...stack, likes: stack.likes.filter((id) => id !== userId) }
              : stack
          ),
        }));
      },

      addStackComment: (stackId, content) => {
        const user = get().user;
        const comment: StackComment = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          content,
          timestamp: Date.now(),
        };

        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === stackId
              ? { ...stack, comments: [...stack.comments, comment] }
              : stack
          ),
        }));
      },

      followStack: (stackId) => {
        const userId = get().user.id;
        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === stackId && !stack.followers.includes(userId)
              ? { ...stack, followers: [...stack.followers, userId] }
              : stack
          ),
        }));
      },

      unfollowStack: (stackId) => {
        const userId = get().user.id;
        set((state) => ({
          stacks: state.stacks.map((stack) =>
            stack.id === stackId
              ? { ...stack, followers: stack.followers.filter((id) => id !== userId) }
              : stack
          ),
        }));
      },

      // User following
      followUser: (userId) => {
        set((state) => ({
          user: {
            ...state.user,
            following: state.user.following.includes(userId)
              ? state.user.following
              : [...state.user.following, userId],
          },
        }));
      },

      unfollowUser: (userId) => {
        set((state) => ({
          user: {
            ...state.user,
            following: state.user.following.filter((id) => id !== userId),
          },
        }));
      },

      isFollowingUser: (userId) => {
        return get().user.following.includes(userId);
      },

      // Dev helper to add mock data for testing
      addMockData: () => {
        const userId = get().user.id;
        const userName = get().user.name;

        // Add mock badges
        const mockBadges: Badge[] = [
          {
            id: "1",
            name: "Early Adopter",
            description: "Един от първите потребители",
            icon: "rocket",
            earnedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
          {
            id: "2",
            name: "Stack Master",
            description: "Създал 5+ стака",
            icon: "trophy",
            earnedAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
          },
          {
            id: "3",
            name: "Helpful",
            description: "Получени 10+ харесвания",
            icon: "thumbs-up",
            earnedAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
          },
        ];

        // Create mock stacks
        const mockStacks: Stack[] = [
          {
            id: "mock-1",
            name: "Сутрешна рутина",
            description: "Моите основни добавки за започване на деня с енергия и фокус",
            supplements: ["Vitamin D3", "Omega-3", "Magnesium", "B-Complex"],
            reminders: [
              {
                supplementName: "Vitamin D3",
                time: "08:00",
                days: [1, 2, 3, 4, 5],
                enabled: true,
              },
            ],
            aiAnalysis: {
              compatibility: 92,
              warnings: [],
              recommendations: [
                "Отлична комбинация за имунна система",
                "D3 се усвоява по-добре с мазнини (Omega-3)",
              ],
            },
            isPublic: true,
            createdBy: userId,
            createdByName: userName,
            likes: ["user2", "user3", "user5"],
            comments: [
              {
                id: "c1",
                userId: "user2",
                userName: "Мария Петрова",
                content: "Супер комбинация! Ползвам същото от месец и се чувствам много по-добре.",
                timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
              },
            ],
            followers: ["user2", "user4"],
            createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
          },
          {
            id: "mock-2",
            name: "Pre-workout",
            description: "За максимална енергия и издръжливост в залата",
            supplements: ["Creatine", "Beta-Alanine", "Citrulline", "Caffeine"],
            reminders: [],
            aiAnalysis: {
              compatibility: 88,
              warnings: ["Кофеинът може да причини безсъние ако се взема след 16:00ч"],
              recommendations: [
                "Вземете 30-45 мин преди тренировка",
                "Добавете L-Theanine за баланс на кофеина",
              ],
            },
            isPublic: true,
            createdBy: userId,
            createdByName: userName,
            likes: ["user1", "user3", "user4", "user6"],
            comments: [
              {
                id: "c2",
                userId: "user3",
                userName: "Георги Иванов",
                content: "Пробвал съм подобна комбинация. Beta-alanine наистина помага!",
                timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
              },
              {
                id: "c3",
                userId: "user1",
                userName: "Иван Димитров",
                content: "Колко грама креатин взимаш на ден?",
                timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
              },
            ],
            followers: ["user1", "user3", "user5"],
            createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
          },
          {
            id: "mock-3",
            name: "Вечерна регенерация",
            description: "За качествен сън и възстановяване на мускулите",
            supplements: ["ZMA", "Ashwagandha", "L-Theanine"],
            reminders: [
              {
                supplementName: "ZMA",
                time: "22:00",
                days: [0, 1, 2, 3, 4, 5, 6],
                enabled: true,
              },
            ],
            aiAnalysis: {
              compatibility: 95,
              warnings: [],
              recommendations: [
                "Перфектна комбинация за сън",
                "ZMA подобрява качеството на дълбокия сън",
              ],
            },
            isPublic: false,
            createdBy: userId,
            createdByName: userName,
            likes: [],
            comments: [],
            followers: [],
            createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
          },
        ];

        // Add mock favorites
        const mockFavorites: FavoriteIngredient[] = [
          { id: "fav-1", name: "Creatine Monohydrate", addedAt: Date.now() - 60 * 24 * 60 * 60 * 1000 },
          { id: "fav-2", name: "Omega-3 Fish Oil", addedAt: Date.now() - 50 * 24 * 60 * 60 * 1000 },
          { id: "fav-3", name: "Vitamin D3", addedAt: Date.now() - 40 * 24 * 60 * 60 * 1000 },
        ];

        set((state) => ({
          user: {
            ...state.user,
            rating: 4.5,
            badges: mockBadges,
          },
          stacks: [...state.stacks, ...mockStacks],
          favorites: [...state.favorites, ...mockFavorites],
        }));
      },
    }),
    {
      name: "supplement-app-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
