'use client';

import { ProtectedRoute } from '@/components/auth/protected-route';
import { TripList } from '@/components/trip-list';

function AuthenticatedContent() {
  return <TripList />;
}

export default function Home() {
  return (
    <ProtectedRoute>
      <AuthenticatedContent />
    </ProtectedRoute>
  );
}
