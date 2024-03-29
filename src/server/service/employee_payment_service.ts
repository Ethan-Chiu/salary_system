import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import {
	type createEmployeePaymentService,
	type updateEmployeePaymentService,
} from "../api/types/parameters_input_type";
import { EmployeePayment } from "../database/entity/SALARY/employee_payment";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { LevelRangeService } from "./level_range_service";
import { LevelService } from "./level_service";

@injectable()
export class EmployeePaymentService {

	async createEmployeePayment({
		emp_no,
		base_salary,
		food_bonus,
		supervisor_comp,
		job_comp,
		subsidy_comp,
		professional_cert_comp,
		labor_retirement_self,
		l_i,
		h_i,
		labor_retirement,
		occupational_injury,
		start_date,
		end_date,
	}: z.infer<typeof createEmployeePaymentService>): Promise<EmployeePayment> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await EmployeePayment.create({
			emp_no: emp_no,
			base_salary: base_salary,
			food_bonus: food_bonus,
			supervisor_comp: supervisor_comp,
			job_comp: job_comp,
			subsidy_comp: subsidy_comp,
			professional_cert_comp: professional_cert_comp,
			labor_retirement_self: labor_retirement_self,
			l_i: l_i,
			h_i: h_i,
			labor_retirement: labor_retirement,
			occupational_injury: occupational_injury,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getEmployeePaymentById(id: number): Promise<EmployeePayment | null> {
		const employeePayment = await EmployeePayment.findOne({
			where: {
				id: id,
			},
		});
		return employeePayment;
	}

	async getCurrentEmployeePayment(period_id: number): Promise<EmployeePayment[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
		});
		return employeePayment;
	}

	async getCurrentEmployeePaymentById(id: number, period_id: number): Promise<EmployeePayment[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findAll({
			where: {
				id: id,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
		});
		return employeePayment;
	}

	async getCurrentEmployeePaymentByEmpNo(emp_no: string, period_id: number): Promise<EmployeePayment | null> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const employeePayment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
		});
		return employeePayment;
	}
	async getAllEmployeePayment(): Promise<EmployeePayment[]> {
		const employeePayment = await EmployeePayment.findAll();
		return employeePayment;
	}

	async updateEmployeePayment({
		id,
		emp_no,
		base_salary,
		food_bonus,
		supervisor_comp,
		job_comp,
		subsidy_comp,
		professional_cert_comp,
		labor_retirement_self,
		l_i,
		h_i,
		labor_retirement,
		occupational_injury,
		start_date,
		end_date,
	}: z.infer<typeof updateEmployeePaymentService>): Promise<void> {
		const employeePayment = await this.getEmployeePaymentById(id!);
		if (employeePayment == null) {
			throw new BaseResponseError("Employee Payment does not exist");
		}
		const affectedCount = await EmployeePayment.update(
			{
				emp_no: select_value(emp_no, employeePayment.emp_no),
				base_salary: select_value(
					base_salary,
					employeePayment.base_salary
				),
				food_bonus: select_value(
					food_bonus,
					employeePayment.food_bonus
				),
				supervisor_comp: select_value(
					supervisor_comp,
					employeePayment.supervisor_comp
				),
				job_comp: select_value(job_comp, employeePayment.job_comp),
				subsidy_comp: select_value(
					subsidy_comp,
					employeePayment.subsidy_comp
				),
				professional_cert_comp: select_value(
					professional_cert_comp,
					employeePayment.professional_cert_comp
				),
				labor_retirement_self: select_value(
					labor_retirement_self,
					employeePayment.labor_retirement_self
				),
				l_i: select_value(l_i, employeePayment.l_i),
				h_i: select_value(h_i, employeePayment.h_i),
				labor_retirement: select_value(
					labor_retirement,
					employeePayment.labor_retirement
				),
				occupational_injury: select_value(
					occupational_injury,
					employeePayment.occupational_injury
				),
				start_date: select_value(
					start_date,
					employeePayment.start_date
				),
				end_date: select_value(end_date, employeePayment.end_date),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeePayment(id: number): Promise<void> {
		const destroyedRows = await EmployeePayment.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}

	async autoCalculateEmployeePayment(period_id: number, emp_no_list: string[]): Promise<void> {
		const levelRangeService = container.resolve(LevelRangeService);
		const leveService = container.resolve(LevelService);

		emp_no_list.forEach(async (emp_no: string) => {
			const employeePayment = await this.getCurrentEmployeePaymentByEmpNo(emp_no, period_id);
			if (employeePayment == null) {
				throw new BaseResponseError("Employee Payment does not exist");
			}
			const levelRangeList = await levelRangeService.getAllLevelRange();
			const salary = employeePayment.base_salary + employeePayment.food_bonus;
			let result = [];
			for (const levelRange of levelRangeList) {
				const level = await leveService.getLevelBySalary(salary, levelRange.level_start, levelRange.level_end);
				result.push({
					type: levelRange.type,
					level: level.level,
				});
			}

			const affectedCount = await EmployeePayment.update(
				{
					l_i: result.find((r) => r.type === "l_i")?.level ?? 0,
					h_i: result.find((r) => r.type === "h_i")?.level ?? 0,
					labor_retirement: result.find((r) => r.type === "labor_retirement")?.level ?? 0,
					occupational_injury: result.find((r) => r.type === "occupational_injury")?.level ?? 0,
					update_by: "system",
				},
				{ where: { emp_no: emp_no } }
			);
			if (affectedCount[0] == 0) {
				throw new BaseResponseError("Update error");
			}
		})
	}
}
