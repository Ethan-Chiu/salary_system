import { container, injectable } from "tsyringe";
import { type z } from "zod";
import {
	createEmployeeBonusService,
	updateEmployeeBonusService,
} from "../api/types/parameters_input_type";
import { EmployeeBonus } from "../database/entity/SALARY/employee_bonus";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";
import { BonusWorkTypeService } from "./bonus_work_type_service";
import { BonusPositionTypeService } from "./bonus_position_type_service";
import { BonusPositionService } from "./bonus_position_service";
import { BonusSeniorityService } from "./bonus_seniority_service";
import { BonusDepartmentService } from "./bonus_department_service";
import { EmployeeDataService } from "./employee_data_service";
import { EHRService } from "./ehr_service";

@injectable()
export class EmployeeBonusService {
	async createEmployeeBonus({
		period_id,
		bonus_type,
		emp_no,
		special_multiplier,
		multiplier,
		fixed_amount,
		budget_amount,
		superviser_amount,
		final_amount,
	}: z.infer<typeof createEmployeeBonusService>) {
		const newData = await EmployeeBonus.create({
			period_id: period_id,
			bonus_type: bonus_type,
			emp_no: emp_no,
			special_multiplier: special_multiplier,
			multiplier: multiplier,
			budget_amount: budget_amount,
			superviser_amount: superviser_amount,
			final_amount: final_amount,
			// received_elderly_benefits: received_elderly_benefits,
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
		emp_no_list.forEach(async (emp_no) => {
			await this.createEmployeeBonus({
				period_id: period_id,
				bonus_type: bonus_type,
				emp_no: emp_no,
				special_multiplier: 1,
				multiplier: null,
				fixed_amount: null,
				budget_amount: null,
				superviser_amount: null,
				final_amount: null,
			});
		});
	}
	async getEmployeeBonusByEmpNo(emp_no: string) {
		const result = await EmployeeBonus.findOne({
			where: {
				emp_no: emp_no,
			},
		});
		return result;
	}
	async getEmployeeBonusByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	) {
		const result = await EmployeeBonus.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
			},
		});
		return result;
	}

	async getEmployeeBonusById(id: number) {
		const result = await EmployeeBonus.findByPk(id);
		return result;
	}

	async getAllEmployeeBonus() {
		const result = await EmployeeBonus.findAll();
		return result;
	}
	async getCandidateEmployeeBonus(
		period_id: number,
		bonus_type: BonusTypeEnumType
	) {
		const all_emp_bonus_list = await this.getEmployeeBonusByBonusType(
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
		const candidatelist = all_emp_bonus_list
			.filter(async (emp) => {
				let employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						emp.emp_no
					);
				return bonus_work_type_list
					?.map((e) => e.work_type)
					.includes(employee_data!.work_type);
			})
			.filter(async (emp) => {
				let employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						emp.emp_no
					);
				return bonus_position_list
					?.map((e) => e.position)
					.includes(employee_data!.position);
			})
			.filter(async (emp) => {
				let employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						emp.emp_no
					);
				return bonus_position_type_list
					?.map((e) => e.position_type)
					.includes(employee_data!.position_type);
			})
			.filter(async (emp) => {
				let employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						emp.emp_no
					);
				const seniority = Math.floor(
					(new Date(issue_date).getTime() -
						new Date(employee_data!.registration_date).getTime()) /
						(1000 * 60 * 60 * 24 * 365)
				);
				// const test = +new Date() - +new Date(employee_data!.registration_date);
				return bonus_seniority_list
					?.map((e) => e.seniority)
					.includes(seniority);
			})
			.filter(async (emp) => {
				let employee_data =
					await employee_data_service.getEmployeeDataByEmpNo(
						emp.emp_no
					);
				return bonus_department_list
					?.map((e) => e.department)
					.includes(employee_data!.department);
			});
		candidatelist.forEach(async (emp) => {
			let employee_data =
				await employee_data_service.getEmployeeDataByEmpNo(emp.emp_no);
			emp.special_multiplier =
				bonus_work_type_list!.filter(
					(e) => e.work_type === employee_data!.work_type
				)[0]!.multiplier! *
				bonus_position_list!.filter(
					(e) => e.position === employee_data?.position
				)[0]!.multiplier *
				bonus_position_type_list!.filter(
					(e) => e.position_type === employee_data?.position_type
				)[0]!.multiplier *
				bonus_seniority_list!.filter(
					(e) =>
						e.seniority ===
						Math.floor(
							(new Date(issue_date).getTime() -
								new Date(
									employee_data!.registration_date
								).getTime()) /
								(1000 * 60 * 60 * 24 * 365)
						)
				)[0]!.multiplier *
				bonus_department_list!.filter(
					(e) => e.department === employee_data?.department
				)[0]!.multiplier;
		});
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
        multiplier,
		budget_amount,
		superviser_amount,
		final_amount,
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
                multiplier: select_value(multiplier, employeeBonus.multiplier),
				budget_amount: select_value(
					budget_amount,
					employeeBonus.budget_amount
				),
				superviser_amount: select_value(
					superviser_amount,
					employeeBonus.superviser_amount
				),
				final_amount: select_value(
					final_amount,
					employeeBonus.final_amount
				),
				// received_elderly_benefits: select_value(
				// 	received_elderly_benefits,
				// 	employeeData.received_elderly_benefits
				// ),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}
}