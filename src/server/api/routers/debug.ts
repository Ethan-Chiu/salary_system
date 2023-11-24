import { container } from "tsyringe";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { Database } from "~/server/database/client";

export const debugRouter = createTRPCRouter({
	syncDb: publicProcedure
		.input(
			z.object({
				force: z.boolean().nullable(),
				alter: z.boolean().nullable(),
			})
		)
		.query(async ({ input }) => {
			const database = container.resolve(Database).connection;


			try {
				if (input.force) {
					const data = await database.sync({ force: true });
				} else if (input.alter) {
					const data = await database.sync({ alter: true });
				}
				const data = await database.sync();

				return {
					msg: "All models were synchronized successfully.",
				};
			} catch (e) {
				return {
					msg: `error ${e}`,
				};
			}
		}),

	validate: publicProcedure.query(async () => {
		const database = container.resolve(Database).connection;
		try {
			await database.authenticate();
			return { msg: "Connection has been established successfully." };
		} catch (error) {
			return { msg: `Unable to connect to the database: ${error}` };
		}
	}),
	protect: protectedProcedure.query(async ({ ctx }) => {
		return ctx;
	}),
	resolveUser: userProcedure.query(async ({ ctx }) => {
		return ctx;
	}),
});
