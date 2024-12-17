import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
	updateEmployeeDataByEmpNoAPI,
} from "../types/employee_data_type";
import { z } from "zod";
import { EmployeeDataMapper } from "~/server/database/mapper/employee_data_mapper";

export const employeeDataRouter = createTRPCRouter({
	getCurrentEmployeeDataWithInfo: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeData =
				await employeeDataService.getCurrentEmployeeData(
					input.period_id
				);
			const employee_data_mapper = container.resolve(EmployeeDataMapper);
			const empDataWithInfo =
				await employee_data_mapper.getEmployeeDataWithInfo(
					employeeData,
					input.period_id
				);
			return empDataWithInfo;
		}),

	getAllEmployeeDataWithInfo: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeData = await employeeDataService.getAllEmployeeData();
			if (employeeData == null) {
				throw new BaseResponseError("EmployeeData does not exist");
			}
			const employee_data_mapper = container.resolve(EmployeeDataMapper);
			const empDataWithInfo =
				await employee_data_mapper.getEmployeeDataWithInfo(
					employeeData,
					input.period_id
				);
			return empDataWithInfo;
		}),

	getAllEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeeData = await employeeDataService.getAllEmployeeData();
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
	// updateEmployeeDataByEmpNo: publicProcedure
	// 	.input(updateEmployeeDataByEmpNoAPI)
	// 	.mutation(async ({ input }) => {
	// 		const employeeDataService = container.resolve(EmployeeDataService);
	// 		await employeeDataService.updateEmployeeDataByEmpNo({
	// 			...input,
	// 		});
	// 	}),

	deleteEmployeeData: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.deleteEmployeeData(input.id);
		}),
});
