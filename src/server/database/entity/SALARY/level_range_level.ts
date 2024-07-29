import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    Sequelize,
} from "sequelize";

export class LevelRangeLevel extends Model<
    InferAttributes<LevelRangeLevel>,
    InferCreationAttributes<LevelRangeLevel>
> {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;

    // timestamps!
    // createdAt can be undefined during creation
    declare create_date: CreationOptional<Date>;
    declare create_by: string;
    // updatedAt can be undefined during creation
    declare update_date: CreationOptional<Date>;
    declare update_by: string;
}

export function initLevelRangeLevel(sequelize: Sequelize) {
    LevelRangeLevel.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
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
            tableName: "U_LEVEL_RANGE_LEVEL",
            createdAt: "create_date",
            updatedAt: "update_date",
        }
    );
}
