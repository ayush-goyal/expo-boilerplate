"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "trpc/react";

export default function HomePage() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.getUserCount.queryOptions());

  return (
    <main className="container h-screen">
      <div className="flex h-full flex-1 flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-bold">hello world</h1>
        <p className="text-lg">Total Users: {data}</p>
      </div>
    </main>
  );
}
