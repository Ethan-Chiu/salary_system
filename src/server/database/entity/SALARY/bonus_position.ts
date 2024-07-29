import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class BonusPosition extends Model<
	InferAttributes<BonusPosition>,
	InferCreationAttributes<BonusPosition>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare position: number;
	declare multiplier: number;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initBonusPosition(sequelize: Sequelize) {
	BonusPosition.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			position: {
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
			tableName: "U_BONUS_POSITION",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}