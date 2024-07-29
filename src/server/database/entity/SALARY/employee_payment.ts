import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class EmployeePayment extends Model<
	InferAttributes<EmployeePayment>,
	InferCreationAttributes<EmployeePayment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare base_salary: number;
	declare food_allowance: number | null;
	declare supervisor_allowance: number | null;
	declare occupational_allowance: number | null;
	declare subsidy_allowance: number | null;
	declare shift_allowance: number | null;
	declare professional_cert_allowance: number | null;
	declare l_r_self: number;
	declare l_i: number;
	declare h_i: number;
	declare l_r: number;
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

export function initEmployeePayment(sequelize: Sequelize) {
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
			food_allowance: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			supervisor_allowance: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			occupational_allowance: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			subsidy_allowance: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			shift_allowance: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			professional_cert_allowance: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			l_r_self: {
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
			l_r: {
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
}