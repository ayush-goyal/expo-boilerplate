import getCurrentUser from "./routes/getCurrentUser";
import getUserCount from "./routes/getUserCount";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  getCurrentUser,
  getUserCount,
});

export type AppRouter = typeof appRouter;
