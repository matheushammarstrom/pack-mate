'use client';

import { MapPin, Calendar, Sparkles } from 'lucide-react';

type TripCardProps = {
  trip: {
    id: string;
    title: string;
    destination: string;
    startDate: string;
    endDate: string;
    duration: number;
    tripType: string;
  };
};

export function TripCard({ trip }: TripCardProps) {
  const getTripTypeLabel = (tripType: string) => {
    switch (tripType.toLowerCase()) {
      case 'business':
        return 'Business';
      case 'leisure':
        return 'Leisure';
      case 'beach':
        return 'Beach';
      default:
        return tripType;
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6 hover:bg-slate-750 transition-colors">
      <div
        className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white mb-4 bg-red-500`}
      >
        {getTripTypeLabel(trip.tripType)}
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{trip.title}</h3>

      <div className="flex items-center text-gray-400 mb-2">
        <MapPin className="w-4 h-4 mr-2" />
        <span className="text-sm">{trip.destination}</span>
      </div>

      <div className="flex items-center text-gray-400 mb-6">
        <Calendar className="w-4 h-4 mr-2" />
        <span className="text-sm">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)} (
          {trip.duration} days)
        </span>
      </div>

      <button className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors">
        <Sparkles className="w-4 h-4 mr-2" />
        Generate Packing List
      </button>
    </div>
  );
}
