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
import { Bonus } from "../database/entity/UMEDIA/bonus";
import { BonusType } from "../database/entity/UMEDIA/bonus_type";
import { Expense } from "../database/entity/UMEDIA/expense";
import { ExpenseClass } from "../database/entity/UMEDIA/expense_class";
import { AllowanceType } from "../database/entity/UMEDIA/allowance_type";
import { Allowance } from "../database/entity/UMEDIA/allowance";
import { HolidaysTypeService } from "./holidays_type_service";
import { PayTypeEnum, PayTypeEnumType } from "../api/types/pay_type_enum";

export type BonusWithType = Omit<Bonus, "bonus_id" | "period_id"> & {
	period_name: string;
	bonus_type_name: string;
};

export type ExpenseWithType = Omit<Expense, "period_id" | "id"> & {
	period_name: string;
	expense_type_name: string;
};

export type HolidayWithType = Omit<Holiday, "pay_order"> & {
	holiday_type_name: string;
};

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

	async getHolidayByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<Holiday[]> {
		const all_holiday = await this.getHoliday(period_id);
		const filtered_holiday = all_holiday.filter((holiday) =>
			emp_no_list.includes(holiday.emp_no!)
		);
		return filtered_holiday;
	}

	async getHolidayWithTypeByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<HolidayWithType[]> {
		const all_holiday = await this.getHoliday(period_id);
		const holidaysTypeService = container.resolve(HolidaysTypeService);
		const holidays_type =
			await holidaysTypeService.getCurrentHolidaysType();
		const filtered_holiday = all_holiday.filter((holiday) =>
			emp_no_list.includes(holiday.emp_no!)
		);
		const period_name = await this.getPeriodById(period_id).then(
			(period) => period.period_name
		);
		const holidayWithTypeList: HolidayWithType[] = filtered_holiday.map(
			(holiday) => {
				const holidayTypeName = holidays_type.find(
					(holidayType) => holidayType.pay_id === holiday.pay_order
				)?.holidays_name;
				return {
					...holiday,
					holiday_type_name: holidayTypeName!,
					period_name: period_name,
				};
			}
		).sort((a, b) => {
			if (a.emp_no === b.emp_no) {
				return a.pay_order! - b.pay_order!;
			}
			return a.emp_no!.localeCompare(b.emp_no!);
		})
		return holidayWithTypeList;
	}

	async getOvertime(period_id: number, pay: number): Promise<Overtime[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_OVERTIME_QUERY(period_id, pay),
			{
				type: QueryTypes.SELECT,
			}
		);
		const overtimeList: Overtime[] = dataList.map((o) =>
			Overtime.fromDB(o)
		).sort((a, b) => {
			if (a.emp_no === b.emp_no) {
				return a.type_name!.localeCompare(b.type_name!);
			}
			return a.emp_no!.localeCompare(b.emp_no!);
		})

		return overtimeList;
	}

	async getOvertimeByEmpNoList(
		period_id: number,
		emp_no_list: string[],
		pay_type: PayTypeEnumType,
	): Promise<Overtime[]> {
		const pay = pay_type === PayTypeEnum.Enum.foreign_15_bonus ? 2 : 1;
		const all_overtime = await this.getOvertime(period_id, pay);
		const filtered_overtime = all_overtime.filter((overtime) =>
			emp_no_list.includes(overtime.emp_no!)
		);
		return filtered_overtime;
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

	async getPaysetByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<Payset[]> {
		const all_payset = await this.getPayset(period_id);
		const filtered_payset = all_payset.filter((payset) =>
			emp_no_list.includes(payset.emp_no!)
		);
		return filtered_payset;
	}
	async getEmp(period_id: number): Promise<Emp[]> {
		const dbConnection = container.resolve(Database).connection;
		let dataList = await dbConnection.query(this.GET_EMP_QUERY(period_id), {
			type: QueryTypes.SELECT,
		});
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

	async getBonus(period_id: number): Promise<Bonus[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_BONUS_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		// if (dataList.length === 0) {
		// 	throw new BaseResponseError("Bonus Not Found");
		// }
		const bonusList: Bonus[] = dataList.map((o) => Bonus.fromDB(o));
		return bonusList;
	}

	async getBonusByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<Bonus[]> {
		const all_bonus = await this.getBonus(period_id);
		const filtered_bonus = all_bonus.filter((bonus) =>
			emp_no_list.includes(bonus.emp_no!)
		);
		return filtered_bonus;
	}

	async getBonusType(): Promise<BonusType[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(this.GET_BONUS_TYPE_QUERY(), {
			type: QueryTypes.SELECT,
		});
		const bonusTypeList: BonusType[] = dataList.map((o) =>
			BonusType.fromDB(o)
		);
		return bonusTypeList;
	}
	async getBonusWithTypeByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<BonusWithType[]> {
		const all_bonus = await this.getBonus(period_id);
		const filtered_bonus = all_bonus.filter((bonus) =>
			emp_no_list.includes(bonus.emp_no!)
		);
		const bonusTypeList = await this.getBonusType();
		const period_name = await this.getPeriodById(period_id).then(
			(period) => period.period_name
		);
		const bonusWithTypeList: BonusWithType[] = filtered_bonus.map(
			(bonus) => {
				const bonusTypeName = bonusTypeList.find(
					(bonusType) => bonusType.id === bonus.bonus_id
				)?.name;
				return {
					...bonus,
					bonus_type_name: bonusTypeName!,
					period_name: period_name,
				};
			}
		);
		return bonusWithTypeList;
	}

	async getExpense(period_id: number): Promise<Expense[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_EXPENSE_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const expenseList: Expense[] = dataList.map((o) => Expense.fromDB(o));
		return expenseList;
	}

	async getExpenseByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<Expense[]> {
		const all_expense = await this.getExpense(period_id);
		const filtered_expense = all_expense.filter((expense) =>
			emp_no_list.includes(expense.emp_no!)
		);
		return filtered_expense;
	}
	async getExpenseWithTypeByEmpNoList(
		period_id: number,
		emp_no_list: string[]
	): Promise<ExpenseWithType[]> {
		const all_expense = await this.getExpense(period_id);
		const filtered_expense = all_expense.filter((expense) =>
			emp_no_list.includes(expense.emp_no!)
		);
		const expenseTypeList = await this.getExpenseClass();
		const allowance_type_list = await this.getAllowanceType();
		const period_name = await this.getPeriodById(period_id).then(
			(period) => period.period_name
		);
		const expenseWithTypeList: ExpenseWithType[] = filtered_expense.map(
			(expense) => {
				if (expense.kind === 1) {
					const allowanceTypeName = allowance_type_list.find(
						(allowanceType) => allowanceType.id === expense.id
					)?.name;
					return {
						...expense,
						expense_type_name: allowanceTypeName!,
						period_name: period_name,
					};
				} else {
					const expenseTypeName = expenseTypeList.find(
						(expenseType) => expenseType.id === expense.id
					)?.name;
					return {
						...expense,
						expense_type_name: expenseTypeName!,
						period_name: period_name,
					};
				}
			}
		);
		return expenseWithTypeList;
	}
	async getExpenseClass(): Promise<ExpenseClass[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_EXPENSE_CLASS_QUERY(),
			{
				type: QueryTypes.SELECT,
			}
		);
		const expenseClassList: ExpenseClass[] = dataList.map((o) =>
			ExpenseClass.fromDB(o)
		);
		return expenseClassList;
	}

	async getAllowanceType(): Promise<AllowanceType[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_ALLOWANCE_TYPE_QUERY(),
			{
				type: QueryTypes.SELECT,
			}
		);
		const allowanceTypeList: AllowanceType[] = dataList.map((o) =>
			AllowanceType.fromDB(o)
		);
		return allowanceTypeList;
	}

	async getAllowance(period_id: number): Promise<Allowance[]> {
		const dbConnection = container.resolve(Database).connection;
		const dataList = await dbConnection.query(
			this.GET_ALLOWANCE_QUERY(period_id),
			{
				type: QueryTypes.SELECT,
			}
		);
		const allowanceList: Allowance[] = dataList.map((o) =>
			Allowance.fromDB(o)
		);
		return allowanceList;
	}

	async getTargetAllowance(
		allowance_list: Allowance[],
		allowance_type_list: AllowanceType[],
		emp_no: string,
		type_name: string
	) {
		const target_allowance_type = allowance_type_list.find(
			(allowance_type) => allowance_type.name === type_name
		);
		if (!target_allowance_type) {
			throw new BaseResponseError("Allowance Type Not Found");
		}
		const target_allowance = allowance_list.filter(
			(allowance) =>
				allowance.emp_no === emp_no &&
				allowance.allowance_id === target_allowance_type.id
		);
		if (target_allowance.length === 0) {
			return 0;
		}
		let amount = 0;
		target_allowance.forEach((allowance) => {
			amount += allowance.amount!;
		});
		return amount;
	}

	private GET_PERIOD_QUERY(): string {
		return `SELECT "PERIOD_ID", "PERIOD_NAME", "START_DATE", "END_DATE", "STATUS", "ISSUE_DATE" FROM "U_HR_PERIOD" WHERE "U_HR_PERIOD"."STATUS" = 'OPEN'`;
	}

	private GET_Holiday_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_HOLIDAYS_V" WHERE "U_HR_PAYDRAFT_HOLIDAYS_V"."PERIOD_ID" = '${period_id}'`;
	}

	private GET_OVERTIME_QUERY(period_id: number, pay: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_OVERTIME_V" WHERE "U_HR_PAYDRAFT_OVERTIME_V"."PERIOD_ID" = '${period_id}' AND "U_HR_PAYDRAFT_OVERTIME_V"."PAY" = '${pay}'`;
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
	private GET_BONUS_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_BONUS" WHERE "U_HR_PAYDRAFT_BONUS"."PERIOD_ID" = '${period_id}'`;
	}
	private GET_BONUS_TYPE_QUERY(): string {
		return `SELECT * FROM UMEDIA."U_HR_BONUS_TYPE"`;
	}
	private GET_EXPENSE_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_EXPENSE" WHERE "U_HR_PAYDRAFT_EXPENSE"."PERIOD_ID" = '${period_id}'`;
	}

	private GET_EXPENSE_CLASS_QUERY(): string {
		return `SELECT * FROM "U_HR_EXPENSE_CLASS"`;
	}
	private GET_ALLOWANCE_TYPE_QUERY(): string {
		return `SELECT * FROM "U_HR_ALLOWANCE_TYPE"`;
	}
	private GET_ALLOWANCE_QUERY(period_id: number): string {
		return `SELECT * FROM "U_HR_PAYDRAFT_ALLOWANCE" WHERE "U_HR_PAYDRAFT_ALLOWANCE"."PERIOD_ID" = '${period_id}'`;
	}
}
