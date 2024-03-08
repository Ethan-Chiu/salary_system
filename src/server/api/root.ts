import { parametersRouter } from "~/server/api/routers/parameters";
import { createTRPCRouter } from "~/server/api/trpc";
import { loginRouter } from "./routers/login";
import { debugRouter } from "./routers/debug";
import { accessRouter } from "./routers/access";
import { functionRouter } from "./routers/function";
import { employeeDataRouter } from "./routers/employee_data";
import { employeePaymentRouter } from "./routers/employee_payment";
import { employeeTrustRouter } from "./routers/employee_trust";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	debug: debugRouter,
	parameters: parametersRouter,
	login: loginRouter,
	access: accessRouter,
	function: functionRouter,
	employeeData: employeeDataRouter,
	employeePayment: employeePaymentRouter,
	employeeTrust: employeeTrustRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
