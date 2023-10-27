import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Char } from "./utils/utils";
import { BaseMeta } from "./utils/base_meta";

@Entity("U_BANK_SETTING")
export class BankSetting extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({type:"varchar",length:32})
	bank_code: string;

	@Column("varchar2", { length: Char(32) })
	bank_name: string;

	@Column("varchar2", { length: Char(32) })
	org_code: string;

	@Column("varchar2", { length: Char(32) })
	org_name: string;

	@Column("date")
	start_date: Date;

	@Column("date", { nullable: true })
	end_date?: Date | null;
}
