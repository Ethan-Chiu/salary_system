import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import {
	createEmployeeTrustAPI,
	updateEmployeeTrustAPI,
} from "../types/employee_trust";
import { EmployeeTrustMapper } from "~/server/database/mapper/employee_trust_mapper";
function delay(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export const employeeTrustRouter = createTRPCRouter({
	getCurrentEmployeeTrust: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const current_employee_trustFE = await employeeTrustService.getCurrentEmployeeTrustFE(input.period_id);
			return current_employee_trustFE;
		}),

	getAllEmployeeTrust: publicProcedure.query(async () => {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const allEmployeeTrustFE = await employeeTrustService.getAllEmployeeTrustFE()
		return allEmployeeTrustFE;
	}),
	createEmployeeTrust: publicProcedure
		.input(createEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const employeeTrust = await employeeTrustMapper.getEmployeeTrust(
				input
			);
			const newdata = await employeeTrustService.createEmployeeTrust(
				employeeTrust
			);
			console.log("\n\n\nreschedule\n\n\n");
			await employeeTrustService.rescheduleEmployeeTrust();
			const employeeTrustDec =
				await employeeTrustMapper.getEmployeeTrustDec(newdata);
			return employeeTrustDec;
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
