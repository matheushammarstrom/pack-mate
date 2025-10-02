'use client';

import { trpc } from '@/utils/trpc';
import { TripCard } from './trip-card';
import { TripDialog } from './trip-dialog';

export function TripList() {
  const { data: trips, isLoading } = trpc.trip.getAllTrips.useQuery();

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 p-8 h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="text-4xl font-bold text-white">
              Your Travel Adventures
            </h1>
            <TripDialog />
          </div>
          <p className="text-gray-400 text-lg">
            Manage your trips and packing lists with AI-powered assistance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips?.map((trip) => (
            <TripCard
              key={trip.id}
              trip={{
                id: trip.id,
                title: trip.title,
                destination: trip.destination,
                startDate: trip.startDate,
                endDate: trip.endDate,
                duration: trip.duration,
                tripType: trip.tripType,
              }}
            />
          ))}
        </div>

        {trips?.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">No trips yet</div>
            <p className="text-gray-500">
              Create your first trip to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
