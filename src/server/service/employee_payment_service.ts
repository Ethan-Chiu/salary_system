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
import { LevelRangeMapper } from "../database/mapper/level_range_mapper";

@injectable()
export class EmployeePaymentService {
	async createEmployeePayment({
		emp_no,
		base_salary,
		food_allowance,
		supervisor_allowance,
		occupational_allowance,
		subsidy_allowance,
		professional_cert_allowance,
		l_r_self,
		l_i,
		h_i,
		l_r,
		occupational_injury,
		start_date,
		end_date,
	}: z.infer<typeof createEmployeePaymentService>): Promise<EmployeePayment> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await EmployeePayment.create({
			emp_no: emp_no,
			base_salary: base_salary,
			food_allowance: food_allowance,
			supervisor_allowance: supervisor_allowance,
			occupational_allowance: occupational_allowance,
			subsidy_allowance: subsidy_allowance,
			professional_cert_allowance: professional_cert_allowance,
			l_r_self: l_r_self,
			l_i: l_i,
			h_i: h_i,
			l_r: l_r,
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

	async getCurrentEmployeePayment(
		period_id: number
	): Promise<EmployeePayment[]> {
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
			order: [
				["emp_no", "ASC"]
			]
		});
		return employeePayment;
	}

	async getCurrentEmployeePaymentById(
		id: number,
		period_id: number
	): Promise<EmployeePayment[]> {
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
			order: [
				["emp_no", "ASC"]
			]
		});
		return employeePayment;
	}

	async getCurrentEmployeePaymentByEmpNo(
		emp_no: string,
		period_id: number
	): Promise<EmployeePayment | null> {
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
		const employeePayment = await EmployeePayment.findAll({
			order: [
				["emp_no", "ASC"]
			]
		});
		return employeePayment;
	}

	async updateEmployeePayment({
		id,
		emp_no,
		base_salary,
		food_allowance,
		supervisor_allowance,
		occupational_allowance,
		subsidy_allowance,
		professional_cert_allowance,
		l_r_self,
		l_i,
		h_i,
		l_r,
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
				food_allowance: select_value(
					food_allowance,
					employeePayment.food_allowance
				),
				supervisor_allowance: select_value(
					supervisor_allowance,
					employeePayment.supervisor_allowance
				),
				occupational_allowance: select_value(occupational_allowance, employeePayment.occupational_allowance),
				subsidy_allowance: select_value(
					subsidy_allowance,
					employeePayment.subsidy_allowance
				),
				professional_cert_allowance: select_value(
					professional_cert_allowance,
					employeePayment.professional_cert_allowance
				),
				l_r_self: select_value(
					l_r_self,
					employeePayment.l_r_self
				),
				l_i: select_value(l_i, employeePayment.l_i),
				h_i: select_value(h_i, employeePayment.h_i),
				l_r: select_value(
					l_r,
					employeePayment.l_r
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

	async autoCalculateEmployeePayment(
		period_id: number,
		emp_no_list: string[]
	): Promise<void> {
		const levelRangeService = container.resolve(LevelRangeService);
		const leveService = container.resolve(LevelService);

		emp_no_list.forEach(async (emp_no: string) => {
			const employeePayment = await this.getCurrentEmployeePaymentByEmpNo(
				emp_no,
				period_id
			);
			if (employeePayment == null) {
				throw new BaseResponseError("Employee Payment does not exist");
			}
			const levelRangeList = await levelRangeService.getAllLevelRange();
			const salary =
				employeePayment.base_salary + (employeePayment.food_allowance ?? 0);
			let result = [];
			for (const levelRange of levelRangeList) {
				const levelRangeMapper = container.resolve(LevelRangeMapper);
				const levelRangeFE = await levelRangeMapper.getLevelRangeFE(levelRange)
				const level = await leveService.getLevelBySalary(
					salary,
					levelRangeFE.level_start,
					levelRangeFE.level_end
				);
				result.push({
					type: levelRange.type,
					level: level.level,
				});
			}

			const affectedCount = await EmployeePayment.update(
				{
					l_i: result.find((r) => r.type === "l_i")?.level ?? 0,
					h_i: result.find((r) => r.type === "h_i")?.level ?? 0,
					l_r:
						result.find((r) => r.type === "l_r")
							?.level ?? 0,
					occupational_injury:
						result.find((r) => r.type === "occupational_injury")
							?.level ?? 0,
					update_by: "system",
				},
				{ where: { emp_no: emp_no } }
			);
			if (affectedCount[0] == 0) {
				throw new BaseResponseError("Update error");
			}
		});
	}

	async rescheduleEmployeePayment(): Promise<void> {
		const employeePaymentList = await EmployeePayment.findAll({
			order: [
				["emp_no", "ASC"],
				["start_date", "ASC"],
			],
		});

		for (let i = 0; i < employeePaymentList.length - 1; i += 1) {
			const end_date_string = get_date_string(
				new Date(employeePaymentList[i]!.dataValues.end_date!)
			);
			const start_date = new Date(
				employeePaymentList[i + 1]!.dataValues.start_date
			);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (
				end_date_string != new_end_date_string &&
				employeePaymentList[i]!.dataValues.emp_no ==
				employeePaymentList[i + 1]!.dataValues.emp_no
			) {
				await this.updateEmployeePayment({
					id: employeePaymentList[i]!.dataValues.id,
					end_date: new_end_date_string,
				});
			}
		}
	}
}
