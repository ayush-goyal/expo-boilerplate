"use client";

interface SentryProviderProps {
  children: React.ReactNode;
}

export function SentryProvider({ children }: SentryProviderProps) {
  // TODO: Setup firebase and identify user

  return children;
}
