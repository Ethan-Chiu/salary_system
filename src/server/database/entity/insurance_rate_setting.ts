import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('U_INSURANCE_RATE_SETTING')
export class InsuranceRateSetting {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('float')
    min_wage_rate: number;

    @Column('float')
    labor_insurance_accident_rate: number;

    @Column('float')
    labor_insurance_employment_premium_rate: number;

    @Column('float')
    labor_insurance_occupational_hazard_rate: number;

    @Column('float')
    labor_insurance_wage_replacement_rate: number;

    @Column('float')
    health_insurance_standard_rate: number;

    @Column('float')
    health_insurance_average_dependents_count: number;

    @Column('float')
    v2_health_insurance_supplemental_premium_rate: number;

    @Column('float')
    v2_health_insurance_deduction_threshold_per_transaction: number;
}
