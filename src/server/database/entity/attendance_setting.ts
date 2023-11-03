import {
	DataTypes,
	Model,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
} from "sequelize";
import { container } from "tsyringe";
import { Database } from "../client";

export class AttendanceSetting extends Model<
	InferAttributes<AttendanceSetting>,
	InferCreationAttributes<AttendanceSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
    declare personal_leave_dock: number;
    declare sick_leave_dock: number;
    declare rate_of_unpaid_leave: number;
    declare unpaid_leave_compensatory_1: number;
    declare unpaid_leave_compensatory_2: number;
    declare unpaid_leave_compensatory_3: number;
    declare unpaid_leave_compensatory_4: number;
    declare unpaid_leave_compensatory_5: number;
    declare overtime_by_local_workers_1: number;
    declare overtime_by_local_workers_2: number;
    declare overtime_by_local_workers_3: number;
    declare local_worker_holiday: number;
    declare overtime_by_foreign_workers_1: number;
    declare overtime_by_foreign_workers_2: number;
    declare overtime_by_foreign_workers_3: number;
    declare foreign_worker_holiday: number;
	declare start_date: Date;
	declare end_date: Date | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: Date;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: Date;
	declare update_by: string;
}

const sequelize = container.resolve(Database).connection;

AttendanceSetting.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		personal_leave_dock: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        sick_leave_dock: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        rate_of_unpaid_leave: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        unpaid_leave_compensatory_1: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        unpaid_leave_compensatory_2: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        unpaid_leave_compensatory_3: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        unpaid_leave_compensatory_4: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        unpaid_leave_compensatory_5: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        overtime_by_local_workers_1: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        overtime_by_local_workers_2: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        overtime_by_local_workers_3: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        local_worker_holiday: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        overtime_by_foreign_workers_1: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        overtime_by_foreign_workers_2: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        overtime_by_foreign_workers_3: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
        foreign_worker_holiday: {
			type: DataTypes.FLOAT,
			unique: false,
			allowNull: false,
		},
		start_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		end_date: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		create_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		create_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
		update_date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		update_by: {
			type: DataTypes.STRING(128),
			allowNull: false,
		},
	},
	{
		sequelize,
		tableName: "U_ATTENDANCE_SETTING",
	}
);