import { Session } from "better-auth/types";
import { deleteItemAsync, getItem, setItem } from "expo-secure-store";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
type User = {
  username?: string | null | undefined;
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
};
type AuthStore = {
  isFirstTime: boolean;
  setIsFirstTime: (isFirstTime: boolean) => void;
  session: Session | null;
  setSession: (session: Session | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

export const authStore = create(
  persist<AuthStore>(
    (set) => ({
      isFirstTime: true,
      setIsFirstTime: (isFirstTime) => set({ isFirstTime }),
      session: null,
      setSession: (session) => set({ session }),
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => ({
        setItem,
        getItem,
        removeItem: deleteItemAsync,
      })),
    }
  )
);
