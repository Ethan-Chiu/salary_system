export class AllowanceType {
	// id can be undefined during creation when using `autoIncrement`
	declare id?: number;
	declare name?: string;
	declare type?: number; //class
	declare other_tax?: number;
	declare other_add?: number;
	declare rule?: number;
	declare field_order?: number;
	declare hiddle?: number;
	declare memo?: string;
	declare update_by?: string;
	declare update_date?: Date;
	constructor(
		id?: number,
		name?: string,
		type?: number,
		other_tax?: number,
		other_add?: number,
		rule?: number,
		field_order?: number,
		hiddle?: number,
		memo?: string,
		update_by?: string,
		update_date?: Date
	) {
		this.id = id;
		this.name = name;
		this.type = type;
		this.other_tax = other_tax;
		this.other_add = other_add;
		this.rule = rule;
		this.field_order = field_order;
		this.hiddle = hiddle;
		this.memo = memo;
		this.update_by = update_by;
		this.update_date = update_date;
	}
	static fromDB(data: any): AllowanceType {
		const {
			ID,
			NAME,
			TYPE,
			OTHER_TAX,
			OTHER_ADD,
			RULE,
			FIELD_ORDER,
			HIDDE,
			MEMO,
			UPDATE_BY,
			UPDATE_DATE,
		} = data;

		return new AllowanceType(
			ID,
			NAME,
			TYPE,
			OTHER_TAX,
			OTHER_ADD,
			RULE,
			FIELD_ORDER,
			HIDDE,
			MEMO,
			UPDATE_BY,
			UPDATE_DATE
		);
	}
}
