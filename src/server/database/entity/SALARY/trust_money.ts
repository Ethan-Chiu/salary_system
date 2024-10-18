import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class TrustMoney extends Model<
	InferAttributes<TrustMoney>,
	InferCreationAttributes<TrustMoney>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare position: number;
	declare position_type: string;
	declare org_trust_reserve_limit: number;
	declare org_special_trust_incent_limit: number;
	declare start_date: string;
	declare end_date: string | null;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initTrustMoney(sequelize: Sequelize) {
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
			org_trust_reserve_limit: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			org_special_trust_incent_limit: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			start_date: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			end_date: {
				type: DataTypes.STRING(128),
				allowNull: true,
			},
			disabled: {
				type: DataTypes.BOOLEAN,
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
}