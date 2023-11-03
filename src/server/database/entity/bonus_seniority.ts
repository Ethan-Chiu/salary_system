// import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"
// import { BaseMeta } from "./utils/base_meta"

// @Entity("U_BONUS_SENIORITY")
// export class BonusSeniority extends BaseMeta {
//     @PrimaryGeneratedColumn()
//     id: number

//     @Column("int")
//     seniority: number

//     @Column("float")
//     multiplier: number
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

export class BonusSeniority extends Model<
	InferAttributes<BonusSeniority>,
	InferCreationAttributes<BonusSeniority>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare seniority: number;
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

BonusSeniority.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
        seniority: {
            type: DataTypes.INTEGER.UNSIGNED,
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
		tableName: "U_BONUS_SENIORITY",
	}
);