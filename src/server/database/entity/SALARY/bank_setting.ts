import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

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
		tableName: "U_BANK_SETTING",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
