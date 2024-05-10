import { BaseResponseError } from "../error/BaseResponseError";
import { CalculateService } from "~/server/service/calculate_service";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { container } from "tsyringe";
import { z } from "zod";

export const calculateRouter = createTRPCRouter({
	// API for 平日加班費
	calculateWeekdayOvertimePay: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const overtime_pay: number =
				await calculateService.getExceedOvertimePay(
					input.emp_no,
					input.period_id,
					"平日"
				);
			if (overtime_pay == null) {
				throw new BaseResponseError(
					"Cannot calculate normal overtime payment"
				);
			}
			return overtime_pay;
		}),

	// API for 假日加班費
	calculateOvertimeWeekendPayment: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const overtime_payment: number =
				await calculateService.getExceedOvertimePay(
					input.emp_no,
					input.period_id,
					"假日"
				);
			if (overtime_payment == null) {
				throw new BaseResponseError(
					"Cannot calculate holiday overtime payment"
				);
			}
			return overtime_payment;
		}),

	// API for 請假扣款
	calculateLeaveDeduction: publicProcedure
		.input(
			z.object({
				emp_no: z.coerce.string(),
				period_id: z.coerce.number(),
			})
		)
		.query(async ({ input }) => {
			const calculateService = container.resolve(CalculateService);
			const leave_deduction: number =
				await calculateService.getLeaveDeduction(
					input.emp_no,
					input.period_id
				);
			if (leave_deduction == null) {
				throw new BaseResponseError("Cannot calculate leave deduction");
			}
			return leave_deduction;
		}),
});
