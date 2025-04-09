import { TRPCClientError } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";

// Replace 'any' with your actual AppRouter type when available
export type AppRouter = any;

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<AppRouter>();

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
  return cause instanceof TRPCClientError;
}
