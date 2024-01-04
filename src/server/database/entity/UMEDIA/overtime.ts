export class Overtime {
	// id can be undefined during creation when using `autoIncrement`
	declare period_id?: number;
	declare emp_no?: string;
	declare emp_name?: string;
	declare pay?: number;
	declare type_id?: number;
	declare days_radio?: string;
	declare type_name?: string;
	declare pay_period?: number;
	declare period_name?: string;
	declare pay_delay?: number;
	declare hours_1?: number;
	declare hours_134?: number;
	declare hours_167?: number;
	declare hours_267?: number;
	declare hours_2?: number;
	declare hours_134_TAX?: number;
	declare hours_167_TAX?: number;
	declare hours_267_TAX?: number;
	declare hours_2_TAX?: number;
	constructor(
		period_id?: number,
		period_name?: string,
		emp_no?: string,
		emp_name?: string,
		pay?: number,
		type_id?: number,
		days_radio?: string,
		type_name?: string,
		pay_period?: number,
		pay_delay?: number,
		hours_1?: number,
		hours_134?: number,
		hours_167?: number,
		hours_267?: number,
		hours_2?: number,
		hours_134_TAX?: number,
		hours_167_TAX?: number,
		hours_267_TAX?: number,
		hours_2_TAX?: number
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
	static fromDB(data: any): Overtime {
		const {
			PERIOD_ID,
			PERIOD_NAME,
			EMP_NO,
			EMP_NAME,
			PAY,
			TYPE_ID,
			DAYS_RADIO,
			TYPE_NAME,
			PAY_PERIOD,
			PAY_DELAY,
			HOURS_1,
			HOURS_134,
			HOURS_167,
			HOURS_267,
			HOURS_2,
			HOURS_134_TAX,
			HOURS_167_TAX,
			HOURS_267_TAX,
			HOURS_2_TAX,
		} = data;

		return new Overtime(
			PERIOD_ID,
			PERIOD_NAME,
			EMP_NO,
			EMP_NAME,
			PAY,
			TYPE_ID,
			DAYS_RADIO,
			TYPE_NAME,
			PAY_PERIOD,
			PAY_DELAY,
			HOURS_1,
			HOURS_134,
			HOURS_167,
			HOURS_267,
			HOURS_2,
			HOURS_134_TAX,
			HOURS_167_TAX,
			HOURS_267_TAX,
			HOURS_2_TAX
		);
	}
}
