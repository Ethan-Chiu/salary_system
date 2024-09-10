import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class BonusDepartment extends Model<
	InferAttributes<BonusDepartment>,
	InferCreationAttributes<BonusDepartment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
    declare bonus_type: bonusTypeEnumType;
	declare department: string;
	declare multiplier: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initBonusDepartment(sequelize: Sequelize) {
	BonusDepartment.init(
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
			tableName: "U_BONUS_DEPARTMENT",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}