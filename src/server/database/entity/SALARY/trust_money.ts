import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../../client";

export class TrustMoney extends Model<
	InferAttributes<TrustMoney>,
	InferCreationAttributes<TrustMoney>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare position_level: number;
	declare position_type: string;
	declare emp_trust_reserve_limit: number | null;
	declare org_trust_reserve_limit: number;
	declare emp_special_trust_incent_limit: number | null;
	declare org_special_trust_incent_limit: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
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
		position_level: {
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
		tableName: "U_TRUST_MONEY",
		createdAt: "create_date",
		updatedAt: "update_date",
	}
);
