export class Expense {
	// id can be undefined during creation when using `autoIncrement`
	declare period_id?: number;
    declare kind?: number;
	declare emp_no?: string;
	declare emp_name?: string;
	declare id?: number;
	declare amount?: number;
	declare remark?: string;
    declare create_by?: string;
    declare create_date?: Date;
    declare update_by?: string;
    declare update_date?: Date;
    declare pay_delay?: number;
	constructor(
        period_id?: number,
        kind?: number,
        emp_no?: string,
        emp_name?: string,
        id?: number,
        amount?: number,
        remark?: string,
        create_by?: string,
        create_date?: Date,
        update_by?: string,
        update_date?: Date,
        pay_delay?: number
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
	static fromDB(data: any): Expense {
		const {
            PERIOD_ID,
            KIND,
            EMP_NO,
            EMP_NAME,
            ID,
            AMOUNT,
            REMARK,
            CREATE_BY,
            CREATE_DATE,
            UPDATE_BY,
            UPDATE_DATE,
            PAY_DELAY
		} = data;

        return new Expense(
            PERIOD_ID,
            KIND,
            EMP_NO,
            EMP_NAME,
            ID,
            AMOUNT,
            REMARK,
            CREATE_BY,
            CREATE_DATE,
            UPDATE_BY,
            UPDATE_DATE,
            PAY_DELAY  
        );	
	}
}
