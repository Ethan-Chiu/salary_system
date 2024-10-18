import { z } from "zod";

const dbAllowance = z.object({
	ID: z.number(),
	PERIOD_ID: z.number(),
	EMP_NO: z.string(),
	EMP_NAME: z.string(),
	ALLOWANCE_ID: z.number(),
	AMOUNT: z.number(),
	REMARK: z.string(),
	CREATE_BY: z.string(),
	CREATE_DATE: z.date(),
	UPDATE_BY: z.string(),
	UPDATE_DATE: z.date(),
	PAY_DELAY: z.number(),
});

export class Allowance {
	id: number;
	period_id: number;
	emp_no: string;
	emp_name: string;
	allowance_id: number;
	amount: number;
	remark: string;
	create_by: string;
	create_date: Date;
	update_by: string;
	update_date: Date;
	pay_delay: number;

	constructor(
		id: number,
		period_id: number,
		emp_no: string,
		emp_name: string,
		allowance_id: number,
		amount: number,
		remark: string,
		create_by: string,
		create_date: Date,
		update_by: string,
		update_date: Date,
		pay_delay: number
	) {
		this.id = id;
		this.period_id = period_id;
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.allowance_id = allowance_id;
		this.amount = amount;
		this.remark = remark;
		this.create_by = create_by;
		this.create_date = create_date;
		this.update_by = update_by;
		this.update_date = update_date;
		this.pay_delay = pay_delay;
	}

	static fromDB(db_data: any): Allowance {
		const result = dbAllowance.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new Allowance(
			data.ID,
			data.PERIOD_ID,
			data.EMP_NO,
			data.EMP_NAME,
			data.ALLOWANCE_ID,
			data.AMOUNT,
			data.REMARK,
			data.CREATE_BY,
			data.CREATE_DATE,
			data.UPDATE_BY,
			data.UPDATE_DATE,
			data.PAY_DELAY
		);
	}
}
