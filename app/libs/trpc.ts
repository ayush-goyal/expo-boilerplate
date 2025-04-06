import { TRPCClientError } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

export const API_BASE_URL = __DEV__ ? "http://localhost:3000" : "https://api.getplateful.app";

// Replace 'any' with your actual AppRouter type when available
export type AppRouter = any;

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
