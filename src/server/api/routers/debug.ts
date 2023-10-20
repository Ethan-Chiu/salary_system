import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { dataSource } from "~/server/database/client";
import { Authority } from "~/server/database/entity/authority";

export const debugRouter = createTRPCRouter({
	init: publicProcedure
		.query(async () => {
			const data = await dataSource.manager.find(Authority);

			return {
				authData: `data ${data}`,
			};
		}),
});
