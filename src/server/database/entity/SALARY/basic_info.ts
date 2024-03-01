import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class BasicInfo extends Model<
	InferAttributes<BasicInfo>,
	InferCreationAttributes<BasicInfo>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare payday: Date;
    declare announcement: string;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

BasicInfo.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        payday: {
            type: DataTypes.DATE,
			allowNull: false,
        },
        announcement: {
            type: new DataTypes.STRING(512),
			unique: false,
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
		tableName: "U_BASIC_INFO",
		createdAt: 'create_date',
		updatedAt: 'update_date',
	}
);
