import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import {
	employeePaymentCreateAPI,
	employeePaymentFE,
	type EmployeePaymentFEType,
	updateEmployeePaymentAPI,
	updateEmployeePaymentService,
} from "../types/employee_payment_type";
import { EmployeePaymentMapper } from "~/server/database/mapper/employee_payment_mapper";
import { EmployeeDataService } from "~/server/service/employee_data_service";

export const employeePaymentRouter = createTRPCRouter({
	getCurrentEmployeePayment: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentFE: EmployeePaymentFEType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id
				);

			return employeePaymentFE;
		}),

	getAllEmployeePayment: publicProcedure
		.output(z.array(z.array(employeePaymentFE)))
		.query(async () => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePayment =
				await employeePaymentService.getAllEmployeePayment();
			if (employeePayment == null) {
				throw new BaseResponseError("EmployeePayment does not exist");
			}

			return employeePayment;
		}),

	// getAllFutureEmployeePayment: publicProcedure
	// 	.output(z.array(z.array(employeePaymentFE)))
	// 	.query(async () => {
	// 		const employeePaymentService = container.resolve(
	// 			EmployeePaymentService
	// 		);
	// 		const employeePayment =
	// 			await employeePaymentService.getAllFutureEmployeePayment();
	// 		if (employeePayment == null) {
	// 			throw new BaseResponseError("EmployeePayment does not exist");
	// 		}

	// 		return employeePayment;
	// 	}),

	createEmployeePayment: publicProcedure
		.input(employeePaymentCreateAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
			const employeeDataService = container.resolve(EmployeeDataService);
			const previousEmployeePaymentFE =
				await employeePaymentService.getCurrentEmployeePaymentByEmpNoByDate(
					input.emp_no,
					input.start_date ?? new Date()
				);
			if (!previousEmployeePaymentFE) {
				throw new BaseResponseError(
					`EmployeePayment for emp_no: ${input.emp_no} not exists yet`
				);
			}

			const quit_date = (await employeeDataService.getLatestEmployeeDataByEmpNo(input.emp_no)).quit_date;
			if (quit_date) {
				return
			}

			const newdata = await employeePaymentService.createEmployeePayment({
				...input,
				l_i: previousEmployeePaymentFE.l_i,
				h_i: previousEmployeePaymentFE.h_i,
				l_r: previousEmployeePaymentFE.l_r,
				occupational_injury:
					previousEmployeePaymentFE.occupational_injury,
				end_date: null,
			});

			await employeePaymentService.rescheduleEmployeePayment();

			return await employeePaymentMapper.decode(newdata);
		}),

	updateEmployeePayment: publicProcedure
		.input(updateEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePayment = updateEmployeePaymentService.parse(input);

			await employeePaymentService.updateEmployeePaymentAndMatchLevel(
				employeePayment
			);
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
			z.object({ emp_no_list: z.string().array(), start_date: z.date() })
		)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			await employeePaymentService.autoCalculateEmployeePayment(
				input.emp_no_list,
				input.start_date
			);
			await employeePaymentService.rescheduleEmployeePayment();
		}),
});
