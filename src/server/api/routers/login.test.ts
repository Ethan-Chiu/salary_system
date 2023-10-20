import { type inferProcedureInput } from "@trpc/server";
import { expect, test } from "vitest";

import { appRouter, type AppRouter } from "../../../server/api/root";
import { createInnerTRPCContext } from "../../../server/api/trpc";

test("login but no account", async () => {
	const ctx = await createInnerTRPCContext({ session: null });
	const caller = appRouter.createCaller(ctx);

	type Input = inferProcedureInput<AppRouter["login"]["login"]>;
	const input: Input = {
		emp_id: "12345",
		password: "12345",
	};

	const example = await caller.login.login(input);
	console.log(example);

	// expect(example).toMatchObject();
});
