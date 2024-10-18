import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

export class EmployeeBonus extends Model<
	InferAttributes<EmployeeBonus>,
	InferCreationAttributes<EmployeeBonus>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare bonus_type: BonusTypeEnumType;
	declare emp_no: string;
	declare special_multiplier_enc: string;
	declare multiplier_enc: string;
	declare fixed_amount_enc: string;
	declare bud_effective_salary_enc: string;
	declare bud_amount_enc: string;
	declare sup_performance_level_enc: string;
	declare sup_effective_salary_enc: string;
	declare sup_amount_enc: string;
	declare app_performance_level_enc: string;
	declare app_effective_salary_enc: string;
	declare app_amount_enc: string;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initEmployeeBonus(sequelize: Sequelize) {
	EmployeeBonus.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			period_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			bonus_type: {
				type: new DataTypes.STRING(32),
				allowNull: false,
			},
			emp_no: {
				type: new DataTypes.STRING(32),
				allowNull: false,
			},
			special_multiplier_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			multiplier_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			fixed_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			bud_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			bud_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_performance_level_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			app_performance_level_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			app_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			app_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
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
			tableName: "U_EMPLOYEE_BONUS",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}