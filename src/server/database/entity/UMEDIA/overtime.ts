import { z } from "zod";

const dbOvertime = z.object({
	PERIOD_ID: z.number(),
	EMP_NO: z.string(),
	EMP_NAME: z.string(),
	PAY: z.number(),
	TYPE_ID: z.number(),
	DAYS_RADIO: z.string(),
	TYPE_NAME: z.string(),
	PAY_PERIOD: z.number().nullable(),
	PERIOD_NAME: z.string().nullable(),
	PAY_DELAY: z.number().nullable(),
	HOURS_1: z.number(),
	HOURS_134: z.number(),
	HOURS_167: z.number(),
	HOURS_267: z.number(),
	HOURS_2: z.number(),
	HOURS_134_TAX: z.number(),
	HOURS_167_TAX: z.number(),
	HOURS_267_TAX: z.number(),
	HOURS_2_TAX: z.number(),
});

export class Overtime {
	// id can be undefined during creation when using `autoIncrement`
	period_id: number;
	emp_no: string;
	emp_name: string;
	pay: number;
	type_id: number;
	days_radio: string;
	type_name: string;
	pay_period: number | null;
	period_name: string | null;
	pay_delay: number | null;
	hours_1: number;
	hours_134: number;
	hours_167: number;
	hours_267: number;
	hours_2: number;
	hours_134_TAX: number;
	hours_167_TAX: number;
	hours_267_TAX: number;
	hours_2_TAX: number;

	constructor(
		period_id: number,
		period_name: string | null,
		emp_no: string,
		emp_name: string,
		pay: number, //1：5日 2：15日
		type_id: number,
		days_radio: string,
		type_name: string,
		pay_period: number | null,
		pay_delay: number | null,
		hours_1: number,
		hours_134: number,
		hours_167: number,
		hours_267: number,
		hours_2: number,
		hours_134_TAX: number,
		hours_167_TAX: number,
		hours_267_TAX: number,
		hours_2_TAX: number
	) {
		this.period_id = period_id;
		this.period_name = period_name;
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.pay = pay;
		this.type_id = type_id;
		this.days_radio = days_radio;
		this.type_name = type_name;
		this.pay_period = pay_period;
		this.pay_delay = pay_delay;
		this.hours_1 = hours_1;
		this.hours_134 = hours_134;
		this.hours_167 = hours_167;
		this.hours_267 = hours_267;
		this.hours_2 = hours_2;
		this.hours_134_TAX = hours_134_TAX;
		this.hours_167_TAX = hours_167_TAX;
		this.hours_267_TAX = hours_267_TAX;
		this.hours_2_TAX = hours_2_TAX;
	}

	static fromDB(db_data: any): Overtime {
		const result = dbOvertime.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new Overtime(
			data.PERIOD_ID,
			data.PERIOD_NAME,
			data.EMP_NO,
			data.EMP_NAME,
			data.PAY,
			data.TYPE_ID,
			data.DAYS_RADIO,
			data.TYPE_NAME,
			data.PAY_PERIOD,
			data.PAY_DELAY,
			data.HOURS_1,
			data.HOURS_134,
			data.HOURS_167,
			data.HOURS_267,
			data.HOURS_2,
			data.HOURS_134_TAX,
			data.HOURS_167_TAX,
			data.HOURS_267_TAX,
			data.HOURS_2_TAX
		);
	}
}
