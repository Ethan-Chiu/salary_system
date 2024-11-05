import { injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { type z } from "zod";
import {
	createEmployeeDataService,
	updateEmployeeDataByEmpNoService,
	updateEmployeeDataService,
} from "../api/types/employee_data_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";

@injectable()
export class EmployeeDataService {
	/* constructor() {} */

	async createEmployeeData({
		period_id,
		emp_no,
		emp_name,
		position,
		position_type,
		group_insurance_type,
		department,
		work_type,
		work_status,
		disabilty_level,
		sex_type,
		dependents,
		healthcare_dependents,
		registration_date,
		quit_date,
		license_id,
		bank_account,
		// accumulated_bonus,
	}: // received_elderly_benefits,
		z.infer<typeof createEmployeeDataService>): Promise<EmployeeData> {
		const newData = await EmployeeData.create({
			period_id: period_id,
			emp_no: emp_no,
			emp_name: emp_name,
			position: position,
			position_type: position_type,
			group_insurance_type: group_insurance_type,
			department: department,
			work_type: work_type,
			work_status: work_status,
			disabilty_level: disabilty_level,
			sex_type: sex_type,
			dependents: dependents,
			healthcare_dependents: healthcare_dependents,
			registration_date: registration_date,
			quit_date: quit_date,
			license_id: license_id,
			bank_account: bank_account,
			// accumulated_bonus: accumulated_bonus,
			// received_elderly_benefits: received_elderly_benefits,
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
	async getEmployeeDataByEmpNo(emp_no: string): Promise<EmployeeData | null> {
		const employeeData = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
			},
			raw: true,
		});
		return employeeData;
	}

	async getCurrentEmployeeData(): Promise<EmployeeData[]> {
		const employeeData = await this.getAllEmployeeData();
		return employeeData;
	}

	async getAllEmployeeData(): Promise<EmployeeData[]> {
		const employeeData = await EmployeeData.findAll({
			raw: true,
			order: [["emp_no", "ASC"]],
		});
		return employeeData;
	}

	async updateEmployeeData({
		id,
		emp_no: emp_no,
		emp_name: emp_name,
		position: position,
		position_type: position_type,
		group_insurance_type: group_insurance_type,
		department: department,
		work_type: work_type,
		work_status: work_status,
		disabilty_level: disabilty_level,
		sex_type: sex_type,
		dependents: dependents,
		healthcare_dependents: healthcare_dependents,
		registration_date: registration_date,
		quit_date: quit_date,
		license_id: license_id,
		bank_account: bank_account,
		// accumulated_bonus: accumulated_bonus,
	}: // received_elderly_benefits: received_elderly_benefits,
		z.infer<typeof updateEmployeeDataService>): Promise<void> {
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
				disabilty_level: select_value(
					disabilty_level,
					employeeData.disabilty_level
				),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare_dependents: select_value(
					healthcare_dependents,
					employeeData.healthcare_dependents
				),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				license_id: select_value(license_id, employeeData.license_id),
				bank_account: select_value(
					bank_account,
					employeeData.bank_account
				),
				position: select_value(position, employeeData.position),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				group_insurance_type: select_value(
					group_insurance_type,
					employeeData.group_insurance_type
				),
				department: select_value(department, employeeData.department),
				// accumulated_bonus: select_value(
				// 	accumulated_bonus,
				// 	employeeData.accumulated_bonus
				// ),
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

	async updateEmployeeDataByEmpNo({
		emp_no: emp_no,
		emp_name: emp_name,
		position: position,
		position_type: position_type,
		group_insurance_type: group_insurance_type,
		department: department,
		work_type: work_type,
		work_status: work_status,
		disabilty_level: disabilty_level,
		sex_type: sex_type,
		dependents: dependents,
		healthcare_dependents: healthcare_dependents,
		registration_date: registration_date,
		quit_date: quit_date,
		license_id: license_id,
		bank_account: bank_account,
	}: // received_elderly_benefits: received_elderly_benefits,
		z.infer<typeof updateEmployeeDataByEmpNoService>): Promise<void> {
		const employeeData = await this.getEmployeeDataByEmpNo(emp_no!);
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
				disabilty_level: select_value(
					disabilty_level,
					employeeData.disabilty_level
				),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare_dependents: select_value(
					healthcare_dependents,
					employeeData.healthcare_dependents
				),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				license_id: select_value(license_id, employeeData.license_id),
				bank_account: select_value(
					bank_account,
					employeeData.bank_account
				),
				position: select_value(position, employeeData.position),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				group_insurance_type: select_value(
					group_insurance_type,
					employeeData.group_insurance_type
				),
				department: select_value(department, employeeData.department),
				// received_elderly_benefits: select_value(
				// 	received_elderly_benefits,
				// 	employeeData.received_elderly_benefits
				// ),
				update_by: "system",
			},
			{ where: { emp_no: emp_no } }
		);
		if (affectedCount[0] == 0) {
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
}
