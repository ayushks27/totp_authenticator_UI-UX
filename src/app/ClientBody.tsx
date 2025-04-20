"use client";

import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AccountProvider } from "@/context/AccountContext";
import { Toaster } from "sonner";

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  // Remove any extension-added classes during hydration
  useEffect(() => {
    // This runs only on the client after hydration
    document.body.className = "antialiased";
  }, []);

  return (
    <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
      <ThemeProvider>
        <AccountProvider>
          {children}
          <Toaster position="top-right" />
        </AccountProvider>
      </ThemeProvider>
    </body>
  );
}
