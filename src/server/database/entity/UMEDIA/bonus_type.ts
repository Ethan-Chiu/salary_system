import { z } from "zod";

const dbBonusType = z.object({
	ID: z.number(),
	NAME: z.string(),
});

export class BonusType {
	id: number;
	name: string;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}

	static fromDB(db_data: any): BonusType {
		const result = dbBonusType.safeParse(db_data);

		if (!result.success) {
			throw new Error(result.error.message);
		}

		const data = result.data;

		return new BonusType(data.ID, data.NAME);
	}
}
