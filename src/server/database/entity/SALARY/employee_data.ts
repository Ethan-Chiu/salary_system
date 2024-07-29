import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class EmployeeData extends Model<
	InferAttributes<EmployeeData>,
	InferCreationAttributes<EmployeeData>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare emp_name: string;
	declare position: number; //職等
	declare position_type: string; //職級
	declare group_insurance_type: string;
	declare department: string;
	declare work_type: string; //工作類別
	declare work_status: string; //工作型態
	declare disabilty_level: string | null;
	declare sex_type: string;
	declare dependents: number | null;
	declare healthcare_dependents: number | null;
	declare registration_date: string;
	declare quit_date: string | null;
	declare license_id: string | null;
	declare bank_account: string;
	// declare received_elderly_benefits: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initEmployeeData(sequelize: Sequelize) {
	EmployeeData.init(
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
			disabilty_level: {
				type: DataTypes.STRING,
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
			sex_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			group_insurance_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			dependents: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			healthcare_dependents: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			registration_date: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			bank_account: {
				type: DataTypes.STRING(32),
			},
			quit_date: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			license_id: {
				type: DataTypes.STRING(32),
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
			tableName: "U_EMPLOYEE_DATA",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}