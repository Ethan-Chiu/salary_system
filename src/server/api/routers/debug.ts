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
import { HolidaysTypeService } from "~/server/service/holidays_type_service";
import { Transaction } from "~/server/database/entity/SALARY/transaction";
import { TrustMoney } from "~/server/database/entity/SALARY/trust_money";
import { Level } from "~/server/database/entity/SALARY/level";
import { LevelRange } from "~/server/database/entity/SALARY/level_range";

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
	syncTransaction: publicProcedure
		.input(
			z.object({
				force: z.boolean().nullable(),
				alter: z.boolean().nullable(),
			})
		)
		.query(async ({ input }) => {
			try {
				if (input.force) {
					await Transaction.sync({ force: true });
				} else if (input.alter) {
					await Transaction.sync({ alter: true });
				}
				await Transaction.sync();

				return {
					msg: "All models were synchronized successfully.",
				};
			} catch (e) {
				return {
					msg: `error ${(e as Error).message}`,
				};
			}
		}),
	syncTables: publicProcedure
		.input(
			z.object({
				force: z.boolean().nullable(),
				alter: z.boolean().nullable(),
			})
		)
		.query(async ({ input }) => {
			const table_list = [
				Level
			];
			table_list.forEach(async (model) => {
				try {
					if (input.force) {
						await model.sync({ force: true });
					} else if (input.alter) {
						await model.sync({ alter: true });
					}
					await model.sync();
					
				} catch (e) {
					return {
						msg: `error ${(e as Error).message}`,
					};
				}
			})
			return {
				msg: "All models were synchronized successfully.",
			};
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

	createHolidaysType: publicProcedure
		.input(
			z.object({
				pay_id: z.number(),
				holidays_name: z.string(),
				multiplier: z.number(),
				pay_type: z.number(),
				start_date: z.string(),
				end_date: z.string(),
			})
		)
		.mutation(async ({ input }) => {
			const holidaysTypeService = container.resolve(HolidaysTypeService);
			await holidaysTypeService.createHolidaysType(input);
		}),
});
