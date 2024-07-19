export class ExpenseClass {
	// id can be undefined during creation when using `autoIncrement`
	declare id?: number;
	declare name?: string;
    declare class_type?: number; //class
    declare other_tax?: number;
    declare other_less?: number;
    declare rule?: number;
    declare field_order?: number;
    declare hiddle?: number;
    declare memo?: string;
    declare update_by?: string;
    declare update_date?: Date;
	constructor(
        id?: number,
        name?: string,
        class_type?: number,
        other_tax?: number,
        other_less?: number,
        rule?: number,
        field_order?: number,
        hiddle?: number,
        memo?: string,
        update_by?: string,
        update_date?: Date
	) {
        this.id = id
        this.name = name
        this.class_type = class_type
        this.other_tax = other_tax
        this.other_less = other_less
        this.rule = rule
        this.field_order = field_order
        this.hiddle = hiddle
        this.memo = memo
        this.update_by = update_by
        this.update_date = update_date
	}
	static fromDB(data: any): ExpenseClass {
		const {
           ID,
           NAME,
           CLASS,
           OTHER_TAX,
           OTHER_LESS,
           RULE,
           FIELD_ORDER,
           HIDDE,
           MEMO,
           UPDATE_BY,
           UPDATE_DATE
		} = data;

		return new ExpenseClass(
			ID,
            NAME,
            CLASS,
            OTHER_TAX,
            OTHER_LESS,
            RULE,
            FIELD_ORDER,
            HIDDE,
            MEMO,
            UPDATE_BY,
            UPDATE_DATE
		);
	}
}
