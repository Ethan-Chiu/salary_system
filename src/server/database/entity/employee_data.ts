// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Char } from "./utils/utils";
// import { BaseMeta } from "./utils/base_meta";

// @Entity("U_EMPLOYEE_DATA")
// export class EmployeeData extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("varchar2", { length: Char(32) })
// 	emp_id: string;

// 	@Column("varchar2", { length: Char(32) })
// 	emp_name: string;

// 	@Column("varchar2", { length: Char(32) })
// 	work_type: string;

// 	@Column("varchar2", { length: Char(32) })
// 	work_status: string;

// 	@Column("varchar2", { length: Char(32) })
// 	department: string;

// 	@Column("int")
// 	position: number;

// 	@Column("varchar2", { length: Char(2) })
// 	position_type: string;

// 	@Column("varchar2", { length: Char(32) })
// 	gender: string;

// 	@Column("varchar2", { length: Char(32) })
// 	group_insurance_type: string;

// 	@Column("varchar2", { length: Char(32) })
// 	performance_level: string;

// 	@Column()
// 	probationary_period_over: boolean;

// 	@Column()
// 	old_age_benifit: boolean;

// 	@Column("int")
// 	dependents_count: number;

// 	@Column("int")
// 	h_i_dependents_count: number;

// 	@Column("date")
// 	hire_date: Date;

// 	@Column("date", { nullable: true })
// 	entry_date?: Date | null;

// 	@Column("date", { nullable: true })
// 	departure_date?: Date | null;

// 	@Column("varchar2", { length: Char(32) })
// 	identity_number: string;

// 	@Column()
// 	bonus_calculation: boolean;

// 	@Column("varchar2", { length: Char(32) })
// 	disability_level: string;

// 	@Column("float")
// 	labor_retirement_self_ratio: number;

// 	@Column()
// 	has_esot: boolean;

// 	@Column("varchar2", { length: Char(32) })
// 	tax_rate_category: string;

// 	@Column("varchar2", { length: Char(32) })
// 	nationality: string;

// 	@Column("varchar2", { length: Char(32) })
// 	registered_address: string;

// 	@Column("varchar2", { length: Char(32) })
// 	postal_code: string;

// 	@Column("varchar2", { length: Char(32) })
// 	mailing_address: string;

// 	@Column("varchar2", { length: Char(64) })
// 	email: string;

// 	@Column("varchar2", { length: Char(32) })
// 	bank_full_name: string;

// 	@Column("varchar2", { length: Char(32) })
// 	branch_full_name: string;

// 	@Column("varchar2", { length: Char(32) })
// 	securities_code: string;

// 	@Column("varchar2", { length: Char(32) })
// 	securities_account: string;

// 	@Column("date")
// 	birthdate: Date;

// 	@Column("varchar2", { length: Char(32) })
// 	bank_account: string;

// 	@Column("varchar2", { length: Char(32) })
// 	english_name: string;

// 	@Column("varchar2", { length: Char(32), nullable: true })
// 	indigenous_name?: string | null;

// 	@Column("varchar2", { length: Char(32) })
// 	tax_identification_code: string;
// }
import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../client";

export class EmployeeData extends Model<
	InferAttributes<EmployeeData>,
	InferCreationAttributes<EmployeeData>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare emp_id: string;
    declare emp_name: string;
    declare work_type: string;
    declare work_status: string;
    declare department: string;
    declare position: number;
    declare position_type: string;
    declare gender: string;
    declare group_insurance_type: string;
    declare performance_level: string;
    declare probationary_period_over: boolean;
    declare old_age_benifit: boolean;
    declare dependents_count: number;
    declare h_i_dependents_count: number;
    declare hire_date: Date;
    declare entry_date: Date | null;
    declare departure_date: Date | null;
    declare identity_number: string;
    declare bonus_calculation: boolean;
    declare disability_level: string;
    declare labor_retirement_self_ratio: number;
    declare has_esot: boolean;
    declare tax_rate_category: string;
    declare nationality: string;
    declare registered_address: string;
    declare postal_code: string;
    declare mailing_address: string;
    declare email: string;
    declare bank_full_name: string;
    declare branch_full_name: string;
    declare securities_code: string;
    declare securities_account: string;
    declare birthdate: Date;
    declare bank_account: string;
    declare english_name: string;
    declare indigenous_name: string | null;
    declare tax_identification_code: string;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

EmployeeData.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        emp_id: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        emp_name: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        work_type: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        work_status: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        department: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        position: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
        position_type: {
            type: DataTypes.STRING(2),
			allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        group_insurance_type: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        performance_level: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        probationary_period_over: {
            type: DataTypes.BOOLEAN,
			allowNull: false,
        },
        old_age_benifit: {
            type: DataTypes.BOOLEAN,
			allowNull: false,
        },
        dependents_count: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        h_i_dependents_count: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        hire_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        entry_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
        departure_date:{
            type: DataTypes.DATE,
			allowNull: true,
        },
        identity_number:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        bonus_calculation: {
            type: DataTypes.BOOLEAN,
			allowNull: false,
        },
        disability_level:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        labor_retirement_self_ratio: {
            type: DataTypes.FLOAT,
			allowNull: false,
        },
        has_esot: {
            type: DataTypes.BOOLEAN,
			allowNull: false,
        },
        tax_rate_category:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        nationality:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        registered_address:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        postal_code:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        mailing_address:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        email:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        bank_full_name:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        branch_full_name: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        securities_code:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        securities_account:{
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        birthdate: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        bank_account: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        english_name: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        indigenous_name: {
            type: DataTypes.STRING(32),
			allowNull: true,
        },
        tax_identification_code: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
		create_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "U_EMPLOYEE_DATA",
	}
)