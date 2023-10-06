import { CreateDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseMeta {
	@CreateDateColumn({ type: "date" })
	create_date: Date;

	@UpdateDateColumn({ type: "date" })
	update_date: Date;
}
