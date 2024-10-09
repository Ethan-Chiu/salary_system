import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    Sequelize,
} from "sequelize";

export class Level extends Model<
    InferAttributes<Level>,
    InferCreationAttributes<Level>
> {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;
    declare level: number;
    declare start_date: string;
    declare end_date: string | null;

    // timestamps!
    // createdAt can be undefined during creation
    declare create_date: CreationOptional<Date>;
    declare create_by: string;
    // updatedAt can be undefined during creation
    declare update_date: CreationOptional<Date>;
    declare update_by: string;
}

export function initLevel(sequelize: Sequelize) {
    Level.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            level: {
                type: DataTypes.INTEGER.UNSIGNED,
                unique: false,
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
            tableName: "U_LEVEL",
            createdAt: "create_date",
            updatedAt: "update_date",
        }
    );
}
