import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class SalaryRaisePosition extends Model<
	InferAttributes<SalaryRaisePosition>,
	InferCreationAttributes<SalaryRaisePosition>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare position: number;
	declare position_multiplier: number;
	declare position_type: string;
	declare position_type_multiplier: number;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initSalaryRaisePosition(sequelize: Sequelize) {
	SalaryRaisePosition.init(
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
			position: {
				type: DataTypes.INTEGER.UNSIGNED,
				unique: false,
				allowNull: false,
			},
			position_multiplier: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			position_type: {
				type: new DataTypes.STRING(2),
				unique: false,
				allowNull: false,
			},
			position_type_multiplier: {
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
			tableName: "U_SALARY_RAISE_POSITION",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}