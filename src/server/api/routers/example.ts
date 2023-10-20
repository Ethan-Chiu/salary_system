import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { dataSource } from "~/server/database/client";
import { Authority } from "~/server/database/entity/authority";

export const exampleRouter = createTRPCRouter({
	hello: publicProcedure
		.query(async () => {
			await dataSource.manager.find(Authority);

			return {
				greeting: `Hello`,
			};
		}),

	getSecretMessage: protectedProcedure.query(() => {
		return "you can now see this secret message!";
	}),
});
