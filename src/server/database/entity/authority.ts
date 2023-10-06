import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseMeta } from "./utils/base_meta";
import { Char } from "./utils/utils";

@Entity("U_AUTHORITY")
export class Authority extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int", { unique: true })
	employee_id: number;

	@Column("varchar2", { length: Char(32) })
	password: string;

	@Column("int")
	auth_level: number;

	@Column("varchar2", { length: Char(32) })
	salt: string;

	@Column("date")
	start_date: Date;

	@Column("date")
	end_date: Date;
}
