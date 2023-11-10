// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Char } from "./utils/utils";
// import { BaseMeta } from "./utils/base_meta";

// @Entity("U_EMPLOYEE_ACCOUNT")
// export class EmployeeAccount extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("varchar2", { length: Char(32) })
// 	emp_id: string;

// 	@Column("varchar2", { length: Char(32) })
// 	bank_account: string;

// 	@Column("float")
// 	ratio: number;
// }

import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../client";

export class EmployeeAccount extends Model<
	InferAttributes<EmployeeAccount>,
	InferCreationAttributes<EmployeeAccount>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare emp_id: string;
    declare bank_account: string;
    declare ratio: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
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
        emp_id: {
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
			allowNull: false,
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "U_EMPLOYEE_ACCOUNT",
	}
)