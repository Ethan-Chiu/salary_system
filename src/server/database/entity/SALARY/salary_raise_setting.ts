import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class SalaryRaiseSetting extends Model<
	InferAttributes<SalaryRaiseSetting>,
	InferCreationAttributes<SalaryRaiseSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare fixed_multiplier: number;
	declare criterion_date: Date;
	declare base_on: string;
	declare type: string;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initSalaryRaiseSetting(sequelize: Sequelize) {
	SalaryRaiseSetting.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			fixed_multiplier: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			criterion_date: {
				type: DataTypes.DATE,
				allowNull: false,
			},
			base_on: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			type: {
				type: DataTypes.STRING(32),
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
			tableName: "U_SALARY_RAISE_SETTING",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}