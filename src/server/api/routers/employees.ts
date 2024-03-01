import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
} from "../types/parameters_input_type";
import { z } from "zod";

export const employeesRouter = createTRPCRouter({
	getCurrentEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeeData = await employeeDataService.getCurrentEmployeeData();
		if (employeeData == null) {
			throw new BaseResponseError("EmployeeData does not exist");
		}
		return employeeData;
	}),

	getAllEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeeData = await employeeDataService.getAllEmployeeData();
		if (employeeData == null) {
			throw new BaseResponseError("EmployeeData does not exist");
		}
		return employeeData;
	}),

	createEmployeeData: publicProcedure
		.input(createEmployeeDataAPI)
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const newdata = await employeeDataService.createEmployeeData({
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

	getPaidEmployees: publicProcedure
		.input(z.object({ func: z.string() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const paidEmployees = await employeeDataService.getPaidEmployees(
				input.func
			);
			if (paidEmployees == null) {
				throw new BaseResponseError("paidEmployees does not exist");
			}
			return paidEmployees;
		}),

	checkEmployeeData: publicProcedure
		.input(z.object({ func: z.string() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const diffDatas = await employeeDataService.checkEmployeeData(
				input.func
			);
			return diffDatas;
		}),
});
