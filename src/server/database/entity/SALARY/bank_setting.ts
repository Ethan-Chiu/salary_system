import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import {
	dateF,
	dateStringF,
	systemF,
	systemKeys,
} from "../../mapper/mapper_utils";
import { z } from "zod";
import {
	dateToString,
	dateToStringNullable,
	stringToDate,
	stringToDateNullable,
} from "~/server/api/types/z_utils";

const dbBankSetting = z.object({
  bank_code: z.string(),
  bank_name: z.string(),
  org_code: z.string(),
  org_name: z.string(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbBankSetting.merge(dateStringF);
const decF = dbBankSetting.merge(decFields).merge(dateF);
export type BankSettingDecType = z.input<typeof decF>;

export const decBankSetting = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encBankSetting = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class BankSetting extends Model<
	InferAttributes<BankSetting>,
	InferCreationAttributes<BankSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare bank_code: string;
	declare bank_name: string;
	declare org_code: string;
	declare org_name: string;
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

export function initBankSetting(sequelize: Sequelize) {
	BankSetting.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			bank_code: {
				type: new DataTypes.STRING(128),
				unique: false,
				allowNull: false,
			},
			bank_name: {
				type: new DataTypes.STRING(128),
				unique: false,
				allowNull: false,
			},
			org_code: {
				type: new DataTypes.STRING(128),
				unique: false,
				allowNull: false,
			},
			org_name: {
				type: new DataTypes.STRING(128),
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
			tableName: "U_BANK_SETTING",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}

