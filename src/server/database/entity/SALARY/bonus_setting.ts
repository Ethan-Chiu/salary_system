import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class BonusSetting extends Model<
	InferAttributes<BonusSetting>,
	InferCreationAttributes<BonusSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare fixed_multiplier: number;
    declare criterion_date: Date;
    declare base_on: string;
    declare type: string;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

BonusSetting.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        fixed_multiplier: {
            type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
        },
        criterion_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
        base_on: {
			type: DataTypes.STRING(32),
			allowNull: false,
		},
        type: {
            type: DataTypes.STRING(32),
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
		tableName: "U_BONUS_SETTING",
		createdAt: 'create_date',
		updatedAt: 'update_date',
	}
);