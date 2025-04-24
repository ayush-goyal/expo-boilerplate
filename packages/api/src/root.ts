import createDevice from "./routes/createDevice";
import getCurrentUser from "./routes/getCurrentUser";
import getUserCount from "./routes/getUserCount";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  getCurrentUser,
  getUserCount,
  createDevice,
});

export type AppRouter = typeof appRouter;
