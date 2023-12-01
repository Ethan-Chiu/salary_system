import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { z } from "zod";
import {
	createEmployeeAccountService,
	updateEmployeeAccountService,
} from "../api/input_type/parameters_input";
import { EmployeeAccount } from "../database/entity/employee_account";

@injectable()
export class EmployeeAccountService {
	constructor() {}

	async createEmployeeAccount({
		emp_id,
        bank_account,
        ratio,
	}: z.infer<typeof createEmployeeAccountService>): Promise<EmployeeAccount> {
		const newData = await EmployeeAccount.create({
			emp_id: emp_id,
            bank_account: bank_account,
            ratio: ratio,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getEmployeeAccountById(id: number): Promise<EmployeeAccount | null> {
		const employeeAccount = await EmployeeAccount.findOne({
			where: {
				id: id,
			},
		});
		return employeeAccount;
	}

	async getCurrentEmployeeAccount(): Promise<EmployeeAccount[]> {
		const now = Date();
		const employeeAccount = await EmployeeAccount.findAll({
		});
		return employeeAccount;
	}

	async getAllEmployeeAccount(): Promise<EmployeeAccount[]> {
		const bankSetting = await EmployeeAccount.findAll();
		return bankSetting;
	}

	async updateEmployeeAccount({
		id,
		emp_id,
        bank_account,
        ratio,
	}: z.infer<typeof updateEmployeeAccountService>): Promise<void> {
		const employeeAccount = await this.getEmployeeAccountById(id!);
		if (employeeAccount == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeAccount.update(
			{
				emp_id: select_value(emp_id, employeeAccount.emp_id),
				bank_account: select_value(bank_account, employeeAccount),
                ratio: select_value(ratio, employeeAccount.ratio),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteEmployeeAcount(id: number): Promise<void> {
		//TODO
	}
}
