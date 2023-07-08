import { sentMailRouter } from "~/server/api/routers/sentMail";
import { createTRPCRouter } from "~/server/api/trpc";
import { receivedMailRouter } from "./routers/receivedMail";
import { userRouter } from "./routers/user";
import { permissionRouter } from "./routers/permission";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  sentMail: sentMailRouter,
  receivedMail: receivedMailRouter,
  user: userRouter,
  permission: permissionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
