import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { searchLocation } from '../api/locations';

export const locationRouter = router({
  search: protectedProcedure
    .input(
      z.object({
        query: z.string().min(2, 'Query must be at least 2 characters'),
      })
    )
    .query(async ({ input }) => {
      const result = await searchLocation(input.query);
      return result;
    }),
});

