import {
	createTRPCRouter,
	publicProcedure,
	protectedProcedure,
} from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
} from "../types/parameters_input_type";
import { get_date_string } from "~/server/service/helper_function";
import { z } from "zod";

export const employeeDataRouter = createTRPCRouter({
	getCurrentEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		let employeeData = await employeeDataService.getCurrentEmployeeData();
		if (employeeData == null) {
			throw new BaseResponseError("EmployeeData does not exist");
		}
		return employeeData;
	}),

	getAllEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		let employeeData = await employeeDataService.getAllEmployeeData();
		if (employeeData == null) {
			throw new BaseResponseError("EmployeeData does not exist");
		}
		return employeeData;
	}),

	createEmployeeData: publicProcedure
		.input(createEmployeeDataAPI)
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			let newdata = await employeeDataService.createEmployeeData({
				...input,
			});
			return newdata;
		}),

	updateEmployeeData: publicProcedure
		.input(updateEmployeeDataAPI)
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.updateEmployeeData({
				...input,
			});
		}),

	deleteEmployeeData: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.deleteEmployeeData(input.id);
		}),

	getBugEmployees: publicProcedure
		.input(z.object({ func: z.string() ,period: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			let bugEmployees = await employeeDataService.getCandPaidEmployees(
				input.func, input.period
			);
			if (bugEmployees == null) {
				throw new BaseResponseError("bugEmployees does not exist");
			}
			return bugEmployees;
		}),

	checkEmployeeData: publicProcedure
		.input(z.object({ func: z.string(), period: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			let diffDatas = await employeeDataService.checkEmployeeData(
				input.func,
				input.period
			);
			return diffDatas;
		}),
	getPaidEmployees: publicProcedure
		.input(z.object({ func: z.string()}))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			let paidEmployees = await employeeDataService.getPaidEmps(
				input.func,
			);
			return paidEmployees;
		})
});
