import { injectable } from "tsyringe";
import { container } from "tsyringe";
import { Database } from "../database/client";
import { QueryTypes } from "sequelize";
import { Period } from "../database/entity/UMEDIA/period";
import { Holiday } from "../database/entity/UMEDIA/holiday";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { Payset } from "../database/entity/UMEDIA/payset";
import { Emp } from "../database/entity/UMEDIA/emp";
import { BaseResponseError } from "../api/error/BaseResponseError";

@injectable()
export class EHRService {
	async getPeriod(): Promise<Period[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(this.GET_PERIOD_QUERY(), {
			type: QueryTypes.SELECT,
		});
		const periodList: Period[] = dataList.map((o) => Period.fromDB(o));

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
		const holidayList: Holiday[] = dataList.map((o) => Holiday.fromDB(o));

		return holidayList;
	}

	async getHolidayByEmpNoList(period_id: number, emp_no_list: string[]): Promise<Holiday[]> {
		const all_holiday = await this.getHoliday(period_id);
		const filtered_holiday = all_holiday.filter((holiday) => emp_no_list.includes(holiday.emp_no!) );
		return filtered_holiday
	}

	async getOvertime(period_id: number): Promise<Overtime[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_OVERTIME_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const overtimeList: Overtime[] = dataList.map((o) =>
			Overtime.fromDB(o)
		);

		return overtimeList;
	}

	async getOvertimeByEmpNoList(period_id: number, emp_no_list: string[]): Promise<Overtime[]> {
		const all_overtime = await this.getOvertime(period_id);
		const filtered_overtime = all_overtime.filter((overtime) => emp_no_list.includes(overtime.emp_no!) );
		return filtered_overtime
	}

	async getPayset(period_id: number): Promise<Payset[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_PAYSET_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const paysetList: Payset[] = dataList.map((o) => Payset.fromDB(o));

		return paysetList;
	}

	async getPaysetByEmpNoList(period_id: number, emp_no_list: string[]): Promise<Payset[]> {
		const all_payset = await this.getPayset(period_id);
		const filtered_payset = all_payset.filter((payset) => emp_no_list.includes(payset.emp_no!) );
		return filtered_payset
	}
	async getEmp(period_id: number): Promise<Emp[]> {
		const dbConnection = container.resolve(Database).connection;
		let dataList = await dbConnection.query(this.GET_EMP_QUERY(period_id), {
			type: QueryTypes.SELECT,
		});

		function dropColumns(objects: any[], columnsToRemove: any[]) {
			return objects.map((obj) => {
				const modifiedObject = { ...obj };
				columnsToRemove.forEach(
					(column) => delete modifiedObject[column]
				);
				return modifiedObject;
			});
		}

		// Specify the columns you want to drop
		const columnsToRemove = ["PERIOD_ID", "CHANGE_DATE", "CHANGE_MEMO"];
		dataList = dropColumns(dataList, columnsToRemove);
		const empList: Emp[] = dataList.map(Emp.fromDB);
		return empList;
	}
	async getPeriodById(period_id: number): Promise<Period> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_PERIOD_BY_ID_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		if (dataList.length === 0) {
			throw new BaseResponseError("Period Not Found");
		}
		return Period.fromDB(dataList[0]!);
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

	private GET_EMP_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_EMP" WHERE "U_HR_PAYDRAFT_EMP"."PERIOD_ID" = '${period_id}'`;
	}

	private GET_PERIOD_BY_ID_QUERY(period_id: number): string {
		return `SELECT "PERIOD_ID", "PERIOD_NAME", "START_DATE", "END_DATE", "STATUS", "ISSUE_DATE" FROM "U_HR_PERIOD" WHERE "U_HR_PERIOD"."PERIOD_ID" = '${period_id}'`;
	}
}
