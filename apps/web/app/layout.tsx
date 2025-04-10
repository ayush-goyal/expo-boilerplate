import "@/styles/globals.css";

import { type Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { SentryProvider } from "@/components/providers/SentryProvider";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "Next App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          <TRPCReactProvider>
            <SentryProvider>
              <PostHogProvider>{children}</PostHogProvider>
            </SentryProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
