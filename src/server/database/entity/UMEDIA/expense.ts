import { z } from "zod";

const dbExpense = z.object({
	PERIOD_ID: z.number(),
	KIND: z.number(),
	EMP_NO: z.string(),
	EMP_NAME: z.string(),
	ID: z.number(),
	AMOUNT: z.string().pipe(z.coerce.number()),
	REMARK: z.string().nullable(),
	CREATE_BY: z.string(),
	CREATE_DATE: z.date(),
	UPDATE_BY: z.string().nullable(),
	UPDATE_DATE: z.date().nullable(),
	PAY_DELAY: z.number().nullable(),
});

export class Expense {
	// id can be undefined during creation when using `autoIncrement`
	period_id: number;
	kind: number;
	emp_no: string;
	emp_name: string;
	id: number;
	amount: number;
	remark: string | null;
	create_by: string;
	create_date: Date;
	update_by: string | null;
	update_date: Date | null;
	pay_delay: number | null;

	constructor(
		period_id: number,
		kind: number,
		emp_no: string,
		emp_name: string,
		id: number,
		amount: number,
		remark: string | null,
		create_by: string,
		create_date: Date,
		update_by: string | null,
		update_date: Date | null,
		pay_delay: number | null
	) {
		this.period_id = period_id;
		this.kind = kind;
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.id = id;
		this.amount = amount;
		this.remark = remark;
		this.create_by = create_by;
		this.create_date = create_date;
		this.update_by = update_by;
		this.update_date = update_date;
		this.pay_delay = pay_delay;
	}

	static fromDB(db_data: any): Expense {
		const result = dbExpense.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new Expense(
			data.PERIOD_ID,
			data.KIND,
			data.EMP_NO,
			data.EMP_NAME,
			data.ID,
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
