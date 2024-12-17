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
	WorkStatusEnum,
	WorkStatusEnumType,
} from "~/server/api/types/work_status_enum";
import {
	WorkTypeEnum,
	type WorkTypeEnumType,
} from "~/server/api/types/work_type_enum";
import {
	dateCreateF,
	dateF,
	dateStringF,
	systemF,
	systemKeys,
} from "../../mapper/mapper_utils";

const dbEmployeeData = z.object({
	period_id: z.number(),
	emp_no: z.string(),
	emp_name: z.string(),
	position: z.number(), //職等
	position_type: z.string(), //職級
	group_insurance_type: z.string(),
	department: z.string(),
	work_type: WorkTypeEnum, //工作類別
	work_status: WorkStatusEnum, //工作型態
	disabilty_level: z.string().nullable(),
	sex_type: z.string(),
	dependents: z.number().nullable(),
	healthcare_dependents: z.number().nullable(),
	registration_date: z.string(),
	quit_date: z.string().nullable(),
	license_id: z.string().nullable(),
	bank_account: z.string(),
	create_by: z.string(),
	update_by: z.string(),
});

const decFields = z.object({
	id: z.number(),
});

const encFields = z.object({});

const encF = dbEmployeeData.merge(encFields);
const decF = dbEmployeeData.merge(decFields).merge(dateCreateF);
export type EmployeeDataDecType = z.input<typeof decF>;

export const decEmployeeData = encF
	.merge(systemF)
	.transform((v) => {
		return {
			...v,
			id: v.id,
		};
	})
	.pipe(decF);

export const encEmployeeData = decF
	.omit(systemKeys)
	.transform((v) => ({
		...v,
	}))
	.pipe(encF);
export class EmployeeData extends Model<
	InferAttributes<EmployeeData>,
	InferCreationAttributes<EmployeeData>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	declare period_id: number;
	declare emp_no: string;
	declare emp_name: string;
	declare position: number; //職等
	declare position_type: string; //職級
	declare group_insurance_type: string;
	declare department: string;
	declare work_type: WorkTypeEnumType; //工作類別
	declare work_status: WorkStatusEnumType; //工作型態
	declare disabilty_level: string | null;
	declare sex_type: string;
	declare dependents: number | null;
	declare healthcare_dependents: number | null;
	declare registration_date: string;
	declare quit_date: string | null;
	declare license_id: string | null;
	declare bank_account: string;
	// accumulated_bonus: z.number;
	// received_elderly_benefits: boolean;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initEmployeeData(sequelize: Sequelize) {
	EmployeeData.init(
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
			emp_no: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			emp_name: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			work_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			work_status: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			disabilty_level: {
				type: DataTypes.STRING,
			},
			department: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			position: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: false,
			},
			position_type: {
				type: DataTypes.STRING(2),
				allowNull: false,
			},
			sex_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			group_insurance_type: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			dependents: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			healthcare_dependents: {
				type: DataTypes.INTEGER.UNSIGNED,
				allowNull: true,
			},
			registration_date: {
				type: DataTypes.STRING(32),
				allowNull: false,
			},
			bank_account: {
				type: DataTypes.STRING(32),
			},
			quit_date: {
				type: DataTypes.STRING(32),
				allowNull: true,
			},
			license_id: {
				type: DataTypes.STRING(32),
			},
			// accumulated_bonus: {
			// 	type: DataTypes.INTEGER.UNSIGNED,
			// 	defaultValue: 0,
			// },
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
			tableName: "U_EMPLOYEE_DATA",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}
