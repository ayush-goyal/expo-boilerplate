import { type NextRequest } from "next/server";
import { fetchRequestHandler, type FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@acme/api";
import { env } from "@/env";

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    // Use the adapter function
    createContext: () => createTRPCContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export { handler as GET, handler as POST };
