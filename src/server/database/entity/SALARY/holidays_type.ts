import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class HolidaysType extends Model<
	InferAttributes<HolidaysType>,
	InferCreationAttributes<HolidaysType>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare pay_id: number;
	declare holidays_name: string;
	declare multiplier: number;
	declare pay_type: number;
	declare disabled: boolean;
	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initHolidaysType(sequelize: Sequelize) {
	HolidaysType.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			pay_id: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			holidays_name: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			multiplier: {
				type: DataTypes.FLOAT,
				allowNull: false,
			},
			pay_type: {
				type: DataTypes.INTEGER.UNSIGNED,
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
			tableName: "U_HOLIDAYS_TYPE",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}