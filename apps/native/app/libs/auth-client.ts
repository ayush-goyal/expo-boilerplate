import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import Config from "@/config";

export const authClient = createAuthClient({
  baseURL: Config.API_URL,
  basePath: "/api/auth",
  plugins: [
    expoClient({
      storage: SecureStore,
    }),
    phoneNumberClient(),
  ],
});
