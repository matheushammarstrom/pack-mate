'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { trpc } from '@/utils/trpc';
import { signOut } from 'next-auth/react';

function AuthenticatedContent() {
  const { data: user, isLoading } = trpc.user.getUserProfile.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <AuthenticatedContent />
    </ProtectedRoute>
  );
}
