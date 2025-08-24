"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

import { authClient } from "@/lib/auth-client";

interface SentryProviderProps {
  children: React.ReactNode;
}

export function SentryProvider({ children }: SentryProviderProps) {
  const { data: session } = authClient.useSession();

  // Set user context when session changes
  useEffect(() => {
    if (session?.user) {
      Sentry.setUser({
        id: session.user.id,
        email: session.user.email,
      });
    } else {
      Sentry.setUser(null);
    }
  }, [session?.user]);

  return children;
}
