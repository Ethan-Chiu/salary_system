export class Holiday {
	// id can be undefined during creation when using `autoIncrement`
	declare period_id?: number;
	declare emp_no?: string;
	declare emp_name?: string;
	declare pay_order?: number;
	declare pay_period?: number;
	declare pay_delay?: number;
	declare period_name?: string;
	declare total_hours?: number;
	declare annual_1?: number; //不休假
	declare compensatory_134?: number; //不休假
	declare compensatory_167?: number; //不休假
	declare compensatory_267?: number; //不休假
	declare compensatory_1?: number; //不休假
	declare compensatory_2?: number; //不休假
	constructor(
		period_id?: number,
		period_name?: string,
		emp_no?: string,
		emp_name?: string,
		pay_order?: number,
		pay_period?: number,
		pay_delay?: number,
		total_hours?: number,
		annual_1?: number,
		compensatory_134?: number,
		compensatory_167?: number,
		compensatory_267?: number,
		compensatory_1?: number,
		compensatory_2?: number
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

	static fromDB(data: any): Holiday {
		const {
			PERIOD_ID,
			PERIOD_NAME,
			EMP_NO,
			EMP_NAME,
			PAY_ORDER,
			PAY_PERIOD,
			PAY_DELAY,
			TOTAL_HOURS,
			ANNUAL_1,
			COMPENSATORY_134,
			COMPENSATORY_167,
			COMPENSATORY_267,
			COMPENSATORY_1,
			COMPENSATORY_2,
		} = data;

		return new Holiday(
			PERIOD_ID,
			PERIOD_NAME,
			EMP_NO,
			EMP_NAME,
			PAY_ORDER,
			PAY_PERIOD,
			PAY_DELAY,
			TOTAL_HOURS,
			ANNUAL_1,
			COMPENSATORY_134,
			COMPENSATORY_167,
			COMPENSATORY_267,
			COMPENSATORY_1,
			COMPENSATORY_2
		);
	}
}
