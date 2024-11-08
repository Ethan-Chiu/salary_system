import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { z } from "zod";
import {
	LongServiceEnum,
	type LongServiceEnumType,
} from "~/server/api/types/long_service_enum";
import { encodeString, decodeString } from "~/server/api/types/z_utils";
import { decDate, encDate } from "../../mapper/mapper_utils";

const dbEmployeePayment = z.object({
	emp_no: z.string(),
	long_service_allowance_type: LongServiceEnum,
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	base_salary: z.number().pipe(encodeString),
	food_allowance: z.number().pipe(encodeString),
	supervisor_allowance: z.number().pipe(encodeString),
	occupational_allowance: z.number().pipe(encodeString),
	subsidy_allowance: z.number().pipe(encodeString),
	long_service_allowance: z.number().pipe(encodeString),
	l_r_self: z.number().pipe(encodeString),
	l_i: z.number().pipe(encodeString),
	h_i: z.number().pipe(encodeString),
	l_r: z.number().pipe(encodeString),
	occupational_injury: z.number().pipe(encodeString),
});

const encFields = z.object({
	base_salary_enc: decodeString.pipe(z.coerce.number()),
	food_allowance_enc: decodeString.pipe(z.coerce.number()),
	supervisor_allowance_enc: decodeString.pipe(z.coerce.number()),
	occupational_allowance_enc: decodeString.pipe(z.coerce.number()),
	subsidy_allowance_enc: decodeString.pipe(z.coerce.number()),
	long_service_allowance_enc: decodeString.pipe(z.coerce.number()),
	l_r_self_enc: decodeString.pipe(z.coerce.number()),
	l_i_enc: decodeString.pipe(z.coerce.number()),
	h_i_enc: decodeString.pipe(z.coerce.number()),
	l_r_enc: decodeString.pipe(z.coerce.number()),
	occupational_injury_enc: decodeString.pipe(z.coerce.number()),
});

const encF = dbEmployeePayment.merge(encFields).merge(encDate);
const decF = dbEmployeePayment.merge(decFields).merge(decDate);

export type EmployeePaymentCreateEncType = z.input<typeof encF>;
export type EmployeePaymentDecType = z.input<typeof decF>;

export const decEmployeePayment = encF.transform((v) => ({
	...v,
	base_salary: v.base_salary_enc,
	food_allowance: v.food_allowance_enc,
	supervisor_allowance: v.supervisor_allowance_enc,
	occupational_allowance: v.occupational_allowance_enc,
	subsidy_allowance: v.subsidy_allowance_enc,
	long_service_allowance: v.long_service_allowance_enc,
	l_r_self: v.l_r_self_enc,
	l_i: v.l_i_enc,
	h_i: v.h_i_enc,
	l_r: v.l_r_enc,
	occupational_injury: v.occupational_injury_enc,
}));

export const encEmployeePayment = decF.transform((v) => ({
	...v,
	base_salary_enc: v.base_salary,
	food_allowance_enc: v.food_allowance,
	supervisor_allowance_enc: v.supervisor_allowance,
	occupational_allowance_enc: v.occupational_allowance,
	subsidy_allowance_enc: v.subsidy_allowance,
	long_service_allowance_enc: v.long_service_allowance,
	l_r_self_enc: v.l_r_self,
	l_i_enc: v.l_i,
	h_i_enc: v.h_i,
	l_r_enc: v.l_r,
	occupational_injury_enc: v.occupational_injury,
}));

export class EmployeePayment extends Model<
	InferAttributes<EmployeePayment>,
	InferCreationAttributes<EmployeePayment>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare base_salary_enc: string;
	declare food_allowance_enc: string;
	declare supervisor_allowance_enc: string;
	declare occupational_allowance_enc: string;
	declare subsidy_allowance_enc: string;
	declare long_service_allowance_enc: string;
	declare long_service_allowance_type: LongServiceEnumType;
	declare l_r_self_enc: string;
	declare l_i_enc: string;
	declare h_i_enc: string;
	declare l_r_enc: string;
	declare occupational_injury_enc: string;
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

export function initEmployeePayment(sequelize: Sequelize) {
	EmployeePayment.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			emp_no: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			base_salary_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			food_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			supervisor_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			occupational_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			subsidy_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			long_service_allowance_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			long_service_allowance_type: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_r_self_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_i_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			h_i_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			l_r_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			occupational_injury_enc: {
				type: DataTypes.STRING(128),
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
			tableName: "U_EMPLOYEE_PAYMENT",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
