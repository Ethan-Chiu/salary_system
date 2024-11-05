import { z } from "zod";

const dbHoliday = z.object({
	PERIOD_ID: z.number(),
	EMP_NO: z.string(),
	EMP_NAME: z.string(),
	PAY_ORDER: z.number(),
	PAY_PERIOD: z.number().nullable(),
	PAY_DELAY: z.number().nullable(),
	PERIOD_NAME: z.string().nullable(),
	TOTAL_HOURS: z.number(),
	ANNUAL_1: z.number().nullable(),
	COMPENSATORY_134: z.number().nullable(),
	COMPENSATORY_167: z.number().nullable(),
	COMPENSATORY_267: z.number().nullable(),
	COMPENSATORY_1: z.number().nullable(),
	COMPENSATORY_2: z.number().nullable(),
});

export class Holiday {
	// id can be undefined during creation when using `autoIncrement`
	period_id: number;
	emp_no: string;
	emp_name: string;
	pay_order: number;
	pay_period: number | null;
	pay_delay: number | null;
	period_name: string | null;
	total_hours: number;
	annual_1: number | null;
	compensatory_134: number | null;
	compensatory_167: number | null;
	compensatory_267: number | null;
	compensatory_1: number | null;
	compensatory_2: number | null;

	constructor(
		period_id: number,
		period_name: string | null,
		emp_no: string,
		emp_name: string,
		pay_order: number,
		pay_period: number | null,
		pay_delay: number | null,
		total_hours: number,
		annual_1: number | null,
		compensatory_134: number | null,
		compensatory_167: number | null,
		compensatory_267: number | null,
		compensatory_1: number | null,
		compensatory_2: number | null
	) {
		this.period_id = period_id;
		this.period_name = period_name;
		this.emp_no = emp_no;
		this.emp_name = emp_name;
		this.pay_order = pay_order;
		this.pay_period = pay_period;
		this.pay_delay = pay_delay;
		this.total_hours = total_hours;
		this.annual_1 = annual_1;
		this.compensatory_134 = compensatory_134;
		this.compensatory_167 = compensatory_167;
		this.compensatory_267 = compensatory_267;
		this.compensatory_1 = compensatory_1;
		this.compensatory_2 = compensatory_2;
	}

	static fromDB(db_data: any): Holiday {
		const result = dbHoliday.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new Holiday(
			data.PERIOD_ID,
			data.PERIOD_NAME,
			data.EMP_NO,
			data.EMP_NAME,
			data.PAY_ORDER,
			data.PAY_PERIOD,
			data.PAY_DELAY,
			data.TOTAL_HOURS,
			data.ANNUAL_1,
			data.COMPENSATORY_134,
			data.COMPENSATORY_167,
			data.COMPENSATORY_267,
			data.COMPENSATORY_1,
			data.COMPENSATORY_2
		);
	}
}
