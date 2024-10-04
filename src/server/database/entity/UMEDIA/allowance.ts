export class Allowance {
	declare id: number;
	declare period_id: number;
	declare emp_no: string;
	declare emp_name: string;
	declare allowance_id: number;
	declare amount: number;
	declare remark: string;
	declare create_by: string;
	declare create_date: Date;
	declare update_by: string;
	declare update_date: Date;
	declare pay_delay: number;
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
	static fromDB(data: any): Allowance {
		const {
			ID,
			PERIOD_ID,
			EMP_NO,
			EMP_NAME,
			ALLOWANCE_ID,
			AMOUNT,
			REMARK,
			CREATE_BY,
			CREATE_DATE,
			UPDATE_BY,
			UPDATE_DATE,
			PAY_DELAY,
		} = data;

		return new Allowance(
			ID,
			PERIOD_ID,
			EMP_NO,
			EMP_NAME,
			ALLOWANCE_ID,
			Number(AMOUNT),
			REMARK,
			CREATE_BY,
			CREATE_DATE,
			UPDATE_BY,
			UPDATE_DATE,
			PAY_DELAY
		);
	}
}
