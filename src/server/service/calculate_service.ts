import * as bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { AttendanceSettingService } from "./attendance_setting_service";

@injectable()
export class CalculateService {
	constructor(private attendanceSettingService: AttendanceSettingService) {}

	async calcOvertimePay(
        overtime_1: number, 
        overtime_2: number, 
        is_foreign_worker: boolean, 
        is_leave:boolean, 
        is_day_pay: boolean): Promise<number> {
		
        const att_setting = await this.attendanceSettingService.getAttendanceSetting();
        if (att_setting === null) {
            throw new BaseResponseError("No attendance setting");
        }

        const money = 100; // dont know what this is

        if (is_leave) {
            return 0;
        }

        if (is_foreign_worker) {
            const pay = Math.round(att_setting.overtime_by_foreign_workers_1 * overtime_1 + att_setting.overtime_by_foreign_workers_2 * overtime_2);
            return pay;
        }

        if (is_day_pay) {
            const pay = Math.round(money / 8 * att_setting.overtime_by_foreign_workers_1 * overtime_1 + money / 8 * att_setting.overtime_by_foreign_workers_2 * overtime_2);
            return pay;
        }

        const pay = Math.round(money / 240 * att_setting.overtime_by_foreign_workers_1 * overtime_1 + money / 240 * att_setting.overtime_by_foreign_workers_2 * overtime_2);
        return pay;
	}

	
}
