import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("U_AUTHORITY")
export class Authority {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int", { unique: true })
	employee_id: number;

	@Column("varchar2", { length: "32 Char" })
	password: string;

	@Column("int")
	auth_level: number;

	@Column("varchar2", { length: "32 Char" })
	salt: string;

	@Column("date")
	start_date: Date;

	@Column("date")
	end_date: Date;
}
