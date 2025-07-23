import { create } from "zustand/react";

interface SigninStore {
  email: string | null;
  setEmail: (email: string | null) => void;
  isInOtpFlow: boolean;
  setIsInOtpFlow: (isInOtpFlow: boolean) => void;
}

export const useSigninStore = create<SigninStore>((set) => ({
  email: null,
  setEmail: (email) => set({ email }),
  isInOtpFlow: false,
  setIsInOtpFlow: (isInOtpFlow) => set({ isInOtpFlow }),
}));
