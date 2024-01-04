import { injectable } from "tsyringe";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { Op } from "sequelize";
import { check_date, get_date_string, select_value } from "./helper_function";

@injectable()
export class EmployeeDataService {
	constructor() {}

	async getCurrentEmployeeData(): Promise<EmployeeData[]> {
		const now = Date();
        const current_date_string = get_date_string(new Date());
		const employeeData = await EmployeeData.findAll({
			where: {
				
			},
		});
		return employeeData;
	}
}
