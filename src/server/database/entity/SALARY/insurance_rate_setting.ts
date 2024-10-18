import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class InsuranceRateSetting extends Model<
	InferAttributes<InsuranceRateSetting>,
	InferCreationAttributes<InsuranceRateSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare min_wage_rate: number;
	declare l_i_accident_rate: number;
	declare l_i_employment_pay_rate: number;
	declare l_i_occupational_injury_rate: number;
	declare l_i_wage_replacement_rate: number;
	declare h_i_standard_rate: number;
	declare h_i_avg_dependents_count: number;
	declare v2_h_i_supp_pay_rate: number;
	declare v2_h_i_deduction_tsx_thres: number;
	declare v2_h_i_multiplier: number;
	// 少一個二代健保倍數
	declare start_date: string;
	declare end_date: string | null;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initInsuranceRateSetting(sequelize: Sequelize) {
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
			l_i_employment_pay_rate: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			l_i_occupational_injury_rate: {
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
			v2_h_i_supp_pay_rate: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			v2_h_i_deduction_tsx_thres: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			v2_h_i_multiplier: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
				defaultValue: 4,
			},
			start_date: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			end_date: {
				type: DataTypes.STRING(128),
				allowNull: true,
			},
			disabled: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
			},
			create_date: {
				type: DataTypes.DATE,
			},
			create_by: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			update_date: {
				type: DataTypes.DATE,
			},
			update_by: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
		},
		{
			sequelize,
			tableName: "U_INSURANCE_RATE_SETTING",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}