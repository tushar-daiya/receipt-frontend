import { create } from "zustand/react";

interface SigninStore {
  email: string | null;
  setEmail: (email: string | null) => void;
}

export const useSigninStore = create<SigninStore>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
}));
