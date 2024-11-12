import { z } from "zod";

const dbExpenseClass = z.object({
	ID: z.number(),
	NAME: z.string(),
	CLASS: z.number(),
	OTHER_TAX: z.number(),
	OTHER_LESS: z.number(),
	RULE: z.number(),
	FIELD_ORDER: z.number().nullable(),
	HIDDLE: z.number(),
	MEMO: z.string().nullable(),
	UPDATE_BY: z.string(),
	UPDATE_DATE: z.date().nullable(),
});

export class ExpenseClass {
	// id can be undefined during creation when using `autoIncrement`
	id: number;
	name: string;
	class_type: number; //class
	other_tax: number;
	other_less: number;
	rule: number;
	field_order: number | null;
	hiddle: number;
	memo: string | null;
	update_by: string;
	update_date: Date | null;

	constructor(
		id: number,
		name: string,
		class_type: number,
		other_tax: number,
		other_less: number,
		rule: number,
		field_order: number | null,
		hiddle: number,
		memo: string | null,
		update_by: string,
		update_date: Date | null
	) {
		this.id = id;
		this.name = name;
		this.class_type = class_type;
		this.other_tax = other_tax;
		this.other_less = other_less;
		this.rule = rule;
		this.field_order = field_order;
		this.hiddle = hiddle;
		this.memo = memo;
		this.update_by = update_by;
		this.update_date = update_date;
	}

	static fromDB(db_data: any): ExpenseClass {
		const result = dbExpenseClass.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new ExpenseClass(
			data.ID,
			data.NAME,
			data.CLASS,
			data.OTHER_TAX,
			data.OTHER_LESS,
			data.RULE,
			data.FIELD_ORDER,
			data.HIDDLE,
			data.MEMO,
			data.UPDATE_BY,
			data.UPDATE_DATE
		);
	}
}
