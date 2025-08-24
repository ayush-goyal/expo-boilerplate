import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@acme/auth";

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-[90vh] w-full flex-1 items-center justify-center">{children}</div>
  );
}
