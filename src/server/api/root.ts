import { parametersRouter } from "~/server/api/routers/parameters";
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { debugRouter } from "./routers/debug";
import { seedRouter } from "./routers/seed";
import { syncRouter } from "./routers/sync";
import { accessRouter } from "./routers/access";
import { functionRouter } from "./routers/function";
import { employeeDataRouter } from "./routers/employee_data";

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
	employeeData : employeeDataRouter,
	sync: syncRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
