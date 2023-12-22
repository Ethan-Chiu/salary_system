import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
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
    declare supervisor_bonus: number;
    declare job_bonus: number;
    declare subsidy_bonus: number;
    declare shift_bonus: number;
    declare professional_cert_bonus: number;
    declare labor_retirement_self: number;
    declare emp_trust_reserve: number;
    declare org_trust_reserve: number;
    declare emp_special_trust_incent: number;
    declare org_special_trust_incent: number;
    declare l_i: number;
    declare h_i: number;
    declare labor_retirement: number;
    declare occupational_injury: number;
    declare start_date: string;
    declare end_date: string;

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
        supervisor_bonus: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
		job_bonus: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
        subsidy_bonus: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        shift_bonus: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        professional_cert_bonus: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        labor_retirement_self: {
            type: DataTypes.INTEGER.UNSIGNED,
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
		createdAt: 'create_date',
		updatedAt: 'update_date',
	}
)