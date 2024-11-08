import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import {
	employeePaymentCreateAPI,
	updateEmployeePaymentAPI,
} from "../types/employee_payment_type";
import { EmployeePaymentMapper } from "~/server/database/mapper/employee_payment_mapper";
import { get_date_string } from "~/server/service/helper_function";
import { type EmployeePaymentDecType } from "~/server/database/entity/SALARY/employee_payment";
import { EmployeeDataService } from "~/server/service/employee_data_service";

export const employeePaymentRouter = createTRPCRouter({
	getCurrentEmployeePayment: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePayment: EmployeePaymentDecType[] =
				await employeePaymentService.getCurrentEmployeePayment(
					input.period_id
				);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentFE = await Promise.all(
				employeePayment.map(async (e) => {
					const employee =
						await employeeDataService.getEmployeeDataByEmpNo(
							e.emp_no
						);
					if (employee == null) {
						throw new BaseResponseError("Employee does not exist");
					}
					return {
						...e,
						department: employee.department,
						emp_name: employee.emp_name,
						position: employee.position,
						position_type: employee.position_type,
					};
				})
			);
			return employeePaymentFE;
		}),

	getAllEmployeePayment: publicProcedure.query(async () => {
		const employeePaymentService = container.resolve(
			EmployeePaymentService
		);
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		const employeePayment =
			await employeePaymentService.getAllEmployeePayment();
		if (employeePayment == null) {
			throw new BaseResponseError("EmployeePayment does not exist");
		}
		
		const employeePaymentFE = await Promise.all(
			employeePayment.map(async (e) => {
				const employee =
					await employeeDataService.getEmployeeDataByEmpNo(
						e.emp_no
					);
				if (employee == null) {
					throw new BaseResponseError("Employee does not exist");
				}
				return {
					...e,
					department: employee.department,
					emp_name: employee.emp_name,
					position: employee.position,
					position_type: employee.position_type,
				};
			})
		);
		return employeePaymentFE;
	}),

	createEmployeePayment: publicProcedure
		.input(employeePaymentCreateAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentMapper = container.resolve(
				EmployeePaymentMapper
			);
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
			
			const newdata = await employeePaymentService.createEmployeePayment({
				...input,
				base_salary: input.base_salary,
				food_allowance: input.food_allowance,
				supervisor_allowance: input.supervisor_allowance,
				occupational_allowance: input.occupational_allowance,
				subsidy_allowance: input.subsidy_allowance,
				long_service_allowance: input.long_service_allowance,
				l_r_self: input.l_r_self,
				l_i: previousEmployeePaymentFE.l_i,
				h_i: previousEmployeePaymentFE.h_i,
				l_r: previousEmployeePaymentFE.l_r,
				occupational_injury:
					previousEmployeePaymentFE.occupational_injury,
			});
			await employeePaymentService.rescheduleEmployeePayment();
			const employeePaymentFE =
				await employeePaymentMapper.decodeEmployeePayment(newdata);
			return employeePaymentFE;
		}),

	updateEmployeePayment: publicProcedure
		.input(updateEmployeePaymentAPI)
		.mutation(async ({ input }) => {
			const employeePaymentService = container.resolve(
				EmployeePaymentService
			);
			const employeePaymentMapper = container.resolve(
				EmployeePaymentMapper
			);
			const employeePayment =
				await employeePaymentMapper.getEmployeePaymentNullable(input);
			const employeePaymentAfterSelectValue =
				await employeePaymentService.getEmployeePaymentAfterSelectValue(
					employeePayment
				);
			const updatedEmployeePayment =
				await employeePaymentService._getUpdatedEmployeePayment(
					employeePaymentAfterSelectValue,
					employeePaymentAfterSelectValue.start_date!
				);
			await employeePaymentService.updateEmployeePayment({
				id: employeePayment.id,
				...updatedEmployeePayment,
			});
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
