import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class EmployeePayment extends Model<
	InferAttributes<EmployeePayment>,
	InferCreationAttributes<EmployeePayment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare base_salary: number;
	declare food_bonus: number;
	declare supervisor_comp: number;
	declare job_comp: number;
	declare subsidy_comp: number;
	declare professional_cert_comp: number;
	declare labor_retirement_self: number;
	declare l_i: number;
	declare h_i: number;
	declare labor_retirement: number;
	declare occupational_injury: number;
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

EmployeePayment.init(
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
		base_salary: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		food_bonus: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		supervisor_comp: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		job_comp: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		subsidy_comp: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		professional_cert_comp: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		labor_retirement_self: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		l_i: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		h_i: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		labor_retirement: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		occupational_injury: {
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
		tableName: "U_EMPLOYEE_PAYMENT",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
