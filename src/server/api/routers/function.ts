import { container } from "tsyringe";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { EHRService } from "~/server/service/ehr_service";
import { ExcelService } from "~/server/service/excel_service";
import { PayTypeEnum } from "../types/pay_type_enum";
import { AllowanceMapper } from "~/server/database/mapper/allowance_mapper";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { BaseResponseError } from "../error/BaseResponseError";
import { OtherMapper } from "~/server/database/mapper/other_mapper";
import { BonusMapper } from "~/server/database/mapper/bonus_mapper";
import { CalculateService } from "~/server/service/calculate_service";
import { OvertimeMapper } from "~/server/database/mapper/overtime_mapper";
import { HolidayMapper } from "~/server/database/mapper/holiday_mapper";
import { PaysetMapper } from "~/server/database/mapper/payset_mapper";
import { AllowanceFEType } from "../types/allowance_type";

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
			const holiday_mapper = container.resolve(HolidayMapper);
			const ehrService = container.resolve(EHRService);
			const holiday_list = await ehrService.getHolidayByEmpNoList(
				input.period_id,
				input.emp_no_list
			);
			return await holiday_mapper.getHolidayFE(
				input.period_id,
				holiday_list
			);
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
			const overtime_mapper = container.resolve(OvertimeMapper);
			const overtime = await ehrService.getOvertimeByEmpNoList(
				input.period_id,
				input.emp_no_list,
				input.pay_type
			);

			return await overtime_mapper.getOvertimeFE(
				input.period_id,
				overtime
			);
		}),

	getPaysetByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const payset_mapper = container.resolve(PaysetMapper);
			const payset = await ehrService.getPaysetByEmpNoList(
				input.period_id,
				input.emp_no_list
			);

			return await payset_mapper.getPaysetFE(payset);
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
			const bonus_mapper = container.resolve(BonusMapper);
			const new_bonusFE_list = await bonus_mapper.getBonusFE(
				input.period_id,
				bonus_with_type_list,
				input.emp_no_list
			);
			return new_bonusFE_list;
		}),
	getNewOtherByEmpNoList: publicProcedure
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
			const newOther_list = await otherMapper.getOtherFE(
				input.period_id,
				expense_with_type_list,
				input.emp_no_list
			);
			return newOther_list;
		}),
	getOtherDetailsByEmpNoList: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.query(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const calculate_service = container.resolve(CalculateService);
			const expense_with_type_list =
				await ehrService.getExpenseWithTypeByEmpNoList(
					input.period_id,
					input.emp_no_list
				);
			const other_addition_list =
				await calculate_service.getOtherAdditionDetail(
					expense_with_type_list
				);
			const other_addition_tax_list =
				await calculate_service.getOtherAdditionTaxDetail(
					expense_with_type_list
				);
			const other_deduction_list =
				await calculate_service.getOtherDeductionDetail(
					expense_with_type_list
				);
			const other_deduction_tax_list =
				await calculate_service.getOtherDeductionTaxDetail(
					expense_with_type_list
				);
			console.log(other_addition_list);
			console.log(other_deduction_list);
			console.log(other_addition_tax_list);
			console.log(other_deduction_tax_list);
			const result = input.emp_no_list.map((emp_no) => {
				return {
					emp_no: emp_no,
					other_addition: (other_addition_list ?? []).filter(
						(a) => a.emp_no === emp_no
					),
					other_addition_tax: (other_addition_tax_list ?? []).filter(
						(a) => a.emp_no === emp_no
					),
					other_deduction: (other_deduction_list ?? []).filter(
						(d) => d.emp_no === emp_no
					),
					other_deduction_tax: (
						other_deduction_tax_list ?? []
					).filter((d) => d.emp_no === emp_no),
				};
			});
			// const otherMapper = container.resolve(OtherMapper);
			// const newOther_list = await otherMapper.getNewOther(
			// 	input.period_id,
			// 	expense_with_type_list,
			// 	input.emp_no_list
			// )
			return result;
		}),

	getNewAllowanceFEByEmpNoList: publicProcedure
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
			const promises = input.emp_no_list.map(async (emp_no) => {
				const employeePayment =
					await employeePaymentService.getCurrentEmployeePaymentByEmpNo(
						emp_no,
						input.period_id
					);
				if (employeePayment === null) {
					throw new BaseResponseError(
						"EmployeePayment does not exist"
					);
				}
				return employeePayment;
			});
			const employee_payment_list = await Promise.all(promises);

			const allowanceFE_list: AllowanceFEType[] = [];
			await Promise.all(
				allowance_with_type_list.map(async (allowance) => {
					allowanceFE_list.push(
						await allowance_mapper.getAllowanceFE(allowance)
					);
				})
			);

			const newAllowanceFE_list = allowance_mapper.getNewAllowanceFE(
				input.period_id,
				allowanceFE_list,
				employee_payment_list
			);
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

function filterZero(object_list: any) {
	const exclusion = [
		"emp_no",
		"emp_name",
		"department",
		"position",
		"work_day",
	];

	return object_list.filter((object: any) => {
		return (
			Object.keys(object)
				.filter((key) => !exclusion.includes(key))
				.reduce((acc, key) => acc + object[key], 0) == 0
		);
	});
}

