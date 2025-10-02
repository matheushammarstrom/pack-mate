import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthSessionProvider } from '@/components/providers/session-provider';
import { TRPCProvider } from '@/components/providers/trpc-provider';
import { ConditionalHeader } from '@/components/conditional-header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Pack Mate - Travel Packing List Generator',
  description: 'Create and manage your travel packing lists with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <TRPCProvider>
            <ConditionalHeader />
            {children}
          </TRPCProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
