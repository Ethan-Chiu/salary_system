import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { BaseMeta } from "./utils/base_meta";
import { Char } from "./utils/utils";

@Entity("U_User")
export class User extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar2", { unique: true })
	emp_id: string;

	@Column("varchar2", { length: Char(32) })
	hash: string;

	@Column("int")
	auth_level: number;

	@Column("date")
	start_date: Date;

	@Column("date", { nullable: true })
	end_date?: Date | null;
}
