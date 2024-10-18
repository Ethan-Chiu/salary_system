import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";
import { LongServiceeEnumType } from "~/server/api/types/long_service_enum";

export class EmployeePayment extends Model<
	InferAttributes<EmployeePayment>,
	InferCreationAttributes<EmployeePayment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare base_salary_enc: string;
	declare food_allowance_enc: string;
	declare supervisor_allowance_enc: string;
	declare occupational_allowance_enc: string;
	declare subsidy_allowance_enc: string;
	declare long_service_allowance_enc: string;
	declare long_service_allowance_type: LongServiceeEnumType;
	declare l_r_self_enc: string;
	declare l_i_enc: string;
	declare h_i_enc: string;
	declare l_r_enc: string;
	declare occupational_injury_enc: string;
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
			base_salary_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			food_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			supervisor_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			occupational_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			subsidy_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			long_service_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			long_service_allowance_type: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_r_self_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_i_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			h_i_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_r_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			occupational_injury_enc: {
				type: DataTypes.STRING(128),
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
			tableName: "U_EMPLOYEE_PAYMENT",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}