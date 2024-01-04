import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class BonusPositionType extends Model<
	InferAttributes<BonusPositionType>,
	InferCreationAttributes<BonusPositionType>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare position_type: string;
	declare multiplier: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

BonusPositionType.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		position_type: {
			type: new DataTypes.STRING(2),
			unique: false,
			allowNull: false,
		},
		multiplier: {
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
		tableName: "U_BONUS_POSITION_TYPE",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
