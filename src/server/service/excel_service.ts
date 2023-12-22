import { injectable } from "tsyringe";
import { AttendanceSetting } from "../database/entity/SALARY/attendance_setting";
import { container } from "tsyringe";
import { Database } from "../database/client";
import { QueryTypes } from "sequelize";
import { Period } from "../database/entity/UMEDIA/period";
import { Overtime } from "../database/entity/UMEDIA/overtime";
import { Payset } from "../database/entity/UMEDIA/payset";
import { BankSetting } from "../database/entity/SALARY/bank_setting";
import { Holiday } from "../database/entity/UMEDIA/holiday";

@injectable()
export class ExcelService {
	constructor() {}
    async getSheetA(): Promise<AttendanceSetting[]> {
        const attendanceSetting = await AttendanceSetting.findAll();
        return attendanceSetting;
    }
    async getSheetB(): Promise<BankSetting[]> {
        const bankSetting = await BankSetting.findAll();
		return bankSetting;
    }
}