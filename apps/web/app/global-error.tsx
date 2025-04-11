"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { XCircle } from "lucide-react";
import { ThemeProvider } from "next-themes";

import { Button } from "@/components/ui/button";

import "@/styles/globals.css";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <head />
      <body>
        <ThemeProvider attribute="class">
          <div className="flex min-h-screen flex-col items-center justify-center space-y-4 p-12">
            <div className="space-y-3 text-center">
              <div className="inline-flex items-center rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-sm font-medium text-destructive">
                <XCircle className="mr-2 h-4 w-4" />
                Error
              </div>
              <h1 className="mt-4 text-4xl font-bold tracking-tight">Oops! Something went wrong</h1>
              <p className="mx-auto max-w-[500px] text-lg text-muted-foreground">
                An unexpected error occurred. We've been notified and are looking into it.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && (
              <div className="mt-8 w-full max-w-[700px]">
                <div className="overflow-auto rounded-lg border bg-muted/50 p-4 font-mono text-sm">
                  <div className="mb-2 text-destructive">{error.message}</div>
                  <div className="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
                    {error.stack}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="h-10 px-6"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
