export class Bonus {
	// id can be undefined during creation when using `autoIncrement`
	declare period_id?: number;
	declare emp_no?: string;
	declare emp_name?: string;
	declare bonus_id?: number;
	declare amount?: number;
	declare pay?: number;
	declare remark?: string;
	constructor(
		period_id?: number,
        emp_no?: string,
        emp_name?: string,
        bonus_id?: number,
        amount?: number,
        pay?: number,
        remark?: string
	) {
		this.period_id = period_id;
        this.emp_no = emp_no;
        this.emp_name = emp_name;
        this.bonus_id = bonus_id;
        this.amount = amount;
        this.pay = pay;
        this.remark = remark;
	}
	static fromDB(data: any): Bonus {
		const {
            PERIOD_ID,
            EMP_NO,
            EMP_NAME,
            BONUS_ID,
            AMOUNT,
            PAY,
            REMARK
		} = data;

		return new Bonus(
			PERIOD_ID,
            EMP_NO,
            EMP_NAME,
            BONUS_ID,
            Number(AMOUNT),
            PAY,
            REMARK
		);
	}
}
