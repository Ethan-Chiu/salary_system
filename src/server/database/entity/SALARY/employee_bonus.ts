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
	declare multiplier: number|null;
	declare fixed_amount: number|null;
	declare budget_amount: number|null;
	declare superviser_amount: number|null;
	declare final_amount: number|null;

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
				allowNull: true,
			},
			multiplier: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			fixed_amount: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			budget_amount: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			superviser_amount: {
				type: DataTypes.FLOAT,
				allowNull: true,
			},
			final_amount: {
				type: DataTypes.FLOAT,
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