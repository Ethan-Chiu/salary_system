import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class EmployeeAccount extends Model<
	InferAttributes<EmployeeAccount>,
	InferCreationAttributes<EmployeeAccount>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare emp_no: string;
    declare bank_account: string;
    declare ratio: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

EmployeeAccount.init(
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
        bank_account: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        ratio: {
            type: DataTypes.FLOAT,
			unique: false,
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
		tableName: "U_EMPLOYEE_ACCOUNT",
		createdAt: 'create_date',
		updatedAt: 'update_date',
	}
)