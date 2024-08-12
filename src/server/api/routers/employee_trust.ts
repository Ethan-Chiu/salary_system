import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import { get_date_string } from "~/server/service/helper_function";
import { createEmployeeTrustAPI, updateEmployeeTrustAPI } from "../types/employee_trust";
import { EmployeeTrustMapper } from "~/server/database/mapper/employee_trust_mapper";

export const employeeTrustRouter = createTRPCRouter({
	getCurrentEmployeeTrust: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const employeeTrust =
				await employeeTrustService.getCurrentEmployeeTrust(
					input.period_id
				);
			if (employeeTrust == null) {
				throw new BaseResponseError("EmployeeTrust does not exist");
			}
			const employeeTrustFE = await Promise.all(employeeTrust.map(async e => await employeeTrustMapper.getEmployeeTrustFE(e)));
			return employeeTrustFE;
		}),

	getAllEmployeeTrust: publicProcedure.query(async () => {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
		const employeeTrust = await employeeTrustService.getAllEmployeeTrust();
		if (employeeTrust == null) {
			throw new BaseResponseError("EmployeeTrust does not exist");
		}
		const employeeTrustFE = await Promise.all(employeeTrust.map(async e => await employeeTrustMapper.getEmployeeTrustFE(e)));
		return employeeTrustFE;
	}),

	createEmployeeTrust: publicProcedure
		.input(createEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const newdata = await employeeTrustService.createEmployeeTrust({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
			await employeeTrustService.rescheduleEmployeeTrust();
			const employeeTrustFE = await employeeTrustMapper.getEmployeeTrustFE(newdata);
			return employeeTrustFE;
		}),

	updateEmployeeTrust: publicProcedure
		.input(updateEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			await employeeTrustService.updateEmployeeTrust({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
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

	autoCalculateEmployeeTrust: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array() })
		)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			await employeeTrustService.autoCalculateEmployeeTrust(
				input.period_id,
				input.emp_no_list
			);
		}),
});
