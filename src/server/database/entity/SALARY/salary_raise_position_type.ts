import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class SalaryRaisePositionType extends Model<
	InferAttributes<SalaryRaisePositionType>,
	InferCreationAttributes<SalaryRaisePositionType>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare position_type: string;
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

export function initSalaryRaisePositionType(sequelize: Sequelize) {
	SalaryRaisePositionType.init(
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
			position_type: {
				type: new DataTypes.STRING(2),
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
			tableName: "U_SALARY_RAISE_POSITION_TYPE",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}