import { z } from "zod";

const dbBonus = z.object({
	PERIOD_ID: z.number(),
	EMP_NO: z.string(),
	EMP_NAME: z.string(),
	BONUS_ID: z.number(),
	AMOUNT: z.number(),
	PAY: z.number(),
	REMARK: z.string(),
});

export class Bonus {
	// id can be undefined during creation when using `autoIncrement`
	period_id: number;
	emp_no: string;
	emp_name: string;
	bonus_id: number;
	amount: number;
	pay: number;
	remark: string;

	constructor(
		period_id: number,
		emp_no: string,
		emp_name: string,
		bonus_id: number,
		amount: number,
		pay: number,
		remark: string
	) {
		this.period_id = period_id;
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.bonus_id = bonus_id;
		this.amount = amount;
		this.pay = pay;
		this.remark = remark;
	}

	static fromDB(db_data: any): Bonus {
		const result = dbBonus.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new Bonus(
			data.PERIOD_ID,
			data.EMP_NO,
			data.EMP_NAME,
			data.BONUS_ID,
			data.AMOUNT,
			data.PAY,
			data.REMARK
		);
	}
}
