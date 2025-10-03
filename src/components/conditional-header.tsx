'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { AppHeader } from './app-header';

export function ConditionalHeader() {
  const pathname = usePathname();
  const { status } = useSession();

  const hideHeaderOnRoutes = ['/auth/signin', '/auth/verify-request'];

  if (hideHeaderOnRoutes.includes(pathname) || status !== 'authenticated') {
    return null;
  }

  return <AppHeader />;
}
