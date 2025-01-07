import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { z } from "zod";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import {
	employeeTrustCreateAPI,
	updateEmployeeTrustAPI,
} from "../types/employee_trust_type";
import { EmployeeTrustMapper } from "~/server/database/mapper/employee_trust_mapper";
import { EmployeeDataService } from "~/server/service/employee_data_service";

export const employeeTrustRouter = createTRPCRouter({
	getCurrentEmployeeTrust: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const current_employee_trustFE =
				await employeeTrustService.getCurrentEmployeeTrustFE(
					input.period_id
				);
			return current_employee_trustFE;
		}),

	getAllEmployeeTrust: publicProcedure.query(async ({ input }) => {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const allEmployeeTrustFE =
			await employeeTrustService.getAllEmployeeTrustFE();
		return allEmployeeTrustFE;
	}),

	createEmployeeTrust: publicProcedure
		.input(employeeTrustCreateAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const employeeDataService =
				container.resolve(EmployeeDataService);
			const quit_date = (await employeeDataService.getLatestEmployeeDataByEmpNo(input.emp_no)).quit_date;
			if (quit_date) {
				return
			}
			const newdata = await employeeTrustService.createEmployeeTrust(
				input
			);
			await employeeTrustService.rescheduleEmployeeTrust();
			return newdata;
		}),

	updateEmployeeTrust: publicProcedure
		.input(updateEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const employeeTrust =
				await employeeTrustMapper.getEmployeeTrustNullable(input);
			await employeeTrustService.updateEmployeeTrust(employeeTrust);
			await employeeTrustService.rescheduleEmployeeTrust();
		}),

	deleteEmployeeTrust: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			await employeeTrustService.deleteEmployeeTrust(input.id);
			await employeeTrustService.rescheduleEmployeeTrust();
		}),

	// autoCalculateEmployeeTrust: publicProcedure
	// 	.input(
	// 		z.object({
	// 			period_id: z.number(),
	// 			emp_no_list: z.string().array(),
	// 			start_date: z.date(),
	// 		})
	// 	)
	// 	.mutation(async ({ input }) => {
	// 		const employeeTrustService =
	// 			container.resolve(EmployeeTrustService);
	// 		await employeeTrustService.autoCalculateEmployeeTrust(
	// 			input.period_id,
	// 			input.emp_no_list,
	// 			get_date_string(input.start_date)
	// 		);
	// 		await employeeTrustService.rescheduleEmployeeTrust();
	// 	}),
});
