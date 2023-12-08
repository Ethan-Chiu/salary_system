import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../client";

export class AccessSetting extends Model<
	InferAttributes<AccessSetting>,
	InferCreationAttributes<AccessSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare auth_l: number;

	declare actions: boolean;
	declare report: boolean;
	declare roles: boolean;
	declare settings: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

AccessSetting.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		auth_l: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
			unique: true,
		},
        actions: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        report: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        roles: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        settings: {
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
		tableName: "U_ACCESS_SETTING",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
