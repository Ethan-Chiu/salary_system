import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { z } from "zod";
import { bonusTypeEnum, type BonusTypeEnumType } from "~/server/api/types/bonus_type_enum";
import {
	dateF,
	dateStringF,
	systemF,
	systemKeys,
} from "../../mapper/mapper_utils";
import {
	dateToString,
	dateToStringNullable,
	decodeStringToNumber as dSN,
	encodeString,
	stringToDate,
	stringToDateNullable,
} from "~/server/api/types/z_utils";

const dbEmployeeBonus = z.object({
	period_id: z.number(),
	bonus_type: bonusTypeEnum,
	emp_no: z.string(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
	special_multiplier: z.number(),
	multiplier: z.number(),
	fixed_amount: z.number(),
	bud_effective_salary: z.number(),
	bud_amount: z.number(),
	sup_performance_level: z.number(),
	sup_effective_salary: z.number(),
	sup_amount: z.number(),
	app_performance_level: z.number(),
	app_effective_salary: z.number(),
	app_amount: z.number(),
});

const encFields = z.object({
	special_multiplier_enc: z.string(),
	multiplier_enc: z.string(),
	fixed_amount_enc: z.string(),
	bud_effective_salary_enc: z.string(),
	bud_amount_enc: z.string(),
	sup_performance_level_enc: z.string(),
	sup_effective_salary_enc: z.string(),
	sup_amount_enc: z.string(),
	app_performance_level_enc: z.string(),
	app_effective_salary_enc: z.string(),
	app_amount_enc: z.string(),
});

const encF = dbEmployeeBonus.merge(encFields).merge(dateStringF);
const decF = dbEmployeeBonus.merge(decFields).merge(dateF);
export type EmployeeBonusDecType = z.input<typeof decF>;

export const decEmployeeBonus = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		special_multiplier: dSN.parse(v.special_multiplier_enc),
		multiplier: dSN.parse(v.multiplier_enc),
		fixed_amount: dSN.parse(v.fixed_amount_enc),
		bud_effective_salary: dSN.parse(v.bud_effective_salary_enc),
		bud_amount: dSN.parse(v.bud_amount_enc),
		sup_performance_level: dSN.parse(v.sup_performance_level_enc),
		sup_effective_salary: dSN.parse(v.sup_effective_salary_enc),
		sup_amount: dSN.parse(v.sup_amount_enc),
		app_performance_level: dSN.parse(v.app_performance_level_enc),
		app_effective_salary: dSN.parse(v.app_effective_salary_enc),
		app_amount: dSN.parse(v.app_amount_enc),
		// base
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encEmployeeBonus = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
    special_multiplier_enc: encodeString.parse(v.special_multiplier),
    multiplier_enc: encodeString.parse(v.multiplier),
    fixed_amount_enc: encodeString.parse(v.fixed_amount),
    bud_effective_salary_enc: encodeString.parse(v.bud_effective_salary),
    bud_amount_enc: encodeString.parse(v.bud_amount),
    sup_performance_level_enc: encodeString.parse(v.sup_performance_level),
    sup_effective_salary_enc: encodeString.parse(v.sup_effective_salary),
    sup_amount_enc: encodeString.parse(v.sup_amount),
    app_performance_level_enc: encodeString.parse(v.app_performance_level),
    app_effective_salary_enc: encodeString.parse(v.app_effective_salary),
    app_amount_enc: encodeString.parse(v.app_amount),
		// base
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class EmployeeBonus extends Model<
	InferAttributes<EmployeeBonus>,
	InferCreationAttributes<EmployeeBonus>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare bonus_type: BonusTypeEnumType;
	declare emp_no: string;
	declare special_multiplier_enc: string;
	declare multiplier_enc: string;
	declare fixed_amount_enc: string;
	declare bud_effective_salary_enc: string;
	declare bud_amount_enc: string;
	declare sup_performance_level_enc: string;
	declare sup_effective_salary_enc: string;
	declare sup_amount_enc: string;
	declare app_performance_level_enc: string;
	declare app_effective_salary_enc: string;
	declare app_amount_enc: string;
	declare disabled: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initEmployeeBonus(sequelize: Sequelize) {
	EmployeeBonus.init(
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
			bonus_type: {
				type: new DataTypes.STRING(32),
				allowNull: false,
			},
			emp_no: {
				type: new DataTypes.STRING(32),
				allowNull: false,
			},
			special_multiplier_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			multiplier_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			fixed_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			bud_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			bud_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_performance_level_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			sup_amount_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			app_performance_level_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			app_effective_salary_enc: {
				type: new DataTypes.STRING(128),
				allowNull: false,
			},
			app_amount_enc: {
				type: new DataTypes.STRING(128),
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
			tableName: "U_EMPLOYEE_BONUS",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
