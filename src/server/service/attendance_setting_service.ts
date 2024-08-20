import { container, injectable } from "tsyringe";
import { AttendanceSetting } from "../database/entity/SALARY/attendance_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import { check_date, get_date_string, select_value } from "./helper_function";
import {
	createAttendanceSettingService,
	updateAttendanceSettingService,
} from "../api/types/parameters_input_type";
import { EHRService } from "./ehr_service";

@injectable()
export class AttendanceSettingService {
	constructor() {}

	async createAttendanceSetting({
		// personal_leave_deduction,
		// sick_leave_deduction,
		// rate_of_unpaid_leave,
		// unpaid_leave_compensatory_1,
		// unpaid_leave_compensatory_2,
		// unpaid_leave_compensatory_3,
		// unpaid_leave_compensatory_4,
		// unpaid_leave_compensatory_5,
		overtime_by_local_workers_1,
		overtime_by_local_workers_2,
		overtime_by_local_workers_3,
		overtime_by_local_workers_4,
		overtime_by_local_workers_5,
		overtime_by_foreign_workers_1,
		overtime_by_foreign_workers_2,
		overtime_by_foreign_workers_3,
		overtime_by_foreign_workers_4,
		overtime_by_foreign_workers_5,
		start_date,
		end_date,
	}: z.infer<
		typeof createAttendanceSettingService
	>): Promise<AttendanceSetting> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);
		const newData = await AttendanceSetting.create({
			// personal_leave_deduction: personal_leave_deduction,
			// sick_leave_deduction: sick_leave_deduction,
			// rate_of_unpaid_leave: rate_of_unpaid_leave,
			// unpaid_leave_compensatory_1: unpaid_leave_compensatory_1,
			// unpaid_leave_compensatory_2: unpaid_leave_compensatory_2,
			// unpaid_leave_compensatory_3: unpaid_leave_compensatory_3,
			// unpaid_leave_compensatory_4: unpaid_leave_compensatory_4,
			// unpaid_leave_compensatory_5: unpaid_leave_compensatory_5,
			overtime_by_local_workers_1: overtime_by_local_workers_1,
			overtime_by_local_workers_2: overtime_by_local_workers_2,
			overtime_by_local_workers_3: overtime_by_local_workers_3,
			overtime_by_local_workers_4: overtime_by_local_workers_4,
			overtime_by_local_workers_5: overtime_by_local_workers_5,
			overtime_by_foreign_workers_1: overtime_by_foreign_workers_1,
			overtime_by_foreign_workers_2: overtime_by_foreign_workers_2,
			overtime_by_foreign_workers_3: overtime_by_foreign_workers_3,
			overtime_by_foreign_workers_4: overtime_by_foreign_workers_4,
			overtime_by_foreign_workers_5: overtime_by_foreign_workers_5,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getCurrentAttendanceSetting(
		period_id: number
	): Promise<AttendanceSetting | null> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const attendanceSettingList = await AttendanceSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
		});
		if (attendanceSettingList.length > 1) {
			throw new BaseResponseError(
				"more than one active AttendanceSetting"
			);
		}

		const attendanceSetting =
			attendanceSettingList.length == 1
				? attendanceSettingList[0]!
				: null;

		return attendanceSetting;
	}

	async getAllAttendanceSetting(): Promise<AttendanceSetting[]> {
		const attendanceSettingList = await AttendanceSetting.findAll();
		return attendanceSettingList;
	}

	async getAttendanceSettingById(
		id: number
	): Promise<AttendanceSetting | null> {
		const attendanceSetting = await AttendanceSetting.findOne({
			where: {
				id: id,
			},
		});

		return attendanceSetting;
	}

	async updateAttendanceSetting({
		id,
		overtime_by_local_workers_1,
		overtime_by_local_workers_2,
		overtime_by_local_workers_3,
		overtime_by_local_workers_4,
		overtime_by_local_workers_5,
		overtime_by_foreign_workers_1,
		overtime_by_foreign_workers_2,
		overtime_by_foreign_workers_3,
		overtime_by_foreign_workers_4,
		overtime_by_foreign_workers_5,
		start_date,
		end_date,
	}: z.infer<typeof updateAttendanceSettingService>): Promise<void> {
		const attendance_setting = await this.getAttendanceSettingById(id!);
		if (attendance_setting == null) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}

		const affectedCount = await AttendanceSetting.update(
			{
				// personal_leave_deduction: select_value(
				// 	personal_leave_deduction,
				// 	attendance_setting.personal_leave_deduction
				// ),
				// sick_leave_deduction: select_value(
				// 	sick_leave_deduction,
				// 	attendance_setting.sick_leave_deduction
				// ),
				// rate_of_unpaid_leave: select_value(
				// 	rate_of_unpaid_leave,
				// 	attendance_setting.rate_of_unpaid_leave
				// ),
				// unpaid_leave_compensatory_1: select_value(
				// 	unpaid_leave_compensatory_1,
				// 	attendance_setting.unpaid_leave_compensatory_1
				// ),
				// unpaid_leave_compensatory_2: select_value(
				// 	unpaid_leave_compensatory_2,
				// 	attendance_setting.unpaid_leave_compensatory_2
				// ),
				// unpaid_leave_compensatory_3: select_value(
				// 	unpaid_leave_compensatory_3,
				// 	attendance_setting.unpaid_leave_compensatory_3
				// ),
				// unpaid_leave_compensatory_4: select_value(
				// 	unpaid_leave_compensatory_4,
				// 	attendance_setting.unpaid_leave_compensatory_4
				// ),
				// unpaid_leave_compensatory_5: select_value(
				// 	unpaid_leave_compensatory_5,
				// 	attendance_setting.unpaid_leave_compensatory_5
				// ),
				overtime_by_local_workers_1: select_value(
					overtime_by_local_workers_1,
					attendance_setting.overtime_by_local_workers_1
				),
				overtime_by_local_workers_2: select_value(
					overtime_by_local_workers_2,
					attendance_setting.overtime_by_local_workers_2
				),
				overtime_by_local_workers_3: select_value(
					overtime_by_local_workers_3,
					attendance_setting.overtime_by_local_workers_3
				),
				// local_worker_holiday: select_value(
				// 	local_worker_holiday,
				// 	attendance_setting.local_worker_holiday
				// ),
				overtime_by_foreign_workers_1: select_value(
					overtime_by_foreign_workers_1,
					attendance_setting.overtime_by_foreign_workers_1
				),
				overtime_by_foreign_workers_2: select_value(
					overtime_by_foreign_workers_2,
					attendance_setting.overtime_by_foreign_workers_2
				),
				overtime_by_foreign_workers_3: select_value(
					overtime_by_foreign_workers_3,
					attendance_setting.overtime_by_foreign_workers_3
				),
				overtime_by_foreign_workers_4: select_value(
					overtime_by_foreign_workers_4,
					attendance_setting.overtime_by_foreign_workers_4
				),
				overtime_by_foreign_workers_5: select_value(
					overtime_by_foreign_workers_5,
					attendance_setting.overtime_by_foreign_workers_5
				),
				// foreign_worker_holiday: select_value(
				// 	foreign_worker_holiday,
				// 	attendance_setting.foreign_worker_holiday
				// ),
				start_date: select_value(
					start_date,
					attendance_setting.start_date
				),
				end_date: select_value(end_date, attendance_setting.end_date),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteAttendanceSetting(id: number): Promise<void> {
		const destroyedRows = await AttendanceSetting.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleAttendanceSetting(): Promise<void> {
		const attendanceSettingList = await AttendanceSetting.findAll({
			order: [["start_date", "ASC"]],
		});

		for (let i = 0; i < attendanceSettingList.length - 1; i += 1) {
			const end_date_string = get_date_string(
				new Date(attendanceSettingList[i]!.dataValues.end_date!)
			);
			const start_date = new Date(
				attendanceSettingList[i + 1]!.dataValues.start_date
			);
			const new_end_date_string = get_date_string(
				new Date(start_date.setDate(start_date.getDate() - 1))
			);
			if (end_date_string != new_end_date_string) {
				await this.updateAttendanceSetting({
					id: attendanceSettingList[i]!.dataValues.id,
					end_date: new_end_date_string,
				});
			}
		}

		await this.updateAttendanceSetting({
			id: attendanceSettingList[attendanceSettingList.length - 1]!
				.dataValues.id,
			end_date: null,
		});
	}
}
