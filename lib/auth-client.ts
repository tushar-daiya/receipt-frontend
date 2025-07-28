import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "https://receipt-backend-hqjf.onrender.com", // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "receipt",
      storagePrefix: "receipt",
      storage: SecureStore,
    }),
    emailOTPClient(),
    usernameClient(),
  ],
});
