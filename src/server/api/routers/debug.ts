import { container } from "tsyringe";
import { z } from "zod";
import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
	userProcedure,
} from "~/server/api/trpc";
import { Database } from "~/server/database/client";
import { RolesEnum } from "../types/role_type";
import { accessiblePages } from "../types/access_page_type";
import { AccessService } from "~/server/service/access_service";

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
					await database.sync({ force: true });
				} else if (input.alter) {
					await database.sync({ alter: true });
				}
				await database.sync();

				return {
					msg: "All models were synchronized successfully.",
				};
			} catch (e) {
				return {
					msg: `error ${(e as Error).message}`,
				};
			}
		}),

	validate: publicProcedure.query(async () => {
		const database = container.resolve(Database).connection;
		try {
			await database.authenticate();
			return { msg: "Connection has been established successfully." };
		} catch (error) {
			return {
				msg: `Unable to connect to the database: ${
					(error as Error).message
				}`,
			};
		}
	}),
	protect: protectedProcedure.query(({ ctx }) => {
		return ctx;
	}),
	resolveUser: userProcedure.query(({ ctx }) => {
		return ctx;
	}),
	createAccessSetting: publicProcedure
		.input(
			z.object({
				role: RolesEnum,
				access: accessiblePages,
			})
		)
		.mutation(async ({ input }) => {
			const accessService = container.resolve(AccessService);
			await accessService.createAccessData(input.role, input.access);
		}),
});
