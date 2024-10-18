import { z } from "zod";

const dbAllowanceType = z.object({
	ID: z.number(),
	NAME: z.string(),
	TYPE: z.number(),
	OTHER_TAX: z.number(),
	OTHER_ADD: z.number(),
	RULE: z.number(),
	FIELD_ORDER: z.number(),
	HIDDE: z.number(),
	MEMO: z.string(),
	UPDATE_BY: z.string(),
	UPDATE_DATE: z.date(),
});

export class AllowanceType {
	id: number;
	name: string;
	type: number; //class
	other_tax: number;
	other_add: number;
	rule: number;
	field_order: number;
	hiddle: number;
	memo: string;
	update_by: string;
	update_date: Date;

	constructor(
		id: number,
		name: string,
		type: number,
		other_tax: number,
		other_add: number,
		rule: number,
		field_order: number,
		hiddle: number,
		memo: string,
		update_by: string,
		update_date: Date
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

	static fromDB(db_data: any): AllowanceType {
		const result = dbAllowanceType.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new AllowanceType(
			data.ID,
			data.NAME,
			data.TYPE,
			data.OTHER_TAX,
			data.OTHER_ADD,
			data.RULE,
			data.FIELD_ORDER,
			data.HIDDE,
			data.MEMO,
			data.UPDATE_BY,
			data.UPDATE_DATE
		);
	}
}
