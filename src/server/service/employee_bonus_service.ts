import { container, injectable } from "tsyringe";
import { type z } from "zod";
import {
	createEmployeeBonusService,
	updateEmployeeBonusService,
} from "../api/types/parameters_input_type";
import { EmployeeBonus } from "../database/entity/SALARY/employee_bonus";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { Round, select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { BonusWorkTypeService } from "./bonus_work_type_service";
import { BonusPositionTypeService } from "./bonus_position_type_service";
import { BonusPositionService } from "./bonus_position_service";
import { BonusSeniorityService } from "./bonus_seniority_service";
import { BonusDepartmentService } from "./bonus_department_service";
import { EmployeeDataService } from "./employee_data_service";
import { EHRService } from "./ehr_service";
import { BonusWorkType } from "../database/entity/SALARY/bonus_work_type";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { BonusPositionType } from "../database/entity/SALARY/bonus_position_type";
import { BonusPosition } from "../database/entity/SALARY/bonus_position";
import { BonusSeniority } from "../database/entity/SALARY/bonus_seniority";
import { BonusDepartment } from "../database/entity/SALARY/bonus_department";
import { Op } from "sequelize";
import { EmployeePaymentService } from "./employee_payment_service";
import { EmployeePaymentMapper } from "../database/mapper/employee_payment_mapper";

@injectable()
export class EmployeeBonusService {
	async createEmployeeBonus({
		period_id,
		bonus_type,
		emp_no,
		special_multiplier,
		multiplier,
		fixed_amount,
		budget_effective_salary,
		budget_amount,
		supervisor_performance_level,
		supervisor_effective_salary,
		supervisor_amount,
		approved_performance_level,
		approved_effective_salary,
		approved_amount,
	}: z.infer<typeof createEmployeeBonusService>) {
		const newData = await EmployeeBonus.create({
			period_id: period_id,
			bonus_type: bonus_type,
			emp_no: emp_no,
			special_multiplier: special_multiplier,
			multiplier: multiplier,
			fixed_amount: fixed_amount,
			budget_effective_salary: budget_effective_salary,
			budget_amount: budget_amount,
			supervisor_performance_level: supervisor_performance_level,
			supervisor_effective_salary: supervisor_effective_salary,
			supervisor_amount: supervisor_amount,
			approved_performance_level: approved_performance_level,
			approved_effective_salary: approved_effective_salary,
			approved_amount: approved_amount,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}
	async createEmployeeBonusByEmpNoList(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		emp_no_list: string[]
	) {
		const employeeBonus = await this.getAllEmployeeBonus(
			period_id,
			bonus_type
		);
		const promises = emp_no_list.map(async (emp_no) => {
			if (employeeBonus.find((e) => e.emp_no === emp_no)) {
				return;
			}
			await this.createEmployeeBonus({
				period_id: period_id,
				bonus_type: bonus_type,
				emp_no: emp_no,
				special_multiplier: 0,
				multiplier: 0,
				fixed_amount: 0,
				budget_effective_salary: 0,
				budget_amount: 0,
				supervisor_performance_level: null,
				supervisor_effective_salary: null,
				supervisor_amount: null,
				approved_performance_level: null,
				approved_effective_salary: null,
				approved_amount: null,
			});
		});

		await Promise.all(promises);
	}

	async getEmployeeBonusByEmpNo(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		emp_no: string
	) {
		const result = await EmployeeBonus.findOne({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				emp_no: emp_no,
			},
		});
		return result;
	}

	async getAllEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType
	) {
		const result = await EmployeeBonus.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
			},
			order: [["emp_no", "ASC"]],
		});
		return result;
	}

	async getEmployeeBonus(period_id: number, bonus_type: BonusTypeEnumType) {
		const result = await EmployeeBonus.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				special_multiplier: {
					[Op.gt]: 0,
				},
			},
			order: [["emp_no", "ASC"]],
		});
		return result;
	}

	async getEmployeeBonusById(id: number) {
		const result = await EmployeeBonus.findByPk(id);
		return result;
	}

	async initCandidateEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType
	) {
		const all_emp_bonus_list = await this.getAllEmployeeBonus(
			period_id,
			bonus_type
		);
		const bonus_work_type_service = container.resolve(BonusWorkTypeService);
		const bonus_position_service = container.resolve(BonusPositionService);
		const bonus_position_type_service = container.resolve(
			BonusPositionTypeService
		);
		const bonus_seniority_service = container.resolve(
			BonusSeniorityService
		);
		const bonus_department_service = container.resolve(
			BonusDepartmentService
		);
		const ehr_service = container.resolve(EHRService);
		const bonus_work_type_list =
			await bonus_work_type_service.getBonusWorkTypeByBonusType(
				period_id,
				bonus_type
			);
		const bonus_position_list =
			await bonus_position_service.getBonusPositionByBonusType(
				period_id,
				bonus_type
			);
		const bonus_position_type_list =
			await bonus_position_type_service.getBonusPositionTypeByBonusType(
				period_id,
				bonus_type
			);
		const bonus_seniority_list =
			await bonus_seniority_service.getBonusSeniorityByBonusType(
				period_id,
				bonus_type
			);
		const bonus_department_list =
			await bonus_department_service.getBonusDepartmentByBonusType(
				period_id,
				bonus_type
			);
		const employee_data_service = container.resolve(EmployeeDataService);
		const issue_date = (await ehr_service.getPeriodById(period_id))
			.issue_date;

		const promises = all_emp_bonus_list.map(async (emp) => {
			let employee_data =
				await employee_data_service.getEmployeeDataByEmpNo(emp.emp_no);
			if (!employee_data) {
				return;
			}
			const special_multiplier =
				this.getBonusWorkTypeSpecialMultiplier(
					bonus_work_type_list,
					employee_data
				) *
				this.getBonusPositionSpecialMultiplier(
					bonus_position_list,
					employee_data
				) *
				this.getBonusPositionTypeSpecialMultiplier(
					bonus_position_type_list,
					employee_data
				) *
				this.getBonusSenioritySpecialMultiplier(
					bonus_seniority_list,
					employee_data,
					issue_date
				) *
				this.getBonusDepartmentSpecialMultiplier(
					bonus_department_list,
					employee_data
				);
			await this.updateEmployeeBonus({
				id: emp.id,
				special_multiplier: special_multiplier,
			});
		});

		await Promise.all(promises);
		// const candidatelist = (await this.getAllEmployeeBonus(period_id, bonus_type)).filter(e => e.special_multiplier !== 0);
		// return candidatelist;
	}

	getBonusWorkTypeSpecialMultiplier(
		bonus_work_type_list: BonusWorkType[] | null,
		employee_data: EmployeeData
	): number {
		if (!bonus_work_type_list) {
			return 0;
		}
		const candidate_bonus_work_type = bonus_work_type_list.filter(
			(e) => e.work_type === employee_data.work_type
		)[0];
		if (!candidate_bonus_work_type) {
			return 0;
		}
		return candidate_bonus_work_type.multiplier;
	}

	getBonusPositionSpecialMultiplier(
		bonus_position_list: BonusPosition[] | null,
		employee_data: EmployeeData
	): number {
		if (!bonus_position_list) {
			return 0;
		}
		const candidate_bonus_position = bonus_position_list.filter(
			(e) => e.position === employee_data.position
		)[0];
		if (!candidate_bonus_position) {
			return 0;
		}
		return candidate_bonus_position.multiplier;
	}

	getBonusPositionTypeSpecialMultiplier(
		bonus_position_type_list: BonusPositionType[] | null,
		employee_data: EmployeeData
	): number {
		if (!bonus_position_type_list) {
			return 0;
		}
		const candidate_bonus_position_type = bonus_position_type_list.filter(
			(e) => e.position_type === employee_data.position_type
		)[0];
		if (!candidate_bonus_position_type) {
			return 0;
		}
		return candidate_bonus_position_type.multiplier;
	}

	getBonusSenioritySpecialMultiplier(
		bonus_seniority_list: BonusSeniority[] | null,
		employee_data: EmployeeData,
		issue_date: string
	): number {
		if (!bonus_seniority_list) {
			return 0;
		}
		const seniority = Math.floor(
			(new Date(issue_date).getTime() -
				new Date(employee_data.registration_date).getTime()) /
				(1000 * 60 * 60 * 24 * 365)
		);
		const candidate_bonus_seniority = bonus_seniority_list.filter(
			(e) => e.seniority === seniority
		)[0];
		if (!candidate_bonus_seniority) {
			return 0;
		}
		return candidate_bonus_seniority.multiplier;
	}

	getBonusDepartmentSpecialMultiplier(
		bonus_department_list: BonusDepartment[] | null,
		employee_data: EmployeeData
	): number {
		if (!bonus_department_list) {
			return 0;
		}
		const candidate_bonus_department = bonus_department_list.filter(
			(e) =>
				e.department ===
				employee_data.department
					.replaceAll("\n", "")
					.replaceAll("\r", "")
		)[0];
		if (!candidate_bonus_department) {
			return 0;
		}
		return candidate_bonus_department.multiplier;
	}

	async deleteEmployeeBonus(id: number) {
		const result = await EmployeeBonus.destroy({
			where: {
				id: id,
			},
		});
		return result;
	}

	async updateEmployeeBonus({
		id,
		period_id,
		bonus_type,
		emp_no,
		special_multiplier,
		multiplier,
		fixed_amount,
		budget_effective_salary,
		budget_amount,
		supervisor_performance_level,
		supervisor_effective_salary,
		supervisor_amount,
		approved_performance_level,
		approved_effective_salary,
		approved_amount,
	}: z.infer<typeof updateEmployeeBonusService>) {
		const employeeBonus = await this.getEmployeeBonusById(id!);
		if (employeeBonus == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeBonus.update(
			{
				emp_no: select_value(emp_no, employeeBonus.emp_no),
				period_id: select_value(period_id, employeeBonus.period_id),
				bonus_type: select_value(bonus_type, employeeBonus.bonus_type),
				special_multiplier: select_value(
					special_multiplier,
					employeeBonus.special_multiplier
				),
				multiplier: select_value(multiplier, employeeBonus.multiplier),
				fixed_amount: select_value(
					fixed_amount,
					employeeBonus.fixed_amount
				),
				budget_effective_salary: select_value(
					budget_effective_salary,
					employeeBonus.budget_effective_salary
				),
				budget_amount: select_value(
					budget_amount,
					employeeBonus.budget_amount
				),
				supervisor_performance_level: select_value(
					supervisor_performance_level,
					employeeBonus.supervisor_performance_level
				),
				supervisor_effective_salary: select_value(
					supervisor_effective_salary,
					employeeBonus.supervisor_effective_salary
				),
				supervisor_amount: select_value(
					supervisor_amount,
					employeeBonus.supervisor_amount
				),
				approved_performance_level: select_value(
					approved_performance_level,
					employeeBonus.approved_performance_level
				),
				approved_effective_salary: select_value(
					approved_effective_salary,
					employeeBonus.approved_effective_salary
				),
				approved_amount: select_value(
					approved_amount,
					employeeBonus.approved_amount
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}
	async updateFromExcel(
		force: boolean,
		{
			period_id,
			bonus_type,
			emp_no,
			special_multiplier,
			multiplier,
			fixed_amount,
			budget_effective_salary,
			budget_amount,
			supervisor_performance_level,
			supervisor_effective_salary,
			supervisor_amount,
			approved_performance_level,
			approved_effective_salary,
			approved_amount,
		}: z.infer<typeof updateEmployeeBonusService>
	) {
		let error = false;
		const employeeBonus = await this.getEmployeeBonusByEmpNo(
			period_id!,
			bonus_type!,
			emp_no!
		);
		if (
			employeeBonus?.supervisor_performance_level ||
			employeeBonus?.supervisor_effective_salary ||
			employeeBonus?.supervisor_amount ||
			employeeBonus?.approved_performance_level ||
			employeeBonus?.approved_effective_salary ||
			employeeBonus?.approved_amount
		) {
			error = true;
		}
		if (force || !error) {
			const affectedCount = await EmployeeBonus.update(
				{
					supervisor_performance_level: select_value(
						supervisor_performance_level,
						employeeBonus!.supervisor_performance_level
					),
					supervisor_effective_salary: select_value(
						supervisor_effective_salary,
						employeeBonus!.supervisor_effective_salary
					),
					supervisor_amount: select_value(
						supervisor_amount,
						employeeBonus!.supervisor_amount
					),
					approved_performance_level: select_value(
						approved_performance_level,
						employeeBonus!.approved_performance_level
					),
					approved_effective_salary: select_value(
						approved_effective_salary,
						employeeBonus!.approved_effective_salary
					),
					approved_amount: select_value(
						approved_amount,
						employeeBonus!.approved_amount
					),
					update_by: "system",
				},
				{ where: { id: employeeBonus!.id } }
			);
			if (affectedCount[0] == 0) {
				throw new BaseResponseError("Update error");
			}
		}
		return error ? emp_no : null;
	}
	async autoCalculateEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		total_budgets: number
	) {
		const budget_amount_list: { emp_no: string; budget_amount: number }[] =
			[];
		const emp_no_list = (
			await this.getAllEmployeeBonus(period_id, bonus_type)
		).map((e) => e.emp_no);
		const promises = emp_no_list.map(async (emp_no) => {
			const employee_bonus = await this.getEmployeeBonusByEmpNo(
				period_id,
				bonus_type,
				emp_no
			);
			if (!employee_bonus) {
				return;
			}
			const employee_payment_service = container.resolve(
				EmployeePaymentService
			);
			const employee_payment_mapper = container.resolve(
				EmployeePaymentMapper
			);
			const employee_payment =
				await employee_payment_service.getCurrentEmployeePaymentByEmpNo(
					emp_no,
					period_id
				);
			if (!employee_payment) {
				return;
			}
			const employee_payment_fe =
				await employee_payment_mapper.getEmployeePaymentFE(
					employee_payment
				);

			const budget_amount =
				(employee_payment_fe.base_salary +
					employee_payment_fe.food_allowance +
					employee_payment_fe.supervisor_allowance +
					employee_payment_fe.occupational_allowance +
					employee_payment_fe.subsidy_allowance) *
					employee_bonus.special_multiplier *
					employee_bonus.multiplier +
				employee_bonus.fixed_amount;

			budget_amount_list.push({
				emp_no: emp_no,
				budget_amount: budget_amount,
			});
		});

		await Promise.all(promises);

		const total_budget_amount = budget_amount_list
			.map((e) => e.budget_amount)
			.reduce((a, b) => a + b, 0);
		const ratio = total_budgets / total_budget_amount;
		budget_amount_list.forEach(
			(e) => (e.budget_amount = Round(e.budget_amount * ratio, 1))
		);

		const promises2 = budget_amount_list.map(async (e) => {
			const employee_bonus = await this.getEmployeeBonusByEmpNo(
				period_id,
				bonus_type,
				e.emp_no
			);
			if (!employee_bonus) {
				return;
			}
			await this.updateEmployeeBonus({
				id: employee_bonus.id,
				budget_amount: e.budget_amount,
			});
		});

		await Promise.all(promises2);
	}
}
