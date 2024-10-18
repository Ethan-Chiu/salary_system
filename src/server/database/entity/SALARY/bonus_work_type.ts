import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";
import { BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import { WorkTypeEnumType } from "~/server/api/types/work_type_enum";

export class BonusWorkType extends Model<
	InferAttributes<BonusWorkType>,
	InferCreationAttributes<BonusWorkType>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare bonus_type: BonusTypeEnumType;
	declare work_type: WorkTypeEnumType;
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

export function initBonusWorkType(sequelize: Sequelize) {
	BonusWorkType.init(
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
			work_type: {
				type: new DataTypes.STRING(512),
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
			tableName: "U_BONUS_WORKTYPE",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}