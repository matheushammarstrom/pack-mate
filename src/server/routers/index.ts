import { router } from '../trpc';
import { userRouter } from './user';
import { tripRouter } from './trip';
import { locationRouter } from './location';

export const appRouter = router({
  user: userRouter,
  trip: tripRouter,
  location: locationRouter,
});

export type AppRouter = typeof appRouter;
