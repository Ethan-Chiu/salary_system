import "reflect-metadata"
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { debugRouter } from "./routers/debug";
import { seedRouter } from "./routers/seed";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	login: loginRouter,
	debug: debugRouter,
	seed: seedRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
