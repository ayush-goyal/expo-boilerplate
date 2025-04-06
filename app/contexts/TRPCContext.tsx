import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createTRPCClient, httpLink } from "@trpc/client";
import { PropsWithChildren, useState } from "react";

import Config from "@/config";
import { useAuth } from "@/contexts/AuthContext";
import { AppRouter, TRPCProvider } from "@/libs/trpc";

// Create a new persister instance
const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: "TRPC_QUERY_CACHE",
  throttleTime: 2000,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 72 hours
      gcTime: 1000 * 60 * 60 * 72,
      // Consider data fresh for 30 minutes
      staleTime: 1000 * 60 * 30,
      // Retry failed queries 3 times
      retry: 3,
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Refetch on reconnect
      refetchOnReconnect: true,
    },
  },
});

export const TrpcProvider = (props: PropsWithChildren<{}>) => {
  const { session } = useAuth();

  // Create the tRPC client
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpLink({
          url: Config.API_URL + "/trpc",
          headers() {
            if (session?.access_token) {
              return {
                Authorization: `Bearer ${session.access_token}`,
              };
            }
            return {};
          },
        }),
      ],
    })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: asyncStoragePersister,
      }}
    >
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </PersistQueryClientProvider>
  );
};
