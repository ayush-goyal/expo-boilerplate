import { PropsWithChildren, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAuth } from "@react-native-firebase/auth";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createTRPCClient, httpLink, loggerLink } from "@trpc/client";
import SuperJSON from "superjson";

import type { AppRouter } from "@acme/api";

import Config from "@/config";
import { TRPCProvider } from "@/libs/trpc";

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

const getAuthorizationToken = async () => {
  const user = getAuth().currentUser;
  if (!user) {
    return undefined;
  }
  const firebaseToken = await user.getIdToken();
  return `Bearer ${firebaseToken}`;
};

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpLink({
      url: Config.API_URL + "/api/trpc",
      async headers() {
        return {
          Authorization: await getAuthorizationToken(),
        };
      },
      transformer: SuperJSON,
    }),
    loggerLink({
      enabled: () => __DEV__,
      colorMode: "ansi",
    }),
  ],
});

export const TrpcProvider = (props: PropsWithChildren<{}>) => {
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
