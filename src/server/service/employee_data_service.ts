import { container, injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { z } from "zod";
import {
	createEmployeeDataService,
	updateEmployeeDataService,
} from "../api/types/parameters_input_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { IncomingMessage } from "http";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";


export interface CombinedData {
	key: string
   	db_value: any
   	ehr_value: any
	is_different: boolean
  }
export interface PaidEmployee {
	emp_no: string
	name: string
	english_name: string 
	department: string
	work_status: string
	departure_date: string | null
	check: boolean
}


@injectable()
export class EmployeeDataService {
	constructor() {}

	async createEmployeeData({
		emp_no,
		emp_name,
		work_type,
		work_status,
		department,
		position,
		position_type,
		gender,
		group_insurance_type,
		performance_level,
		probationary_period_over,
		old_age_benefit,
		dependents_count,
		h_i_dependents_count,
		hire_date,
		entry_date,
		departure_date,
		identity_number,
		bonus_calculation,
		bonus_ratio,
		disability_level,
		labor_retirement_self_ratio,
		has_esot,
		tax_rate_category,
		nationality,
		registered_address,
		postal_code,
		mailing_address,
		email,
		bank_full_name,
		branch_full_name,
		securities_code,
		securities_account,
		birthdate,
		bank_account,
		//new foreign bank account
		//new 久任獎金
		english_name,
		indigenous_name,
		tax_identification_code,
	}: z.infer<typeof createEmployeeDataService>): Promise<EmployeeData> {
		const now = new Date();

		const newData = await EmployeeData.create({
			emp_no: emp_no,
			emp_name: emp_name,
			work_type: work_type,
			work_status: work_status,
			department: department,
			position: position,
			position_type: position_type,
			gender: gender,
			group_insurance_type: group_insurance_type,
			performance_level: performance_level,
			probationary_period_over: probationary_period_over,
			old_age_benefit: old_age_benefit,
			dependents_count: dependents_count,
			h_i_dependents_count: h_i_dependents_count,
			hire_date: hire_date,
			entry_date: entry_date,
			departure_date: departure_date,
			identity_number: identity_number,
			bonus_calculation: bonus_calculation,
			bonus_ratio: bonus_ratio,
			disability_level: disability_level,
			labor_retirement_self_ratio: labor_retirement_self_ratio,
			has_esot: has_esot,
			tax_rate_category: tax_rate_category,
			nationality: nationality,
			registered_address: registered_address,
			postal_code: postal_code,
			mailing_address: mailing_address,
			email: email,
			bank_full_name: bank_full_name,
			branch_full_name: branch_full_name,
			securities_code: securities_code,
			securities_account: securities_account,
			birthdate: birthdate,
			bank_account: bank_account,
			english_name: english_name,
			indigenous_name: indigenous_name,
			tax_identification_code: tax_identification_code,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getEmployeeDataById(id: number): Promise<EmployeeData | null> {
		const employeeData = await EmployeeData.findOne({
			where: {
				id: id,
			},
		});
		return employeeData;
	}

	async getCurrentEmployeeData(): Promise<EmployeeData[]> {
		const now = Date();
		const employeeData = await EmployeeData.findAll({});
		return employeeData;
	}

	async getAllEmployeeData(): Promise<EmployeeData[]> {
		const employeeData = await EmployeeData.findAll();
		return employeeData;
	}

	async updateEmployeeData({
		id,
		emp_no,
		emp_name,
		work_type,
		work_status,
		department,
		position,
		position_type,
		gender,
		group_insurance_type,
		performance_level,
		probationary_period_over,
		old_age_benefit,
		dependents_count,
		h_i_dependents_count,
		hire_date,
		entry_date,
		departure_date,
		identity_number,
		bonus_calculation,
		bonus_ratio,
		disability_level,
		labor_retirement_self_ratio,
		has_esot,
		tax_rate_category,
		nationality,
		registered_address,
		postal_code,
		mailing_address,
		email,
		bank_full_name,
		branch_full_name,
		securities_code,
		securities_account,
		birthdate,
		bank_account,
		english_name,
		indigenous_name,
		tax_identification_code,
	}: z.infer<typeof updateEmployeeDataService>): Promise<void> {
		const employeeData = await this.getEmployeeDataById(id!);
		if (employeeData == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeData.update(
			{
				emp_no: select_value(emp_no, employeeData.emp_no),
				emp_name: select_value(emp_name, employeeData.emp_name),
				work_type: select_value(work_type, employeeData.work_type),
				work_status: select_value(
					work_status,
					employeeData.work_status
				),
				department: select_value(department, employeeData.department),
				position: select_value(position, employeeData.position),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				gender: select_value(gender, employeeData.gender),
				group_insurance_type: select_value(
					group_insurance_type,
					employeeData.group_insurance_type
				),
				performance_level: select_value(
					performance_level,
					employeeData.performance_level
				),
				probationary_period_over: select_value(
					probationary_period_over,
					employeeData.probationary_period_over
				),
				old_age_benefit: select_value(
					old_age_benefit,
					employeeData.old_age_benefit
				),
				dependents_count: select_value(
					dependents_count,
					employeeData.dependents_count
				),
				h_i_dependents_count: select_value(
					h_i_dependents_count,
					employeeData.h_i_dependents_count
				),
				hire_date: select_value(hire_date, employeeData.hire_date),
				entry_date: select_value(entry_date, employeeData.entry_date),
				departure_date: select_value(
					departure_date,
					employeeData.departure_date
				),
				identity_number: select_value(
					identity_number,
					employeeData.identity_number
				),
				bonus_calculation: select_value(
					bonus_calculation,
					employeeData.bonus_calculation
				),
				bonus_ratio: select_value(
					bonus_ratio,
					employeeData.bonus_ratio
				),
				disability_level: select_value(
					disability_level,
					employeeData.disability_level
				),
				labor_retirement_self_ratio: select_value(
					labor_retirement_self_ratio,
					employeeData.labor_retirement_self_ratio
				),
				has_esot: select_value(has_esot, employeeData.has_esot),
				tax_rate_category: select_value(
					tax_rate_category,
					employeeData.tax_rate_category
				),
				nationality: select_value(
					nationality,
					employeeData.nationality
				),
				registered_address: select_value(
					registered_address,
					employeeData.registered_address
				),
				postal_code: select_value(
					postal_code,
					employeeData.postal_code
				),
				mailing_address: select_value(
					mailing_address,
					employeeData.mailing_address
				),
				email: select_value(email, employeeData.email),
				bank_full_name: select_value(
					bank_full_name,
					employeeData.bank_full_name
				),
				branch_full_name: select_value(
					branch_full_name,
					employeeData.branch_full_name
				),
				securities_code: select_value(
					securities_code,
					employeeData.securities_code
				),
				securities_account: select_value(
					securities_account,
					employeeData.securities_account
				),
				birthdate: select_value(birthdate, employeeData.birthdate),
				bank_account: select_value(
					bank_account,
					employeeData.bank_account
				),
				english_name: select_value(
					english_name,
					employeeData.english_name
				),
				indigenous_name: select_value(
					indigenous_name,
					employeeData.indigenous_name
				),
				tax_identification_code: select_value(
					tax_identification_code,
					employeeData.tax_identification_code
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeeData(id: number): Promise<void> {
		const destroyedRows = await EmployeeData.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}

	async getPaidEmployees(func: string): Promise<PaidEmployee[]> {
		var paid_emps: PaidEmployee[] = [];
		const pay_work_status = ["一般人員", "當月離職人員"];
		if (func == "month_pay") {
			const all_emps = await EmployeeData.findAll({
				attributes: [ "emp_name", "english_name", "department","emp_no", "work_status", "departure_date"],
			});
			console.log('check all emps')
			console.log(all_emps)
			paid_emps = await Promise.all(all_emps.map((emp) => {
				var work_check = true
				var departure_check = false
				if (!pay_work_status.includes(emp.work_status)) {
					work_check = false
				}
				if (emp.work_status != "當月離職人員" && emp.departure_date == null) {
					departure_check = true
				}
				else if (emp.work_status == "當月離職人員" && emp.departure_date != null) {
					const current_month = new Date().getMonth();
					const leaving_month = new Date(emp.departure_date).getMonth();
					if (current_month == leaving_month+1) {
						departure_check = true
					}
				}
				const paid_emp : PaidEmployee = {
					emp_no: emp.emp_no,
					name: emp.emp_name,
					english_name: emp.english_name,
					department: emp.department,
					work_status: emp.work_status,
					departure_date: emp.departure_date,
					check: work_check && departure_check
				}
				return paid_emp
			}))
		}
		return paid_emps
	}

	async checkEmployeeData(
		func: string
	): Promise<CombinedData[][] | undefined> {
		var db_datas = [];
		// const emp_nos = await this.getPayEmployeeNumbers(func);
		if (func == "month_salary") {
			db_datas = await EmployeeData.findAll({
				// where: {
				// 	emp_no: {
				// 		[Op.in]: emp_nos,
				// 	}
				// }
			});
		} else {
			db_datas = await EmployeeData.findAll({});
		}

		const changedDatas = await Promise.all(
			db_datas.map(async (db_data) => {
				// const ehrService = container.resolve(EHRService);
				// const employeeDataService = container.resolve(EmployeeDataService);
				// const ehr_data = await ehrService.getEmployeeDataByEmpNo(db_data.emp_no);
				// await this.updateEmployeeData({id:db_data.id, gender: "female"});
				await this.updateEmployeeData({
					id: db_data.id,
					has_esot: !db_data.has_esot,
				});
				var ehr_data = await this.getEmployeeDataById(db_data.id);
				const excludedKeys = [
					"create_date",
					"create_by",
					"update_date",
					"update_by",
				];
				// const dates = ['hire_date', 'entry_date', 'departure_date', 'birthdate'];
				const keys = Object.keys(db_data.dataValues);
				const combinedDatas = await Promise.all(
					keys.map(async (key) => {
						const db_value = (db_data as any)[key];
						const ehr_value = (ehr_data as any)[key];
						const is_different =
							!excludedKeys.includes(key) &&
							db_value !== ehr_value;
						const combinedData: CombinedData = {
							key: key,
							db_value: db_value,
							ehr_value: ehr_value,
							is_different: is_different,
						};
						return combinedData;
					})
				);

				if (
					combinedDatas.some(
						async (combinedData) =>
							(await combinedData.is_different) === true
					)
				) {
					return combinedDatas;
				}
				return undefined; // Explicitly return undefined for the cases where db_data is equal to ehrData
			})
		);

		// Filter out the undefined values
		const filteredChangeDatas = changedDatas.filter(
			(data): data is CombinedData[] => data !== undefined
		);

		return filteredChangeDatas;
	}
}
