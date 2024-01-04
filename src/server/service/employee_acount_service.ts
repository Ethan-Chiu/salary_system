import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { select_value } from "./helper_function";
import { z } from "zod";
import {
	createEmployeeAccountService,
	updateEmployeeAccountService,
} from "../api/types/parameters_input_type";
import { EmployeeAccount } from "../database/entity/SALARY/employee_account";

@injectable()
export class EmployeeAccountService {
	constructor() {}

	async createEmployeeAccount({
		emp_no,
        bank_account,
        ratio,
	}: z.infer<typeof createEmployeeAccountService>): Promise<EmployeeAccount> {
		const now = new Date();

		const newData = await EmployeeAccount.create({
			emp_no: emp_no,
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
		const employeeAccount = await EmployeeAccount.findAll();
		return employeeAccount;
	}

	async updateEmployeeAccount({
		id,
		emp_no,
        bank_account,
        ratio,
	}: z.infer<typeof updateEmployeeAccountService>): Promise<void> {
		const employeeAccount = await this.getEmployeeAccountById(id!);
		if (employeeAccount == null) {
			throw new BaseResponseError("Employee account does not exist");
		}
		const affectedCount = await EmployeeAccount.update(
			{
				emp_no: select_value(emp_no, employeeAccount.emp_no),
				bank_account: select_value(bank_account, employeeAccount.bank_account),
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
        const destroyedRows = await EmployeeAccount.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
