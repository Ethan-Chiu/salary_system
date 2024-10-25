import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { createEmployeePaymentAPI, updateEmployeePaymentAPI } from "../types/employee_payment_type";
import { EmployeePaymentMapper } from "~/server/database/mapper/employee_payment_mapper";
import { get_date_string } from "~/server/service/helper_function";

export const employeePaymentRouter = createTRPCRouter({
	getCurrentEmployeePayment: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
			const employeePayment =
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id
				);
			if (employeePayment == null) {
				throw new BaseResponseError("EmployeePayment does not exist");
			}
			const employeePaymentFE = await Promise.all(employeePayment.map(async e => await employeePaymentMapper.getEmployeePaymentFE(e)));
			return employeePaymentFE;
		}),

	getAllEmployeePayment: publicProcedure.query(async () => {
		const employeePaymentService = container.resolve(EmployeePaymentService);
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const employeePayment =
			await employeePaymentService.getAllEmployeePayment();
		if (employeePayment == null) {
			throw new BaseResponseError("EmployeePayment does not exist");
		}
		const employeePaymentFE = await Promise.all(employeePayment.map(async e => await employeePaymentMapper.getEmployeePaymentFE(e)));
		return employeePaymentFE;
	}),

	createEmployeePayment: publicProcedure
		.input(createEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
			const previousEmployeePayment = await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(input.emp_no, get_date_string(input.start_date ?? new Date()));
			if (!previousEmployeePayment) {
				throw new BaseResponseError(`EmployeePayment for emp_no: ${input.emp_no} not exists yet`);
			}
			const previousEmployeePaymentFE = await employeePaymentMapper.getEmployeePaymentFE(previousEmployeePayment);
			const employeePayment = await employeePaymentMapper.getEmployeePayment({ l_i: previousEmployeePaymentFE.l_i, h_i: previousEmployeePaymentFE.h_i, l_r: previousEmployeePaymentFE.l_r, occupational_injury: previousEmployeePaymentFE.occupational_injury, ...input });
			const newdata = await employeePaymentService.createEmployeePayment(employeePayment);
			await employeePaymentService.rescheduleEmployeePayment();
			const employeePaymentFE = await employeePaymentMapper.getEmployeePaymentFE(newdata);
			return employeePaymentFE;
		}),

	updateEmployeePayment: publicProcedure
		.input(updateEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
			const employeePayment = await employeePaymentMapper.getEmployeePaymentNullable(input);
			const employeePaymentAfterSelectValue = await employeePaymentService.getEmployeePaymentAfterSelectValue(employeePayment);
			const updatedEmployeePayment = await employeePaymentService.getUpdatedEmployeePayment(employeePaymentAfterSelectValue, employeePaymentAfterSelectValue.start_date!);
			await employeePaymentService.updateEmployeePayment({ id: employeePayment.id, ...updatedEmployeePayment });
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	deleteEmployeePayment: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			await employeePaymentService.deleteEmployeePayment(input.id);
			await employeePaymentService.rescheduleEmployeePayment();
		}),

	autoCalculateEmployeePayment: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array(), start_date: z.date() })
		)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			await employeePaymentService.autoCalculateEmployeePayment(
				// input.period_id,
				input.emp_no_list,
				get_date_string(input.start_date)
			);
			await employeePaymentService.rescheduleEmployeePayment();
		}),
});
