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

export interface CombinedData {
    id: number | null;
    start_date: string | null;
    end_date: string | null;
    bank_name: string | null;
    org_name: string | null;
  }

@injectable()
export class ExcelService {
	constructor() {}
    async getSheetA(ids: number[]): Promise<CombinedData[]> {
        const sheetADatas = Promise.all(ids.map(async (id) => {
            const attendanceSetting = await AttendanceSetting.findOne({
                where: {
                    id: id,
                },
                attributes: ['id', 'start_date', 'end_date'],
            });
            const bankSetting = await BankSetting.findOne({
                where: {
                    id: id,
                },
                attributes: ['bank_name', 'org_name'],
            })
            const combinedData : CombinedData = {
                id: attendanceSetting ? attendanceSetting.id : null,
                start_date: attendanceSetting ? attendanceSetting.start_date : null,
                end_date: attendanceSetting ? attendanceSetting.end_date : null,
                bank_name: bankSetting ? bankSetting.bank_name : null,
                org_name: bankSetting ? bankSetting.org_name : null,
              };
            
              return combinedData;
        }));
        return sheetADatas;
    }
    async getSheetB(): Promise<BankSetting[]> {
        const bankSetting = await BankSetting.findAll();
		return bankSetting;
    }
}