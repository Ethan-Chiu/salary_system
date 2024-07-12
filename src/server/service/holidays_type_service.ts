import { container, injectable } from "tsyringe";
import { BankSetting } from "../database/entity/SALARY/bank_setting";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date, get_date_string, select_value } from "./helper_function";
import { z } from "zod";
import {
	createBankSettingService,
	createHolidaysTypeService,
	updateBankSettingService,
    updateHolidaysTypeService,
} from "../api/types/parameters_input_type";
import { EHRService } from "./ehr_service";
import { HolidaysType } from "../database/entity/SALARY/holidays_type";

@injectable()
export class HolidaysTypeService {
	constructor() {}

	async createHolidaysType({
        pay_id,
        holidays_name,
        multiplier,
        pay_type
	}: z.infer<typeof createHolidaysTypeService>): Promise<HolidaysType> {
		const newData = await HolidaysType.create({
            pay_id,
            holidays_name,
            multiplier,
            pay_type,
            create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getHolidaysTypeById(id: number): Promise<HolidaysType | null> {
		const holidaysType = await HolidaysType.findOne({
			where: {
				id: id,
			},
		});
		return holidaysType;
	}

	async getCurrentHolidaysType(): Promise<HolidaysType[]> {
		const holidaysType = await HolidaysType.findAll();
		return holidaysType;
	}

	async getAllHolidaysType(): Promise<HolidaysType[]> {
		const holidaysType = await HolidaysType.findAll();
		return holidaysType;
	}

	async updateHolidaysType({
		id,
        pay_id,
        holidays_name,
        multiplier,
        pay_type,
	}: z.infer<typeof updateHolidaysTypeService>): Promise<void> {
		const holidaysType = await this.getHolidaysTypeById(id!);
		if (holidaysType == null) {
			throw new BaseResponseError("HolidaysType does not exist");
		}
		const affectedCount = await HolidaysType.update(
			{
                pay_id: select_value(pay_id, holidaysType.pay_id),
                holidays_name: select_value(holidays_name, holidaysType.holidays_name),
                multiplier: select_value(multiplier, holidaysType.multiplier),
                pay_type: select_value(pay_type, holidaysType.pay_type),
                update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteHolidaysType(id: number): Promise<void> {
		const destroyedRows = await HolidaysType.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
