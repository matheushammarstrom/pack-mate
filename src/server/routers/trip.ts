import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TripType, ItemCategory } from '@prisma/client';

export const tripRouter = router({
  getAllTrips: protectedProcedure.query(async ({ ctx }) => {
    const trips = await ctx.db.trip.findMany({
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
        startDate: z.string().transform((val) => new Date(val)),
        endDate: z.string().transform((val) => new Date(val)),
        tripType: z.enum(TripType),
        description: z.string().optional(),
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
});
