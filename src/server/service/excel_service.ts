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
import { BaseResponseError } from "../api/error/BaseResponseError";

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
            if(! attendanceSetting || ! bankSetting) {
                throw new BaseResponseError("AttendanceSetting or BankSetting does not exist");
            }
            const combinedData : CombinedData = {
                id: attendanceSetting.id ,
                start_date:  attendanceSetting.start_date ,
                end_date: attendanceSetting.end_date,
                bank_name: bankSetting.bank_name,
                org_name: bankSetting.org_name,
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