"use client";

import { SessionProvider } from "next-auth/react";
import { ToasterProvider } from "./providers";

export default function ProvidersLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      {children}
      <ToasterProvider />
    </SessionProvider>
  );
}
