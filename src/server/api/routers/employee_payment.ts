import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeePaymentAPI,
	updateEmployeePaymentAPI,
} from "../types/parameters_input_type";
import { z } from "zod";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { get_date_string } from "~/server/service/helper_function";

export const employeePaymentRouter = createTRPCRouter({
	getCurrentEmployeePayment: publicProcedure.query(async () => {
		const employeePaymentService = container.resolve(EmployeePaymentService);
		const employeePayment = await employeePaymentService.getCurrentEmployeePayment();
		if (employeePayment == null) {
			throw new BaseResponseError("EmployeePayment does not exist");
		}
		return employeePayment;
	}),

	getAllEmployeePayment: publicProcedure.query(async () => {
		const employeePaymentService = container.resolve(EmployeePaymentService);
		const employeePayment = await employeePaymentService.getAllEmployeePayment();
		if (employeePayment == null) {
			throw new BaseResponseError("EmployeePayment does not exist");
		}
		return employeePayment;
	}),

	createEmployeePayment: publicProcedure
		.input(createEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const newdata = await employeePaymentService.createEmployeePayment({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			return newdata;
		}),

	updateEmployeePayment: publicProcedure
		.input(updateEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			await employeePaymentService.updateEmployeePayment({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
		}),

	deleteEmployeePayment: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			await employeePaymentService.deleteEmployeePayment(input.id);
		}),
});
