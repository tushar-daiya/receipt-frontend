import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  baseURL: "http://10.70.175.178:4000", // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "receiptdapp",
      storagePrefix: "receipt",
      storage: SecureStore,
    }),
    emailOTPClient(),
    usernameClient(),
  ],
});
