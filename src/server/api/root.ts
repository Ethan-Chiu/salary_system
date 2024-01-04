import { parametersRouter } from "~/server/api/routers/parameters";
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { debugRouter } from "./routers/debug";
import { seedRouter } from "./routers/seed";
import { accessRouter } from "./routers/access";
import { functionRouter } from "./routers/function";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	debug: debugRouter,
	parameters: parametersRouter,
	login: loginRouter,
	seed: seedRouter,
	access: accessRouter,
	function: functionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
