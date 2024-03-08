import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeeTrustAPI,
	updateEmployeeTrustAPI,
} from "../types/parameters_input_type";
import { z } from "zod";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import { get_date_string } from "~/server/service/helper_function";

export const employeeTrustRouter = createTRPCRouter({
	getCurrentEmployeeTrust: publicProcedure.query(async () => {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const employeeTrust = await employeeTrustService.getCurrentEmployeeTrust();
		if (employeeTrust == null) {
			throw new BaseResponseError("EmployeeTrust does not exist");
		}
		return employeeTrust;
	}),

	getAllEmployeeTrust: publicProcedure.query(async () => {
		const employeeTrustService = container.resolve(EmployeeTrustService);
		const employeeTrust = await employeeTrustService.getAllEmployeeTrust();
		if (employeeTrust == null) {
			throw new BaseResponseError("EmployeeTrust does not exist");
		}
		return employeeTrust;
	}),

	createEmployeeTrust: publicProcedure
		.input(createEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const newdata = await employeeTrustService.createEmployeeTrust({
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

	updateEmployeeTrust: publicProcedure
		.input(updateEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			await employeeTrustService.updateEmployeeTrust({
				...input,
				start_date: input.start_date
					? get_date_string(input.start_date)
					: null,
				end_date: input.end_date
					? get_date_string(input.end_date)
					: null,
			});
		}),

	deleteEmployeeTrust: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			await employeeTrustService.deleteEmployeeTrust(input.id);
		}),
});
