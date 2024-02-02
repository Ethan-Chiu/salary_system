import { container } from "tsyringe";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EHRService } from "~/server/service/ehr_service";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { ExcelService } from "~/server/service/excel_service";

export const functionRouter = createTRPCRouter({
	getPeriod: publicProcedure.query(async () => {
		const ehrService = container.resolve(EHRService);
		const period = await ehrService.getPeriod();

		return period;
	}),

	getHoliday: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const holiday = await ehrService.getHoliday(input.period_id);

			return holiday;
		}),

	getOvertime: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const overtime = await ehrService.getOvertime(input.period_id);

			return overtime;
		}),

	getPayset: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const payset = await ehrService.getPayset(input.period_id);

			return payset;
		}),
	getExcelA: publicProcedure
		.input(z.object({ ids: z.array(z.number()) }))
		.query(async ({input}) => {
		const excelService = container.resolve(ExcelService);
		const SheetA = await excelService.getSheetA(input.ids);
		const Sheets = [
			{
				name: "SheetA",
				data: SheetA,
			},
		];
		return Sheets;
	}),
});
