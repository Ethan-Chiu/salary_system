import { type inferProcedureInput } from "@trpc/server";
import { test } from "@jest/globals";

import { type AppRouter } from "~/server/api/root";
/* import { createInnerTRPCContext } from "~/server/api/trpc"; */

test("login but no account", () => {
	/* const ctx = createInnerTRPCContext({ session: null }); */
	/* const caller = appRouter.createCaller(ctx); */

	type Input = inferProcedureInput<AppRouter["login"]["login"]>;
	const input: Input = {
		emp_no: "12345",
		password: "12345",
	};

	// const example = await caller.login.login(input);
	console.log(input);

	// expect(example).toMatchObject();
});
