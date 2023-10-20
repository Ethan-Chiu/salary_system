import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("U_INSURANCE_RATE_SETTING")
export class InsuranceRateSetting {
	@PrimaryGeneratedColumn()
	id: number;

	@Column("float")
	min_wage_rate: number;

	@Column("float")
	l_i_accident_rate: number;

	@Column("float")
	l_i_employment_premium_rate: number;

	@Column("float")
	l_i_occupational_hazard_rate: number;

	@Column("float")
	l_i_wage_replacement_rate: number;

	@Column("float")
	h_i_standard_rate: number;

	@Column("float")
	h_i_avg_dependents_count: number;

	@Column("float")
	v2_h_i_supp_premium_rate: number;

	@Column("float")
	v2_h_i_dock_tsx_thres: number;

	@Column("date")
	start_date: Date;

	@Column("date", { nullable: true })
	end_date?: Date | null;
}
