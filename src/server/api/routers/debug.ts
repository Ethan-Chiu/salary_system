import { container } from "tsyringe";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { Database } from "~/server/database/client";

export const debugRouter = createTRPCRouter({
	init: publicProcedure.query(async () => {
		const database = container.resolve(Database).connection;

		try {
			const data = await database.sync({ alter: true });
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
});
