import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("U_BONUS_SETTING")
export class BonusSetting {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("float")
	fixed_multiplier: number;

	@Column("date")
	criterion_date: Date;

	@Column("varchar2", { length: "32 Char" })
	base_on: string;

	@Column("varchar2", { length: "32 Char" })
	type: string;
}
