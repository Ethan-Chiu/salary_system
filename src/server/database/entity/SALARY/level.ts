import {
    DataTypes,
    Model,
    type InferAttributes,
    type InferCreationAttributes,
    type CreationOptional,
    type Sequelize,
} from "sequelize";
import { z } from "zod";
import { dateF, dateStringF, systemF, systemKeys } from "../../mapper/mapper_utils";
import { dateToString, dateToStringNullable, stringToDate, stringToDateNullable } from "~/server/api/types/z_utils";

const dbLevel = z.object({
  level: z.number(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbLevel.merge(dateStringF);
const decF = dbLevel.merge(decFields).merge(dateF);
export type LevelDecType = z.input<typeof decF>;

export const decLevel = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encLevel = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class Level extends Model<
    InferAttributes<Level>,
    InferCreationAttributes<Level>
> {
    // id can be undefined during creation when using `autoIncrement`
    declare id: CreationOptional<number>;
    declare level: number;
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
            tableName: "U_LEVEL",
            createdAt: "create_date",
            updatedAt: "update_date",
        }
    );
}
