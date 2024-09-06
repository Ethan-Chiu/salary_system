import { getExpandedRowModel } from "@tanstack/react-table";
import { container } from "tsyringe";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EHRService } from "~/server/service/ehr_service";
import { ExcelService } from "~/server/service/excel_service";
import { PayTypeEnum, PayTypeEnumType } from "../types/pay_type_enum";

export const functionRouter = createTRPCRouter({
	getPeriod: publicProcedure.query(async () => {
		const ehrService = container.resolve(EHRService);
		const period = await ehrService.getPeriod();

		return period;
	}),

	getHolidayByEmpNoList: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no_list: z.string().array() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const holiday = await ehrService.getHolidayByEmpNoList(input.period_id, input.emp_no_list);

			return holiday;
		}),
	getHolidayWithTypeByEmpNoList: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no_list: z.string().array() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const holiday_with_type_list = await ehrService.getHolidayWithTypeByEmpNoList(input.period_id, input.emp_no_list);
			return holiday_with_type_list;
		}),

	getOvertimeByEmpNoList: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no_list: z.string().array(), pay_type: PayTypeEnum }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const overtime = await ehrService.getOvertimeByEmpNoList(input.period_id, input.emp_no_list, input.pay_type);

			return overtime;
		}),

	getPaysetByEmpNoList: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no_list: z.string().array() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const payset = await ehrService.getPaysetByEmpNoList(input.period_id, input.emp_no_list);

			return payset;
		}),
	getBonusWithTypeByEmpNoList: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no_list: z.string().array(), pay_type: PayTypeEnum }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const bonus_with_type_list = await ehrService.getBonusWithTypeByEmpNoList(input.period_id, input.emp_no_list, input.pay_type);
			return bonus_with_type_list;
		}),
	getExpenseWithTypeByEmpNoList: publicProcedure
		.input(z.object({ period_id: z.number(), emp_no_list: z.string().array() }))
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const expense_with_type_list = await ehrService.getExpenseWithTypeByEmpNoList(input.period_id, input.emp_no_list);
			return expense_with_type_list;
		}),
	getExcelA: publicProcedure
		.input(z.object({ ids: z.array(z.number()) }))
		.query(async ({ input }) => {
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
