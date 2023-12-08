export class Payset {
	// id can be undefined during creation when using `autoIncrement`
	declare period_id: number;
	declare period_name: string;
	declare status: string;
	declare nid: number;
	declare emp_no: string;
	declare name: string;
	declare country_id: number;
	declare pay_type: number;
	declare pay_set: number;
	declare pay_delay: number;
	declare work_day: number;
	declare li_day: number;
	declare delay_count: number;
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
	static fromDB(data: any): Payset {
		const {
			PERIOD_ID,
			PERIOD_NAME,
			STATUS,
			NID,
			EMP_NO,
			NAME,
			COUNTRY_ID,
			PAY_TYPE,
			PAY_SET,
			PAY_DELAY,
			WORK_DAY,
			LI_DAY,
			DELAY_COUNT,
		} = data;

		return new Payset(
			PERIOD_ID,
			PERIOD_NAME,
			STATUS,
			NID,
			EMP_NO,
			NAME,
			COUNTRY_ID,
			PAY_TYPE,
			PAY_SET,
			PAY_DELAY,
			WORK_DAY,
			LI_DAY,
			DELAY_COUNT
		);
	}
}
