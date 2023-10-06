import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseMeta } from "./utils/base_meta";
import { Char } from "./utils/utils";

@Entity("U_TRUST_MONEY")
export class TrustMoney extends BaseMeta {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("int")
	position: number;

	@Column("varchar2", { length: Char(2) })
	position_type: string;

	@Column("int", { nullable: true })
	emp_trust_reserve_limit?: number | null;

	@Column("int")
	org_trust_reserve_limit: number;

	@Column("int", { nullable: true })
	emp_special_trust_incent_limit?: number | null;

	@Column("int")
	org_special_trust_incent_limit: number;
}
