import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";

export class BonusSeniority extends Model<
	InferAttributes<BonusSeniority>,
	InferCreationAttributes<BonusSeniority>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare bonus_type: BonusTypeEnumType;
	declare seniority: number;
	declare multiplier: number;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initBonusSeniority(sequelize: Sequelize) {
	BonusSeniority.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			period_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			bonus_type: {
				type: new DataTypes.STRING(32),
				allowNull: false,
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
			tableName: "U_BONUS_SENIORITY",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}