import { z } from "zod";

const dbPayset = z.object({
	PERIOD_ID: z.number(),
	PERIOD_NAME: z.string(),
	STATUS: z.string(),
	NID: z.number(),
	EMPLOYEE_NO: z.string(),
	NAME: z.string(),
	COUNTRY_ID: z.number(),
	PAY_TYPE: z.number(),
	PAY_SET: z.number(),
	PAY_DELAY: z.number(),
	WORK_DAY: z.number(),
	LI_DAY: z.number(),
	DELAY_COUNT: z.number(),
});

export class Payset {
	// id can be undefined during creation when using `autoIncrement`
	period_id: number;
	period_name: string;
	status: string;
	nid: number;
	emp_no: string;
	name: string;
	country_id: number;
	pay_type: number;
	pay_set: number;
	pay_delay: number;
	work_day: number;
	li_day: number;
	delay_count: number;

	constructor(
		period_id: number,
		period_name: string,
		status: string,
		nid: number,
		emp_no: string,
		name: string,
		country_id: number,
		pay_type: number,
		pay_set: number,
		pay_delay: number,
		work_day: number,
		li_day: number,
		delay_count: number
	) {
		this.period_id = period_id;
		this.period_name = period_name;
		this.status = status;
		this.nid = nid;
		this.emp_no = emp_no;
		this.name = name;
		this.country_id = country_id;
		this.pay_type = pay_type;
		this.pay_set = pay_set;
		this.pay_delay = pay_delay;
		this.work_day = work_day;
		this.li_day = li_day;
		this.delay_count = delay_count;
	}

	static fromDB(db_data: any): Payset {
		const result = dbPayset.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new Payset(
			data.PERIOD_ID,
			data.PERIOD_NAME,
			data.STATUS,
			data.NID,
			data.EMPLOYEE_NO,
			data.NAME,
			data.COUNTRY_ID,
			data.PAY_TYPE,
			data.PAY_SET,
			data.PAY_DELAY,
			data.WORK_DAY,
			data.LI_DAY,
			data.DELAY_COUNT
		);
	}
}
