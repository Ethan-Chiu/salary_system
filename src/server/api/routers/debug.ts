import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { dataSource } from "~/server/database/client";
import { User } from "~/server/database/entity/user";

export const debugRouter = createTRPCRouter({
	init: publicProcedure.query(async () => {
		const data = await dataSource.manager.find(User);

		return {
			userData: `data ${data}`,
		};
	}),
});
