import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type Sequelize,
} from "sequelize";

export class LevelRange extends Model<
    InferAttributes<LevelRange>,
    InferCreationAttributes<LevelRange>
> {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;
    declare type: string;
    declare level_start_id: number;
    declare level_end_id: number;
    declare start_date: string;
    declare end_date: string | null;
    declare disabled: boolean;

    // timestamps!
    // createdAt can be undefined during creation
    declare create_date: CreationOptional<Date>;
    declare create_by: string;
    // updatedAt can be undefined during creation
    declare update_date: CreationOptional<Date>;
    declare update_by: string;
}

export function initLevelRange(sequelize: Sequelize) {
    LevelRange.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            type: {
                type: DataTypes.STRING(32),
                allowNull: false,
            },
            level_start_id: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            level_end_id: {
                type: DataTypes.INTEGER.UNSIGNED,
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
            tableName: "U_LEVEL_RANGE",
            createdAt: "create_date",
            updatedAt: "update_date",
        }
    );
}
