import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { SyncService } from "~/server/service/sync_service";

export const syncRouter = createTRPCRouter({
    getCandEmployees: publicProcedure
		.input(z.object({ func: z.string() ,period: z.number() }))
		.query(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			let candEmployees = await syncService.getCandPaidEmployees(
				input.func, input.period
			);
			if (candEmployees == null) {
				throw new BaseResponseError("candEmployees does not exist");
			}
			return candEmployees;
		}),

	checkEmployeeData: publicProcedure
		.input(z.object({ func: z.string(), period: z.number() }))
		.query(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			let diffDatas = await syncService.checkEmployeeData(
				input.func,
				input.period
			);
			return diffDatas;
		}),
	getPaidEmployees: publicProcedure
		.input(z.object({ func: z.string()}))
		.query(async ({ input }) => {
			const syncService = container.resolve(SyncService);
			let paidEmployees = await syncService.getPaidEmps(
				input.func,
			);
			return paidEmployees;
		})
});