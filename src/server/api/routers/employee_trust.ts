import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { container } from "tsyringe";
import { BaseResponseError } from "../error/BaseResponseError";
import { z } from "zod";
import { EmployeeTrustService } from "~/server/service/employee_trust_service";
import { createEmployeeTrustAPI, updateEmployeeTrustAPI } from "../types/employee_trust";
import { EmployeeTrustMapper } from "~/server/database/mapper/employee_trust_mapper";
import { get_date_string } from "~/server/service/helper_function";
import { TrustMoneyService } from "~/server/service/trust_money_service";
import { EmployeeTrust } from "~/server/database/entity/SALARY/employee_trust";

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
		
			// 获取所有的员工信任记录
			const allEmployeeTrustRecords = await employeeTrustService.getAllEmployeeTrust();
			if (allEmployeeTrustRecords == null) {
				throw new BaseResponseError("Employee trust records do not exist");
			}
		
			// 将记录按工号分组
			const groupedEmployeeTrustRecords = {} as { [empNo: string]: EmployeeTrust[] };
		
			allEmployeeTrustRecords.forEach((record) => {
				if (!groupedEmployeeTrustRecords[record.emp_no]) {
					groupedEmployeeTrustRecords[record.emp_no] = [];
				}
				groupedEmployeeTrustRecords[record.emp_no]!.push(record);
			});
		
			// 将分组后的记录转换为数组格式，并映射为前端格式
			const groupedRecordsArray = Object.values(groupedEmployeeTrustRecords);
			const employeeTrustDataForFE = await Promise.all(
				groupedRecordsArray.map(async (employeeTrustList) => 
					await employeeTrustMapper.getEmployeeTrustFE(employeeTrustList)
				)
			);
		
			return employeeTrustDataForFE;
		}),
		

	createEmployeeTrust: publicProcedure
		.input(createEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService = container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const employeeTrust = await employeeTrustMapper.getEmployeeTrust(input);
			const newdata = await employeeTrustService.createEmployeeTrust(employeeTrust);
			await employeeTrustService.rescheduleEmployeeTrust();
			const employeeTrustFE = await employeeTrustMapper.getEmployeeTrustDec(newdata);
			return employeeTrustFE;
		}),

	updateEmployeeTrust: publicProcedure
		.input(updateEmployeeTrustAPI)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			const employeeTrustMapper = container.resolve(EmployeeTrustMapper);
			const employeeTrust = await employeeTrustMapper.getEmployeeTrustNullable(input);
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

	autoCalculateEmployeeTrust: publicProcedure
		.input(
			z.object({ period_id: z.number(), emp_no_list: z.string().array(), start_date: z.date() })
		)
		.mutation(async ({ input }) => {
			const employeeTrustService =
				container.resolve(EmployeeTrustService);
			await employeeTrustService.autoCalculateEmployeeTrust(
				input.period_id,
				input.emp_no_list,
				get_date_string(input.start_date)
			);
			await employeeTrustService.rescheduleEmployeeTrust();
		}),
});
