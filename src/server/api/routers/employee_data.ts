import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
	updateEmployeeDataByEmpNoAPI,
} from "../types/parameters_input_type";
import { z } from "zod";
import { EmployeeInformationService } from "~/server/service/employee_information_service";

export const employeeDataRouter = createTRPCRouter({
	getAllEmployeeDataWithInfo: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.query(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeeInformationService = container.resolve(EmployeeInformationService);
			const employeeData = await employeeDataService.getAllEmployeeData();
			if (employeeData == null) {
				throw new BaseResponseError("EmployeeData does not exist");
			}
			const employeeDataWithInformation = await employeeInformationService.addEmployeeInformation(input.period_id, employeeData);
			return employeeDataWithInformation;
		}),

	getAllEmployeeData: publicProcedure.query(async () => {
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeeData = await employeeDataService.getAllEmployeeData();
		if (employeeData.length == 0) {
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
	updateEmployeeDataByEmpNo: publicProcedure
		.input(updateEmployeeDataByEmpNoAPI)
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.updateEmployeeDataByEmpNo({
				...input,
			});
		}),

	deleteEmployeeData: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			const employeeDataService = container.resolve(EmployeeDataService);
			await employeeDataService.deleteEmployeeData(input.id);
		}),
});
