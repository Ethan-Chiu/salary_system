import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Char } from "./utils/utils";
import { BaseMeta } from "./utils/base_meta";

@Entity("U_BONUS_DEPARTMENT")
export class BonusDepartment extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar2", { length: Char(32) })
	department: string;

	@Column("float")
	multiplier: string;
}
