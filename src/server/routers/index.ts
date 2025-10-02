import { router } from '../trpc';
import { userRouter } from './user';
import { tripRouter } from './trip';

export const appRouter = router({
  user: userRouter,
  trip: tripRouter,
});

export type AppRouter = typeof appRouter;
