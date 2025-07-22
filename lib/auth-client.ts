import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://192.168.29.225:4000", // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "receipt",
      storagePrefix: "receipt",
      storage: SecureStore,
    }),
  ],
});
