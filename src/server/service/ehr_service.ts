import { injectable } from "tsyringe";
import { container } from "tsyringe";
import { Database } from "../database/client";
import { QueryTypes } from "sequelize";
import { Period } from "../database/entity/UMEDIA/period";
import { Holiday } from "../database/entity/UMEDIA/holiday";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { Payset } from "../database/entity/UMEDIA/payset";
import { EmployeeData } from "../database/entity/SALARY/employee_data";

@injectable()
export class EHRService {
	constructor() {}

	async getPeriod(): Promise<Period[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(this.GET_PERIOD_QUERY(), {
			type: QueryTypes.SELECT,
		});
		const periodList: Period[] = dataList.map(Period.fromDB);

		return periodList;
	}

	async getHoliday(period_id: number): Promise<Holiday[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_Holiday_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const holidayList: Holiday[] = dataList.map(Holiday.fromDB);

		return holidayList;
	}

	async getOvertime(period_id: number): Promise<Overtime[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_OVERTIME_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const overtimeList: Overtime[] = dataList.map(Overtime.fromDB);

		return overtimeList;
	}

	async getPayset(period_id: number): Promise<Payset[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_PAYSET_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const paysetList: Payset[] = dataList.map(Payset.fromDB);

		return paysetList;
	}

	//fake
	async getEmployeeDataByEmpNo(emp_no: string): Promise<any> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_EMPLOYEE_DATA_QUERY(emp_no),
			{
				type: QueryTypes.SELECT,
			}
		);
		const employeeData: Payset[] = dataList.map(Payset.fromDB);
		return employeeData;
	}

	private GET_PERIOD_QUERY(): string {
		return `SELECT "PERIOD_ID", "PERIOD_NAME", "START_DATE", "END_DATE", "STATUS", "ISSUE_DATE" FROM "U_HR_PERIOD" WHERE "U_HR_PERIOD"."STATUS" = 'OPEN'`;
	}

	private GET_Holiday_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_HOLIDAYS_V" WHERE "U_HR_PAYDRAFT_HOLIDAYS_V"."PERIOD_ID" = '${period_id}'`;
	}

	private GET_OVERTIME_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_OVERTIME_V" WHERE "U_HR_PAYDRAFT_OVERTIME_V"."PERIOD_ID" = '${period_id}'`;
	}

	private GET_PAYSET_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYSET_V" WHERE "U_HR_PAYSET_V"."PERIOD_ID" = '${period_id}'`;
	}

	private GET_EMPLOYEE_DATA_QUERY(emp_no: string): string {
		return `SELECT * FROM "U_HR_PAYSET_V" WHERE "U_HR_PAYSET_V"."EMP_NO" = '${emp_no}'`;
	}
}
