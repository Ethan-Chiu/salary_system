import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional,
	Sequelize,
} from "sequelize";

export class AttendanceSetting extends Model<
	InferAttributes<AttendanceSetting>,
	InferCreationAttributes<AttendanceSetting>
> {
	// id can be undefined during creation when using `autoIncrement`
	declare id: CreationOptional<number>;
	// declare personal_leave_deduction: number;
	// declare sick_leave_deduction: number;
	// declare rate_of_unpaid_leave: number;
	// declare unpaid_leave_compensatory_1: number;
	// declare unpaid_leave_compensatory_2: number;
	// declare unpaid_leave_compensatory_3: number;
	// declare unpaid_leave_compensatory_4: number;
	// declare unpaid_leave_compensatory_5: number;
	declare overtime_by_local_workers_1: number;
	declare overtime_by_local_workers_2: number;
	declare overtime_by_local_workers_3: number;
	declare overtime_by_local_workers_4: number;
	declare overtime_by_local_workers_5: number;
	// declare local_worker_holiday: number;
	declare overtime_by_foreign_workers_1: number;
	declare overtime_by_foreign_workers_2: number;
	declare overtime_by_foreign_workers_3: number;
	declare overtime_by_foreign_workers_4: number;
	declare overtime_by_foreign_workers_5: number;
	// declare foreign_worker_holiday: number;
	declare start_date: string;
	declare end_date: string | null;

	// timestamps!
	// createdAt can be undefined during creation
	declare create_date: CreationOptional<Date>;
	declare create_by: string;
	// updatedAt can be undefined during creation
	declare update_date: CreationOptional<Date>;
	declare update_by: string;
}

export function initAttendanceSetting(sequelize: Sequelize) {
	AttendanceSetting.init(
		{
			id: {
				type: DataTypes.INTEGER.UNSIGNED,
				autoIncrement: true,
				primaryKey: true,
			},
			// personal_leave_deduction: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// sick_leave_deduction: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// rate_of_unpaid_leave: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// unpaid_leave_compensatory_1: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// unpaid_leave_compensatory_2: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// unpaid_leave_compensatory_3: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// unpaid_leave_compensatory_4: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
			// unpaid_leave_compensatory_5: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
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
			overtime_by_local_workers_4: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_local_workers_5: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			// local_worker_holiday: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
			// 	allowNull: false,
			// },
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
			overtime_by_foreign_workers_4: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			overtime_by_foreign_workers_5: {
				type: DataTypes.FLOAT,
				unique: false,
				allowNull: false,
			},
			// foreign_worker_holiday: {
			// 	type: DataTypes.FLOAT,
			// 	unique: false,
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
			tableName: "U_ATTENDANCE_SETTING",
			createdAt: "create_date",
			updatedAt: "update_date",
		}
	);
}