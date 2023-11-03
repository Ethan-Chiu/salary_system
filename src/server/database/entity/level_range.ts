// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Char } from "./utils/utils";
// import { BaseMeta } from "./utils/base_meta";

// @Entity("U_LEVEL_RANGE")
// export class LevelRange extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("varchar2", { length: Char(32) })
// 	type: string;

// 	@Column("int")
// 	level_start: number;

// 	@Column("int")
// 	level_end: number;
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

export class LevelRange extends Model<
	InferAttributes<LevelRange>,
	InferCreationAttributes<LevelRange>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare type: string;
    declare level_start: number;
    declare level_end: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

LevelRange.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        type: {
            type: DataTypes.STRING(32),
			allowNull: false,
        },
        level_start: {
            type: DataTypes.INTEGER.UNSIGNED,
			unique: false,
			allowNull: false,
        },
        level_end: {
            type: DataTypes.INTEGER.UNSIGNED,
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
		tableName: "U_LEVEL_RANGE",
	}
);