import * as bcrypt from "bcrypt";
import { container, injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { z } from "zod";
import { EmployeeData } from "../database/entity/SALARY/employee_data";
import { EmployeePayment } from "../database/entity/SALARY/employee_payment";
import { Period } from "../database/entity/UMEDIA/period";
import { EHRService } from "./ehr_service";
import { Overtime } from "../database/entity/UMEDIA/overtime";

@injectable()
export class CalculateService {
	constructor() {}

	// 平/假日加班費
	async getOvertimeMoney(
		emp_no: string,
		period_id: number,
		overtime_type: "平日" | "假日"
	): Promise<number> {
		// get [Period] by id
		const period: Period = await container
			.resolve(EHRService)
			.getPeriodById(period_id);
		const period_start = period.start_date;
		const period_end = period.end_date ?? new Date();
		// get employee data (data and payment)
		const employee_data = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
			},
		});
		const employee_payment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: period_end,
				},
				end_date: {
					[Op.or]: [{ [Op.eq]: null }, { [Op.gte]: period_end }],
				},
			},
		});
		// get overtime
		const overtime = (
			await container.resolve(EHRService).getOvertime(period_id)
		).find(
			(o: Overtime) =>
				o.emp_no === emp_no && o.type_name === overtime_type
		);
		if (overtime === undefined) {
			console.log("No overtiem [%s] data found", overtime_type);
			return 0;
		}
		const work_type = employee_data?.work_type;
		const work_status = employee_data?.work_status;
		const base_salary = employee_payment?.base_salary ?? 0;
		const t1 = overtime?.hours_134 ?? 0;
		const t2 = overtime?.hours_167 ?? 0;
		const t3 = overtime?.hours_2 ?? 0;
		const t4 = overtime?.hours_267 ?? 0;

		function isForeign() {
			return work_status === "外籍勞工";
		}

		const r1 = isForeign() ? 1 : 1.34;
		const r2 = isForeign() ? 1 : 1.67;
		const r3 = isForeign() ? 1 : 2;
		const r4 = isForeign() ? 1 : 2.67;

		const SALARY_RATE = 1; // 不知道有沒有存
		const salary_rate =
			work_type === "外籍勞工"
				? SALARY_RATE
				: work_status === "離職人員"
				? 0
				: work_status === "日薪"
				? base_salary / 8
				: base_salary / 240;

		console.log(emp_no);
		console.log(base_salary);
		console.log(work_type);
		console.log(work_status);
		console.log("%f, %f, %f, %f", t1, t2, t3, t4);

		const salary = Math.round(
			salary_rate * (t1 * r1 + t2 * r2 + t3 * r3 + t4 * r4)
		);
		console.log(salary);

		return salary;
	}

	// 請假扣款
	async getLeaveDeduction(
		emp_no: string,
		period_id: number
	): Promise<number> {
		// get [Period] by id
		const period: Period = await container
			.resolve(EHRService)
			.getPeriodById(period_id);
		const period_start = period.start_date;
		const period_end = period.end_date ?? new Date();
		// get employee data (data and payment)
		const employee_data = await EmployeeData.findOne({
			where: {
				emp_no: emp_no,
			},
		});
		const employee_payment = await EmployeePayment.findOne({
			where: {
				emp_no: emp_no,
				start_date: {
					[Op.lte]: period_end,
				},
				end_date: {
					[Op.or]: [{ [Op.eq]: null }, { [Op.gte]: period_end }],
				},
			},
		});
		// get leave time
		const leavetime = (
			await container.resolve(EHRService).getHoliday(period_id)
		).find((o: Overtime) => o.emp_no === emp_no);
		if (leavetime === undefined) {
			console.log("No leavetime data of [%s] found", emp_no);
			return 0;
		}
		const work_type = employee_data?.work_type;
		const work_status = employee_data?.work_status;
		const base_salary = employee_payment?.base_salary ?? 0;
		/* bonus
            不知道bonus是啥
        */
		const bonus = 0;

		const t1 = leavetime.compensatory_134 ?? 0;
		const t2 = leavetime.compensatory_167 ?? 0;
		const t3 = leavetime.compensatory_2 ?? 0;
		const t4 = leavetime.compensatory_267 ?? 0;

		function isForeign() {
			return work_status === "外籍勞工" || work_type === "外籍勞工";
		}

		const r1 = isForeign() ? 1 : 1.34;
		const r2 = isForeign() ? 1 : 1.67;
		const r3 = isForeign() ? 1 : 2;
		const r4 = isForeign() ? 1 : 2.67;

		console.log(emp_no);
		console.log(base_salary);
		console.log(work_type);
		console.log(work_status);
		console.log("%f, %f, %f, %f", t1, t2, t3, t4);

		const SALARY_RATE = 1; // 不知道有沒有存最低工資率

		if (isForeign()) {
			return Math.round(SALARY_RATE * t1 + (SALARY_RATE / 2) * t2);
		} else if (work_status === "離職人員") {
			return 0;
		} else {
			return Math.round(
				((base_salary + bonus) / 240) * t1 +
					(((base_salary + bonus) / 240) * t2) / 2
			);
		}
	}
}
