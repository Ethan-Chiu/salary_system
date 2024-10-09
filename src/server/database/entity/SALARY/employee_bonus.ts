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
	declare special_multiplier: number;
	declare multiplier: number;
	declare fixed_amount: number;
	declare budget_effective_salary: number;
	declare budget_amount: number;
	declare supervisor_performance_level: string|null;
	declare supervisor_effective_salary: number|null;
	declare supervisor_amount: number|null;
	declare approved_performance_level: string|null;
	declare approved_effective_salary: number|null;
	declare approved_amount: number|null;

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
			special_multiplier: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			multiplier: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			fixed_amount: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			budget_effective_salary: {
				type: DataTypes.FLOAT,
				allowNull: false,
				defaultValue: 0,	
			},
			budget_amount: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			supervisor_performance_level: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			supervisor_effective_salary: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			supervisor_amount: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			approved_performance_level: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			approved_effective_salary: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			approved_amount: {
				type: DataTypes.STRING(32),
				allowNull: true,
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