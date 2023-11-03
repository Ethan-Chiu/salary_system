// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Char } from "./utils/utils";
// import { BaseMeta } from "./utils/base_meta";

// @Entity("U_LEVEL")
// export class Level extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("int")
// 	level: number;
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

export class Level extends Model<
	InferAttributes<Level>,
	InferCreationAttributes<Level>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare level: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

Level.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        level: {
            type: DataTypes.INTEGER.UNSIGNED,
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
		tableName: "U_LEVEL",
	}
);