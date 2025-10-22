"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import React from 'react';
import { SessionProvider } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dashboard Project',
  description: 'Admin Dashboard for Visits, Inquiries, and Listings',
};

export default function RootLayout({ children, session }: { children: React.ReactNode, session?: any }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
