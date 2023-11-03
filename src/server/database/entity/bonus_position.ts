// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { BaseMeta } from "./utils/base_meta";
// import { Char } from "./utils/utils";

// @Entity("U_BONUS_POSITION")
// export class BonusPosition extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("int")
// 	position: number;

// 	@Column("varchar2", { length: Char(2) })
// 	position_type: string;

// 	@Column("float")
// 	multiplier: number;
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

export class BonusPosition extends Model<
	InferAttributes<BonusPosition>,
	InferCreationAttributes<BonusPosition>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare position: number;
    declare position_type: string;
    declare multiplier: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

BonusPosition.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        position: {
            type: DataTypes.INTEGER.UNSIGNED,
			unique: false,
			allowNull: false,
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
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		update_date: {
			type: DataTypes.DATEONLY,
			allowNull: false,
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "U_BONUS_POSITION",
	}
);
