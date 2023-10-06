import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseMeta } from './utils/base_meta';
import { Char } from './utils/utils';

@Entity('U_EMPLOYEE_PAYMENT')
export class EmployeePayment extends BaseMeta{

    @PrimaryGeneratedColumn()
    id: number;

    @Column("varchar2", { length: Char(32) })
    employee_id: string;

    @Column('int')
    base_salary: number;

    @Column('int')
    supervisor_bonus: number;

    @Column('int')
    job_bonus: number;

    @Column('int')
    subsidy_bonus: number;

    @Column('int')
    shift_bonus: number;

    @Column('int')
    professional_certification_bonus: number;

    @Column('int')
    labor_retirement_self_withdraw: number;

    @Column('int')
    employee_trust_reserve: number;

    @Column('int')
    org_trust_reserve: number;

    @Column('int')
    employee_special_trust_incentive: number;

    @Column('int')
    org_special_trust_incentive: number;

    @Column('float')
    labor_insurance: number;

    @Column('float')
    health_insurance: number;

    @Column('float')
    labor_retirement: number;

    @Column('float')
    occupational_injury: number;

    @Column("date")
	start_date: Date;

	@Column("date")
	end_date: Date;
}
