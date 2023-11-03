// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Char } from "./utils/utils";
// import { BaseMeta } from "./utils/base_meta";

// @Entity("U_BANK_SETTING")
// export class BankSetting extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column({type:"varchar",length:32})
// 	bank_code: string;

// 	@Column("varchar2", { length: Char(32) })
// 	bank_name: string;

// 	@Column("varchar2", { length: Char(32) })
// 	org_code: string;

// 	@Column("varchar2", { length: Char(32) })
// 	org_name: string;

// 	@Column("date")
// 	start_date: Date;

// 	@Column("date", { nullable: true })
// 	end_date?: Date | null;
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

export class BankSetting extends Model<
	InferAttributes<BankSetting>,
	InferCreationAttributes<BankSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare bank_code: string;
	declare bank_name: string;
	declare org_code: string;
	declare org_name: string;
	declare start_date: Date;
	declare end_date: Date | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

BankSetting.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		bank_code: {
			type: new DataTypes.STRING(128),
			unique: false,
			allowNull: false,
		},
		bank_name: {
			type: new DataTypes.STRING(128),
			unique: false,
			allowNull: false,
		},
		org_code: {
			type: new DataTypes.STRING(128),
			unique: false,
			allowNull: false,
		},
		org_name: {
			type: new DataTypes.STRING(128),
			unique: false,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
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
		tableName: "U_BANK_SETTING",
	}
);
