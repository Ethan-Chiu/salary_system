import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type z } from "zod";
import { EmployeePayment } from "../database/entity/SALARY/employee_payment";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { LevelRangeService } from "./level_range_service";
import { LevelService } from "./level_service";
import { createEmployeePaymentService, updateEmployeePaymentService } from "../api/types/employee_payment_type";
import { EmployeePaymentMapper } from "../database/mapper/employee_payment_mapper";
import { EmployeeDataService } from "./employee_data_service";

@injectable()
export class EmployeePaymentService {
	async createEmployeePayment({
		emp_no,
		base_salary_enc,
		food_allowance_enc,
		supervisor_allowance_enc,
		occupational_allowance_enc,
		subsidy_allowance_enc,
		l_r_self_enc,
		l_i_enc,
		h_i_enc,
		l_r_enc,
		occupational_injury_enc,
		start_date,
		end_date,
	}: z.infer<typeof createEmployeePaymentService>): Promise<EmployeePayment> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await EmployeePayment.create({
			emp_no: emp_no,
			base_salary_enc: base_salary_enc,
			food_allowance_enc: food_allowance_enc,
			supervisor_allowance_enc,
			occupational_allowance_enc,
			subsidy_allowance_enc,
			l_r_self_enc: l_r_self_enc,
			l_i_enc: l_i_enc,
			h_i_enc: h_i_enc,
			l_r_enc: l_r_enc,
			occupational_injury_enc: occupational_injury_enc,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		}, { raw: true });
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
			],
			raw: true
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
			],
			raw: true
		});
		return employeePayment;
	}

	async updateEmployeePayment({
		id,
		emp_no,
		base_salary_enc,
		food_allowance_enc,
		supervisor_allowance_enc,
		occupational_allowance_enc,
		subsidy_allowance_enc,
		l_r_self_enc,
		l_i_enc,
		h_i_enc,
		l_r_enc,
		occupational_injury_enc,
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
				base_salary_enc: select_value(
					base_salary_enc,
					employeePayment.base_salary_enc
				),
				food_allowance_enc: select_value(
					food_allowance_enc,
					employeePayment.food_allowance_enc
				),
				supervisor_allowance_enc: select_value(
					supervisor_allowance_enc,
					employeePayment.supervisor_allowance_enc
				),
				occupational_allowance_enc: select_value(
					occupational_allowance_enc,
					employeePayment.occupational_allowance_enc
				),
				subsidy_allowance_enc: select_value(
					subsidy_allowance_enc,
					employeePayment.subsidy_allowance_enc
				),
				l_r_self_enc: select_value(
					l_r_self_enc,
					employeePayment.l_r_self_enc
				),
				l_i_enc: select_value(l_i_enc, employeePayment.l_i_enc),
				h_i_enc: select_value(h_i_enc, employeePayment.h_i_enc),
				l_r_enc: select_value(
					l_r_enc,
					employeePayment.l_r_enc
				),
				occupational_injury_enc: select_value(
					occupational_injury_enc,
					employeePayment.occupational_injury_enc
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
		const levelService = container.resolve(LevelService);
		const employeeDataService = container.resolve(EmployeeDataService);
		const employeePaymentMapper = container.resolve(EmployeePaymentMapper);
		emp_no_list.forEach(async (emp_no: string) => {
			const employeePayment = await this.getCurrentEmployeePaymentByEmpNo(
				emp_no,
				period_id
			);
			if (employeePayment == null) {
				throw new BaseResponseError("Employee Payment does not exist");
			}
			const employeePaymentFE = await employeePaymentMapper.getEmployeePaymentFE(employeePayment.dataValues);
			const levelRangeList = await levelRangeService.getAllLevelRange();
			const salary =
				employeePaymentFE.base_salary + (employeePaymentFE.food_allowance ?? 0) + (employeePaymentFE.supervisor_allowance ?? 0) + (employeePaymentFE.occupational_allowance ?? 0) + (employeePaymentFE.subsidy_allowance ?? 0);
			let result = [];
			for (const levelRange of levelRangeList) {
				const level = await levelService.getLevelBySalary(
					salary,
					levelRange.level_start_id,
					levelRange.level_end_id
				);
				result.push({
					type: levelRange.type,
					level: level.level,
				});
			}
			const employeeData = await employeeDataService.getEmployeeDataByEmpNo(emp_no);
			if (employeeData == null) {
				throw new BaseResponseError("Employee Data does not exist");
			}
			const updatedEmployeePayment = await employeePaymentMapper.getEmployeePayment({
				...employeePaymentFE,
				l_i: result.find((r) => r.type === "勞保")?.level ?? 0,
				h_i: result.find((r) => r.type === "健保")?.level ?? 0,
				l_r: employeeData.work_type != "外籍勞工" ? result.find((r) => r.type === "勞退")?.level ?? 0 : 0,
				occupational_injury: result.find((r) => r.type === "職災")?.level ?? 0,
			});

			const affectedCount = await EmployeePayment.update(
				{
					l_i_enc: updatedEmployeePayment.l_i_enc,
					h_i_enc: updatedEmployeePayment.h_i_enc,
					l_r_enc: updatedEmployeePayment.l_r_enc,
					occupational_injury_enc: updatedEmployeePayment.occupational_injury_enc,
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
			if (employeePaymentList[i]!.dataValues.emp_no ==
				employeePaymentList[i + 1]!.dataValues.emp_no) {
					if (
						end_date_string != new_end_date_string
					) {
						await this.updateEmployeePayment({
							id: employeePaymentList[i]!.dataValues.id,
							end_date: new_end_date_string,
						});
					}
			}
			else {
				await this.updateEmployeePayment({
					id: employeePaymentList[i]!.dataValues.id,
					end_date: null,
				});
			}
		}
		await this.updateEmployeePayment({
			id: employeePaymentList[employeePaymentList.length - 1]!.dataValues.id,
			end_date: null,
		});
	}
}
