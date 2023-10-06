import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("U_BONUS_DEPARTMENT")
export class BonusDepartment {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar2", { length: "32 Char" })
	department: string;

	@Column("float")
	multiplier: string;
}
