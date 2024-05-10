import { injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { type z } from "zod";
import {
	createEmployeeDataService,
	updateEmployeeDataByEmpNoService,
	updateEmployeeDataService,
} from "../api/types/parameters_input_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";


@injectable()
export class EmployeeDataService {
	/* constructor() {} */

	async createEmployeeData({
		emp_no,
		emp_name,
		position_level,
		position_type,
		ginsurance_type,
		department,
		work_type,
		work_status,
		accessible,
		sex_type,
		dependents,
		healthcare_dependents,
		registration_date,
		quit_date,
		licens_id,
		nbanknumber,
	}: z.infer<typeof createEmployeeDataService>): Promise<EmployeeData> {
		const newData = await EmployeeData.create({
			emp_no: emp_no,
			emp_name: emp_name,
			position_level: position_level,
			position_type: position_type,
			ginsurance_type: ginsurance_type,
			department: department,
			work_type: work_type,
			work_status: work_status,
			accessible: accessible,
			sex_type: sex_type,
			dependents: dependents,
			healthcare_dependents: healthcare_dependents,
			registration_date: registration_date,
			quit_date: quit_date,
			licens_id: licens_id,
			nbanknumber: nbanknumber,
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
		});
		return employeeData;
	}

	async getCurrentEmployeeData(): Promise<EmployeeData[]> {
		const employeeData = await EmployeeData.findAll({});
		return employeeData;
	}

	async getAllEmployeeData(): Promise<EmployeeData[]> {
		const employeeData = await EmployeeData.findAll({ raw: true });
		return employeeData;
	}

	async updateEmployeeData({
		id,
		emp_no: emp_no,
		emp_name: emp_name,
		position_level: position_level,
		position_type: position_type,
		ginsurance_type: ginsurance_type,
		department: department,
		work_type: work_type,
		work_status: work_status,
		accessible: accessible,
		sex_type: sex_type,
		dependents: dependents,
		healthcare_dependents: healthcare_dependents,
		registration_date: registration_date,
		quit_date: quit_date,
		licens_id: licens_id,
		nbanknumber: nbanknumber,
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
				accessible: select_value(accessible, employeeData.accessible),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare_dependents: select_value(healthcare_dependents, employeeData.healthcare_dependents),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				licens_id: select_value(licens_id, employeeData.licens_id),
				nbanknumber: select_value(
					nbanknumber,
					employeeData.nbanknumber
				),
				position_level: select_value(position_level, employeeData.position_level),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				ginsurance_type: select_value(
					ginsurance_type,
					employeeData.ginsurance_type
				),
				department: select_value(department, employeeData.department),

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
		position_level: position_level,
		position_type: position_type,
		ginsurance_type: ginsurance_type,
		department: department,
		work_type: work_type,
		work_status: work_status,
		accessible: accessible,
		sex_type: sex_type,
		dependents: dependents,
		healthcare_dependents: healthcare_dependents,
		registration_date: registration_date,
		quit_date: quit_date,
		licens_id: licens_id,
		nbanknumber: nbanknumber,
	}: z.infer<typeof updateEmployeeDataByEmpNoService>): Promise<void> {
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
				accessible: select_value(accessible, employeeData.accessible),
				sex_type: select_value(sex_type, employeeData.sex_type),
				dependents: select_value(dependents, employeeData.dependents),
				healthcare_dependents: select_value(healthcare_dependents, employeeData.healthcare_dependents),
				registration_date: select_value(
					registration_date,
					employeeData.registration_date
				),
				quit_date: select_value(quit_date, employeeData.quit_date),
				licens_id: select_value(licens_id, employeeData.licens_id),
				nbanknumber: select_value(
					nbanknumber,
					employeeData.nbanknumber
				),
				position_level: select_value(position_level, employeeData.position_level),
				position_type: select_value(
					position_type,
					employeeData.position_type
				),
				ginsurance_type: select_value(
					ginsurance_type,
					employeeData.ginsurance_type
				),
				department: select_value(department, employeeData.department),

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
