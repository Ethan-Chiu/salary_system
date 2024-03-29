import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class EmployeeTrust extends Model<
	InferAttributes<EmployeeTrust>,
	InferCreationAttributes<EmployeeTrust>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare emp_trust_reserve: number;
	declare org_trust_reserve: number;
	declare emp_special_trust_incent: number;
	declare org_special_trust_incent: number;
	declare start_date: string;
	declare end_date: string | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

EmployeeTrust.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		emp_no: {
			type: DataTypes.STRING(32),
			allowNull: false,
		},
		emp_trust_reserve: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		org_trust_reserve: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		emp_special_trust_incent: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		org_special_trust_incent: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		end_date: {
			type: DataTypes.STRING(128),
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
		tableName: "U_EMPLOYEE_TRUST",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
