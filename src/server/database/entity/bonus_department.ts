// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
// import { Char } from "./utils/utils";
// import { BaseMeta } from "./utils/base_meta";

// @Entity("U_BONUS_DEPARTMENT")
// export class BonusDepartment extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("varchar2", { length: Char(32) })
// 	department: string;

// 	@Column("float")
// 	multiplier: string;
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

export class BonusDepartment extends Model<
	InferAttributes<BonusDepartment>,
	InferCreationAttributes<BonusDepartment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare department: string;
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

BonusDepartment.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        department: {
            type: new DataTypes.STRING(512),
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
		tableName: "U_BONUS_DEPARTMENT",
	}
);
