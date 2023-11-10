// import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
// import { BaseMeta } from "./utils/base_meta";
// import { Char } from "./utils/utils";

// @Entity("U_TRUST_MONEY")
// export class TrustMoney extends BaseMeta {
// 	@PrimaryGeneratedColumn()
// 	id: number;

// 	@Column("int")
// 	position: number;

// 	@Column("varchar2", { length: Char(2) })
// 	position_type: string;

// 	@Column("int", { nullable: true })
// 	emp_trust_reserve_limit?: number | null;

// 	@Column("int")
// 	org_trust_reserve_limit: number;

// 	@Column("int", { nullable: true })
// 	emp_special_trust_incent_limit?: number | null;

// 	@Column("int")
// 	org_special_trust_incent_limit: number;
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

export class TrustMoney extends Model<
	InferAttributes<TrustMoney>,
	InferCreationAttributes<TrustMoney>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare position: number;
    declare position_type: string;
    declare emp_trust_reserve_limit: number | null;
    declare org_trust_reserve_limit: number;
    declare emp_special_trust_incent_limit: number | null;
    declare org_special_trust_incent_limit: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

TrustMoney.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
       position: {
            type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
        },
        position_type: {
            type: DataTypes.STRING(2),
			unique: false,
			allowNull: false,
        },
        emp_trust_reserve_limit: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        org_trust_reserve_limit: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        emp_special_trust_incent_limit: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
        },
        org_special_trust_incent_limit: {
            type: DataTypes.INTEGER.UNSIGNED,
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
		tableName: "U_TRUST_MONEY",
	}
);