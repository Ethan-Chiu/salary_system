import { injectable } from "tsyringe";
import { AttendanceSetting } from "../database/entity/attendance_setting";
import { Op, fn } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";
import { z } from "zod";
import {
	createAttendanceSettingInput,
	updateAttendanceSettingInput,
} from "../api/input_type/parameters_input";

@injectable()
export class AttendanceSettingService {
	constructor() {}

	async createAttendanceSetting({
		personal_leave_dock,
		sick_leave_dock,
		rate_of_unpaid_leave,
		unpaid_leave_compensatory_1,
		unpaid_leave_compensatory_2,
		unpaid_leave_compensatory_3,
		unpaid_leave_compensatory_4,
		unpaid_leave_compensatory_5,
		overtime_by_local_workers_1,
		overtime_by_local_workers_2,
		overtime_by_local_workers_3,
		local_worker_holiday,
		overtime_by_foreign_workers_1,
		overtime_by_foreign_workers_2,
		overtime_by_foreign_workers_3,
		foreign_worker_holiday,
		start_date,
		end_date,
	}: z.infer<
		typeof createAttendanceSettingInput
	>): Promise<AttendanceSetting> {
		const now = new Date();
		check_date(start_date, end_date, now);

		const newData = await AttendanceSetting.create({
			personal_leave_dock: personal_leave_dock,
			sick_leave_dock: sick_leave_dock,
			rate_of_unpaid_leave: rate_of_unpaid_leave,
			unpaid_leave_compensatory_1: unpaid_leave_compensatory_1,
			unpaid_leave_compensatory_2: unpaid_leave_compensatory_2,
			unpaid_leave_compensatory_3: unpaid_leave_compensatory_3,
			unpaid_leave_compensatory_4: unpaid_leave_compensatory_4,
			unpaid_leave_compensatory_5: unpaid_leave_compensatory_5,
			overtime_by_local_workers_1: overtime_by_local_workers_1,
			overtime_by_local_workers_2: overtime_by_local_workers_2,
			overtime_by_local_workers_3: overtime_by_local_workers_3,
			local_worker_holiday: local_worker_holiday,
			overtime_by_foreign_workers_1: overtime_by_foreign_workers_1,
			overtime_by_foreign_workers_2: overtime_by_foreign_workers_2,
			overtime_by_foreign_workers_3: overtime_by_foreign_workers_3,
			foreign_worker_holiday: foreign_worker_holiday,
			start_date: start_date ?? now,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getAttendanceSetting(): Promise<AttendanceSetting | null> {
		const now = new Date();
		const attendanceSettiingList = await AttendanceSetting.findAll({
			where: {
				start_date: {
					[Op.lte]: now,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: now }, { [Op.eq]: null }],
				},
			},
		});
		if (attendanceSettiingList.length > 1) {
			throw new BaseResponseError(
				"more than one active AttendanceSettiingList"
			);
		}

		const attendanceSettiing =
			attendanceSettiingList.length == 1
				? attendanceSettiingList[0]!
				: null;

		return attendanceSettiing;
	}

	async updateAttendanceSetting({
		id,
		personal_leave_dock,
		sick_leave_dock,
		rate_of_unpaid_leave,
		unpaid_leave_compensatory_1,
		unpaid_leave_compensatory_2,
		unpaid_leave_compensatory_3,
		unpaid_leave_compensatory_4,
		unpaid_leave_compensatory_5,
		overtime_by_local_workers_1,
		overtime_by_local_workers_2,
		overtime_by_local_workers_3,
		local_worker_holiday,
		overtime_by_foreign_workers_1,
		overtime_by_foreign_workers_2,
		overtime_by_foreign_workers_3,
		foreign_worker_holiday,
		start_date,
		end_date,
	}: z.infer<typeof updateAttendanceSettingInput>): Promise<void> {
		const attendance_setting = await this.getAttendanceSetting();
		if (attendance_setting == null) {
			throw new BaseResponseError("AttendanceSetting does not exist");
		}

		const now = new Date();
		const affectedCount = await AttendanceSetting.update(
			{
				personal_leave_dock:
					personal_leave_dock ??
					attendance_setting.personal_leave_dock,
				sick_leave_dock:
					sick_leave_dock ?? attendance_setting.sick_leave_dock,
				rate_of_unpaid_leave:
					rate_of_unpaid_leave ??
					attendance_setting.rate_of_unpaid_leave,
				unpaid_leave_compensatory_1:
					unpaid_leave_compensatory_1 ??
					attendance_setting.unpaid_leave_compensatory_1,
				unpaid_leave_compensatory_2:
					unpaid_leave_compensatory_2 ??
					attendance_setting.unpaid_leave_compensatory_2,
				unpaid_leave_compensatory_3:
					unpaid_leave_compensatory_3 ??
					attendance_setting.unpaid_leave_compensatory_3,
				unpaid_leave_compensatory_4:
					unpaid_leave_compensatory_4 ??
					attendance_setting.unpaid_leave_compensatory_4,
				unpaid_leave_compensatory_5:
					unpaid_leave_compensatory_5 ??
					attendance_setting.unpaid_leave_compensatory_5,
				overtime_by_local_workers_1:
					overtime_by_local_workers_1 ??
					attendance_setting.overtime_by_local_workers_1,
				overtime_by_local_workers_2:
					overtime_by_local_workers_2 ??
					attendance_setting.overtime_by_local_workers_2,
				overtime_by_local_workers_3:
					overtime_by_local_workers_3 ??
					attendance_setting.overtime_by_local_workers_3,
				local_worker_holiday:
					local_worker_holiday ??
					attendance_setting.local_worker_holiday,
				overtime_by_foreign_workers_1:
					overtime_by_foreign_workers_1 ??
					attendance_setting.overtime_by_foreign_workers_1,
				overtime_by_foreign_workers_2:
					overtime_by_foreign_workers_2 ??
					attendance_setting.overtime_by_foreign_workers_2,
				overtime_by_foreign_workers_3:
					overtime_by_foreign_workers_3 ??
					attendance_setting.overtime_by_foreign_workers_3,
				foreign_worker_holiday:
					foreign_worker_holiday ??
					attendance_setting.foreign_worker_holiday,
				start_date: start_date ?? attendance_setting.start_date,
				end_date: end_date ?? attendance_setting.end_date,
				update_date: now,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteAttendanceSetting(id: number): Promise<void> {
		const now = new Date();
		this.updateAttendanceSetting({
			id: id,
			personal_leave_dock: null,
			sick_leave_dock: null,
			rate_of_unpaid_leave: null,
			unpaid_leave_compensatory_1: null,
			unpaid_leave_compensatory_2: null,
			unpaid_leave_compensatory_3: null,
			unpaid_leave_compensatory_4: null,
			unpaid_leave_compensatory_5: null,
			overtime_by_local_workers_1: null,
			overtime_by_local_workers_2: null,
			overtime_by_local_workers_3: null,
			local_worker_holiday: null,
			overtime_by_foreign_workers_1: null,
			overtime_by_foreign_workers_2: null,
			overtime_by_foreign_workers_3: null,
			foreign_worker_holiday: null,
			start_date: null,
			end_date: now,
		});
	}
}
