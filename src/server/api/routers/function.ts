import { getExpandedRowModel } from "@tanstack/react-table";
import { container } from "tsyringe";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EHRService } from "~/server/service/ehr_service";
import { ExcelService } from "~/server/service/excel_service";
import { PayTypeEnum, PayTypeEnumType } from "../types/pay_type_enum";
import { AllowanceMapper } from "~/server/database/mapper/allowance_mapper";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { EmployeePaymentMapper } from "~/server/database/mapper/employee_payment_mapper";
import { EmployeePayment } from "~/server/database/entity/SALARY/employee_payment";
import { th } from "date-fns/locale";
import { BaseError } from "sequelize";
import { BaseResponseError } from "../error/BaseResponseError";
import { OtherMapper } from "~/server/database/mapper/other_mapper";

export const functionRouter = createTRPCRouter({
	getPeriod: publicProcedure.query(async () => {
		const ehrService = container.resolve(EHRService);
		const period = await ehrService.getPeriod();

		return period;
	}),

	getHolidayByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const holiday = await ehrService.getHolidayByEmpNoList(
				input.period_id,
				input.emp_no_list
			);

			return holiday;
		}),
	getHolidayWithTypeByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const holiday_with_type_list =
				await ehrService.getHolidayWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list
				);
			return holiday_with_type_list;
		}),

	getOvertimeByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
				pay_type: PayTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const overtime = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				input.emp_no_list,
				input.pay_type
			);

			return overtime;
		}),

	getPaysetByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const payset = await ehrService.getPaysetByEmpNoList(
				input.period_id,
				input.emp_no_list
			);

			return payset;
		}),
	getBonusWithTypeByEmpNoList: publicProcedure
		.input(
			z.object({
				period_id: z.number(),
				emp_no_list: z.string().array(),
				pay_type: PayTypeEnum,
			})
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const bonus_with_type_list =
				await ehrService.getBonusWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list,
					input.pay_type
				);
			return bonus_with_type_list;
		}),
	getExpenseWithTypeByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const expense_with_type_list =
				await ehrService.getExpenseWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list
				);
			const otherMapper = container.resolve(OtherMapper);
			const newOther_list = await otherMapper.getNewOther(
				input.period_id,
				expense_with_type_list,
				input.emp_no_list
			)
			return newOther_list;
		}),
	getAllowanceFEByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const allowance_mapper = container.resolve(AllowanceMapper);
			const allowance_with_type_list =
				await ehrService.getAllowanceWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list
				);
			const Promisises = input.emp_no_list.map(
				async (emp_no) => {
					const employeePayment = await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
						emp_no,
						input.period_id
					)
					if (employeePayment === null) {
						throw new BaseResponseError("EmployeePayment does not exist");
					}
					return employeePayment
				}
			);
			const employee_payment_list = await Promise.all(Promisises);
			const allowanceFE_list: any = [];
			const promises = allowance_with_type_list.map(async (allowance) => {
				allowanceFE_list.push(
					await allowance_mapper.getAllowanceFE(allowance)
				);
			});
			await Promise.all(promises);
			const newAllowanceFE_list = allowance_mapper.getNewAllowanceFE(
				input.period_id,
				allowanceFE_list,
				employee_payment_list
			)
			return newAllowanceFE_list;
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

	getPromotion: publicProcedure.query(async () => {
		const ehrService = container.resolve(EHRService);
		const promotion = await ehrService.getPromotion();

		return promotion;
	}),
});
