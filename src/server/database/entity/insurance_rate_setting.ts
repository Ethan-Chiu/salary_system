// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

// @Entity("U_INSURANCE_RATE_SETTING")
// export class InsuranceRateSetting {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("float")
// 	min_wage_rate: number;

// 	@Column("float")
// 	l_i_accident_rate: number;

// 	@Column("float")
// 	l_i_employment_premium_rate: number;

// 	@Column("float")
// 	l_i_occupational_hazard_rate: number;

// 	@Column("float")
// 	l_i_wage_replacement_rate: number;

// 	@Column("float")
// 	h_i_standard_rate: number;

// 	@Column("float")
// 	h_i_avg_dependents_count: number;

// 	@Column("float")
// 	v2_h_i_supp_premium_rate: number;

// 	@Column("float")
// 	v2_h_i_dock_tsx_thres: number;

// 	@Column("date")
// 	start_date: Date;

// 	@Column("date", { nullable: true })
// 	end_date?: Date | null;
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

export class InsuranceRateSetting extends Model<
	InferAttributes<InsuranceRateSetting>,
	InferCreationAttributes<InsuranceRateSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare min_wage_rate: number;
    declare l_i_accident_rate: number;
    declare l_i_employment_premium_rate: number;
    declare l_i_occupational_hazard_rate: number;
    declare l_i_wage_replacement_rate: number;
    declare h_i_standard_rate: number;
    declare h_i_avg_dependents_count: number;
    declare v2_h_i_supp_premium_rate: number;
    declare v2_h_i_dock_tsx_thres: number;
	declare start_date: Date;
	declare end_date: Date | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

InsuranceRateSetting.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        min_wage_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        l_i_accident_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        l_i_employment_premium_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        l_i_occupational_hazard_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        l_i_wage_replacement_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        h_i_standard_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        h_i_avg_dependents_count: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        v2_h_i_supp_premium_rate: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        v2_h_i_dock_tsx_thres: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
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
		tableName: "U_INSURANCE_RATE_SETTING",
	}
);