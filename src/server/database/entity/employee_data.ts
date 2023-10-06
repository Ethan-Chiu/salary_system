import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Char } from "./utils/utils";
import { BaseMeta } from "./utils/base_meta";

@Entity("U_EMPLOYEE_DATA")
export class EmployeeData extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("varchar2", { length: Char(32) })
	employee_id: string;

	@Column("varchar2", { length: Char(32) })
	employee_name: string;

	@Column("varchar2", { length: Char(32) })
	work_type: string;

	@Column("varchar2", { length: Char(32) })
	work_status: string;

	@Column("varchar2", { length: Char(32) })
	department: string;

	@Column("int")
	position: number;

	@Column("varchar2", { length: Char(2) })
	position_type: string;

	@Column("varchar2", { length: Char(32) })
	gender: string;

	@Column("varchar2", { length: Char(32) })
	group_insurance_type: string;

	@Column("varchar2", { length: Char(32) })
	performance_level: string;

	@Column()
	probationary_period_over: boolean;

	@Column()
	old_age_benifit: boolean;

	@Column("int")
	dependents_count: number;

	@Column("int")
	health_insurance_dependents_count: number;

	@Column("date")
	hire_date: Date;

	@Column("date", { nullable: true })
	entry_date?: Date | null;

	@Column("date", { nullable: true })
	departure_date?: Date | null;

	@Column("varchar2", { length: Char(32) })
	id_number: string;

	@Column()
	bonus_calculation: boolean;

	@Column("varchar2", { length: Char(32) })
	disability_level: string;

	@Column("float")
	labor_retirement_self_contribution_ratio: number;

	@Column()
	has_esot: boolean;

	@Column("varchar2", { length: Char(32) })
	tax_rate_category: string;

	@Column("varchar2", { length: Char(32) })
	nationality: string;

	@Column("varchar2", { length: Char(32) })
	registered_address: string;

	@Column("varchar2", { length: Char(32) })
	postal_code: string;

	@Column("varchar2", { length: Char(32) })
	mailing_address: string;

	@Column("varchar2", { length: Char(64) })
	email: string;

	@Column("varchar2", { length: Char(32) })
	bank_full_name: string;

	@Column("varchar2", { length: Char(32) })
	branch_full_name: string;

	@Column("varchar2", { length: Char(32) })
	securities_code: string;

	@Column("varchar2", { length: Char(32) })
	securities_account: string;

	@Column("date")
	birthdate: Date;

	@Column("varchar2", { length: Char(32) })
	bank_account: string;

	@Column("varchar2", { length: Char(32) })
	english_name: string;

	@Column("varchar2", { length: Char(32), nullable: true })
	indigenous_name?: string | null;

	@Column("varchar2", { length: Char(32) })
	tax_identification_code: string;
}
