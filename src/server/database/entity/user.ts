import {
	Association,
	DataTypes,
	HasManyAddAssociationMixin,
	HasManyCountAssociationsMixin,
	HasManyCreateAssociationMixin,
	HasManyGetAssociationsMixin,
	HasManyHasAssociationMixin,
	HasManySetAssociationsMixin,
	HasManyAddAssociationsMixin,
	HasManyHasAssociationsMixin,
	HasManyRemoveAssociationMixin,
	HasManyRemoveAssociationsMixin,
	Model,
	ModelDefined,
	Optional,
	Sequelize,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../client";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_id: string;
	declare hash: string; // for nullable fields
	declare auth_level: number;
	declare start_date: Date;
	declare end_date: Date | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
}

const sequelize = container.resolve(Database).connection;

User.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		emp_id: {
			type: new DataTypes.STRING(128),
			unique: true,
			allowNull: false,
		},
		hash: {
			type: new DataTypes.STRING(128),
			allowNull: false,
		},
		auth_level: {
			type: DataTypes.INTEGER.UNSIGNED,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		create_date: DataTypes.DATE,
		update_date: DataTypes.DATE,
	},
	{
		sequelize,
		tableName: "U_USER",
	}
);

