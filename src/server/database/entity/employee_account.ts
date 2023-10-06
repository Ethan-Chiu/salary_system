import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Char } from "./utils/utils";
import { BaseMeta } from "./utils/base_meta";

@Entity("U_EMPLOYEE_ACCOUNT")
export class EmployeeAccount extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar2", { length: Char(32) })
	emp_id: string;

	@Column("varchar2", { length: Char(32) })
	bank_account: string;

	@Column("float")
	ratio: number;
}
