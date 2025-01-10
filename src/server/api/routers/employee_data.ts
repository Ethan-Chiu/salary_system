import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { EmployeeDataService } from "~/server/service/employee_data_service";
import { BaseResponseError } from "../error/BaseResponseError";
import {
	createEmployeeDataAPI,
	updateEmployeeDataAPI,
} from "../types/employee_data_type";
import { z } from "zod";
import { EmployeeDataMapper } from "~/server/database/mapper/employee_data_mapper";
import { EHRService } from "~/server/service/ehr_service";
import { EmployeePaymentService } from "~/server/service/employee_payment_service";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import { LongServiceEnum } from "../types/long_service_enum";

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

	initEmployees: publicProcedure
		.input(z.object({ period_id: z.number() }))
		.mutation(async ({ input }) => {
			const ehrService = container.resolve(EHRService);
			const employeeDataService = container.resolve(EmployeeDataService);
			const employeePaymentService = container.resolve(EmployeePaymentService);
			const employeeTrustService = container.resolve(EmployeeTrustService);

			const period = await ehrService.getPeriodById(input.period_id);
			const empAllList = await ehrService.initEmployeeData(
				input.period_id
			);
			// return empAllList

			const employeeDataList = empAllList.map(async (data) => {
				await employeeDataService.createEmployeeData({
					...data,
					period_id: input.period_id,
				});
				await employeePaymentService.createEmployeePayment({
					emp_no: data.emp_no,
					long_service_allowance_type:
						LongServiceEnum.Enum.month_allowance,
					start_date: new Date(period.start_date),
					end_date: null,
					base_salary: 0,
					food_allowance: 0,
					supervisor_allowance: 0,
					occupational_allowance: 0,
					subsidy_allowance: 0,
					long_service_allowance: 0,
					l_r_self: 0,
					l_i: 0,
					h_i: 0,
					l_r: 0,
					occupational_injury: 0,
				});

				await employeeTrustService.createEmployeeTrust({
					emp_no: data.emp_no,
					emp_trust_reserve: 0,
					emp_special_trust_incent: 0,
					start_date: new Date(0),
					end_date: null,
				});

				if (data.quit_date) {
					await employeePaymentService.rescheduleEmployeePaymentByQuitDate(data.emp_no, input.period_id)
					await employeeTrustService.rescheduleEmployeeTrustByQuitDate(data.emp_no, input.period_id)
				}
			});

			await Promise.all(employeeDataList);

			const list1 = (await employeePaymentService.getCurrentEmployeePayment(input.period_id)).map(e => e.emp_no);
			const list2 = (await employeeTrustService.getCurrentEmployeeTrustFE(input.period_id)).map(e => e.emp_no);

			const list = list1.filter(e => !list2.includes(e));
			console.log(list);

			return employeeDataList;
		}),
});
