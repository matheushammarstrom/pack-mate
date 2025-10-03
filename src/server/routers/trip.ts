import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TripType, ItemCategory, TripProcessingStatus } from '@prisma/client';
import { fetchWeatherForecast } from '../api/weather';

export const tripRouter = router({
  getAllTrips: protectedProcedure.query(async ({ ctx }) => {
    const trips = await ctx.db.trip.findMany({
      omit: {
        weatherData: true,
      },
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        packingList: {
          include: {
            items: true,
          },
        },
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return trips;
  }),

  createTrip: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Title is required'),
        destination: z.string().min(1, 'Destination is required'),
        startDate: z
          .union([z.string(), z.date()])
          .transform((val) => new Date(val)),
        endDate: z
          .union([z.string(), z.date()])
          .transform((val) => new Date(val)),
        tripType: z.enum(TripType),
        description: z.string().optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const duration = Math.ceil(
        (input.endDate.getTime() - input.startDate.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const trip = await ctx.db.trip.create({
        data: {
          title: input.title,
          destination: input.destination,
          startDate: input.startDate,
          endDate: input.endDate,
          duration,
          tripType: input.tripType,
          description: input.description,
          userId: ctx.session.user.id,
          latitude: input.latitude,
          longitude: input.longitude,
        },
      });

      return trip;
    }),

  getTripTypes: protectedProcedure.query(async () => {
    return Object.values(TripType);
  }),

  getItemCategories: protectedProcedure.query(async () => {
    return Object.values(ItemCategory);
  }),

  getTripStatus: protectedProcedure
    .input(z.object({ tripId: z.string() }))
    .query(async ({ ctx, input }) => {
      const trip = await ctx.db.trip.findUnique({
        where: {
          id: input.tripId,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          processingStatus: true,
          weatherData: true,
          packingList: true,
        },
      });

      if (!trip) {
        throw new Error('Trip not found');
      }

      return trip;
    }),

  updateTripStatus: protectedProcedure
    .input(
      z.object({
        tripId: z.string(),
        status: z.enum(TripProcessingStatus),
        weatherData: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const trip = await ctx.db.trip.update({
        where: {
          id: input.tripId,
          userId: ctx.session.user.id,
        },
        data: {
          processingStatus: input.status,
          ...(input.weatherData && { weatherData: input.weatherData }),
        },
      });

      return trip;
    }),
});
