import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";
import { z } from "zod";
import {
	dateF,
	dateStringF,
	systemF,
	systemKeys,
} from "../../mapper/mapper_utils";
import {
	dateToString,
	dateToStringNullable,
	stringToDate,
	stringToDateNullable,
} from "~/server/api/types/z_utils";
const dbTrustMoney = z.object({
	position: z.number(),
	position_type: z.string(),
	org_trust_reserve_limit: z.number(),
	org_special_trust_incent_limit: z.number(),
	create_by: z.string(),
	update_by: z.string(),
	disabled: z.coerce.boolean(),
});

const decFields = z.object({
	id: z.number(),
});

const encF = dbTrustMoney.merge(dateStringF);
const decF = dbTrustMoney.merge(decFields).merge(dateF);
export type TrustMoneyDecType = z.input<typeof decF>;

export const decTrustMoney = encF
	.merge(systemF)
	.transform((v) => ({
		...v,
		id: v.id,
		start_date: stringToDate.parse(v.start_date),
		end_date: stringToDateNullable.parse(v.end_date),
	}))
	.pipe(decF);

export const encTrustMoney = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
		start_date: dateToString.parse(v.start_date),
		end_date: dateToStringNullable.parse(v.end_date),
	}))
	.pipe(encF);
export class TrustMoney extends Model<
	InferAttributes<TrustMoney>,
	InferCreationAttributes<TrustMoney>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare position: number;
	declare position_type: string;
	declare org_trust_reserve_limit: number;
	declare org_special_trust_incent_limit: number;
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

export function initTrustMoney(sequelize: Sequelize) {
	TrustMoney.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			position: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			position_type: {
				type: DataTypes.STRING(2),
				unique: false,
				allowNull: false,
			},
			org_trust_reserve_limit: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			org_special_trust_incent_limit: {
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
			tableName: "U_TRUST_MONEY",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
