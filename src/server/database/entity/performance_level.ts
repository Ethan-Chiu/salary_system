// import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
// import { BaseMeta } from './utils/base_meta';
// import { Char } from './utils/utils';

// @Entity('U_PERFORMANCE_LEVEL')
// export class PerformanceLevel extends BaseMeta{
//     @PrimaryGeneratedColumn()
//     id: number;

//     @Column('varchar2', { length: Char(32) })
//     performance_level: string;

//     @Column('float')
//     multiplier: number;
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

export class PerformanceLevel extends Model<
	InferAttributes<PerformanceLevel>,
	InferCreationAttributes<PerformanceLevel>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare performance_level: string;
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

PerformanceLevel.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        performance_level: {
            type: DataTypes.STRING(128),
			allowNull: false,
        },
        multiplier: {
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
		tableName: "U_PERFORMANCE_LEVEL",
	}
);