import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	type Sequelize,
} from "sequelize";
import { z } from "zod";
import { dateF, dateStringF } from "../../mapper/mapper_utils";
import { dateToString, dateToStringNullable, decodeStringToNumber, encodeString, stringToDate, stringToDateNullable } from "~/server/api/types/z_utils";

const dbEmployeeTrust = z.object({
	emp_no: z.string(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
	emp_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
});

const encFields = z.object({
	emp_trust_reserve_enc: z.string(),
	emp_special_trust_incent_enc: z.string(),
});

const encF = dbEmployeeTrust.merge(encFields).merge(dateStringF);
const decF = dbEmployeeTrust.merge(decFields).merge(dateF);
export type EmployeeTrustDecType = z.input<typeof decF>;

export const decEmployeeTrust = encF
	.merge(z.object({ id: z.number(), create_date: z.date(), update_date: z.date() }))
	.transform((v) => ({
		...v,
		id: v.id,
		emp_trust_reserve: decodeStringToNumber.parse(v.emp_trust_reserve_enc),
		emp_special_trust_incent: decodeStringToNumber.parse(v.emp_special_trust_incent_enc),
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encEmployeeTrust = decF
	.omit({ id: true, create_date: true, update_date: true })
	.transform((v) => ({
		...v,
		emp_trust_reserve_enc: encodeString.parse(v.emp_trust_reserve),
		emp_special_trust_incent_enc: encodeString.parse(v.emp_special_trust_incent),
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);

export class EmployeeTrust extends Model<
	InferAttributes<EmployeeTrust>,
	InferCreationAttributes<EmployeeTrust>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare emp_no: string;
	declare emp_trust_reserve_enc: string;
	// declare org_trust_reserve_enc: string;
	declare emp_special_trust_incent_enc: string;
	// declare org_special_trust_incent_enc: string;
	// declare entry_date: string;
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




export function initEmployeeTrust(sequelize: Sequelize) {
	EmployeeTrust.init(
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
			emp_trust_reserve_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			// org_trust_reserve_enc: {
			// 	type: DataTypes.STRING(128),
			// 	allowNull: false,
			// },
			emp_special_trust_incent_enc: {
				type: DataTypes.STRING(128),
				allowNull: false,
			},
			// org_special_trust_incent_enc: {
			// 	type: DataTypes.STRING(128),
			// 	allowNull: false,
			// },
			// entry_date: {
			// 	type: DataTypes.STRING(128),
			// 	allowNull: false,
			// },
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
			tableName: "U_EMPLOYEE_TRUST",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
