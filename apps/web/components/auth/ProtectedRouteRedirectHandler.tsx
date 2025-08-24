"use client";

import { redirect, usePathname } from "next/navigation";

export function ProtectedRouteRedirectHandler() {
  const pathname = usePathname();

  return redirect(`/sign-in?redirectTo=${encodeURIComponent(pathname)}`);
}
