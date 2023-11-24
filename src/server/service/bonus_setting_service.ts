import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";
import { z } from "zod";
import {
    createBonusSettingInput,
    updateBonusSettingInput,
} from "../api/input_type/parameters_input";
import { BonusSetting } from "../database/entity/bonus_setting";


@injectable()
export class BonusSettingService {
	constructor() {}

	async createBonusSetting({
		fixed_multiplier,
        criterion_date,
        base_on,
        type,
	}: z.infer<typeof createBonusSettingInput>): Promise<BonusSetting> {
		const now = new Date();
		// check_date(start_date, end_date, now);

		const newData = await BonusSetting.create({
            fixed_multiplier: fixed_multiplier,
            criterion_date: criterion_date,
            base_on: base_on,
            type: type,
			create_date: now,
			create_by: "system",
			update_date: now,
			update_by: "system",
		});
		return newData;
	}

	async getBonusSettingById(id: number): Promise<BonusSetting | null> {
		const now = new Date();
		const bonusSetting = await BonusSetting.findOne({
			where: {
				id: id,
			},
		});
		return bonusSetting;
	}

    async getCurrentBonusSetting(): Promise<BonusSetting[] > {
		const now = Date();
		const bonusSetting = await this.getAllBonusSetting();
        if (bonusSetting.length > 1) {
			throw new BaseResponseError("More than one bonus setting");
		}
		return bonusSetting;
	}

	async getAllBonusSetting(): Promise<BonusSetting[] > {
		const now = Date();
		const bonusSetting = await BonusSetting.findAll();
		return bonusSetting;
	}

	async updateBonusSetting({
		id,
		fixed_multiplier,
        criterion_date,
        base_on,
        type,
	}: z.infer<typeof updateBonusSettingInput>): Promise<void> {
		const bonus_setting = await this.getBonusSettingById(id);
		if (bonus_setting == null) {
			throw new BaseResponseError("BonusSetting does not exist");
		}

		const now = new Date();
		const affectedCount = await BonusSetting.update(
			{
				fixed_multiplier: fixed_multiplier ?? bonus_setting.fixed_multiplier,
				criterion_date: criterion_date ?? bonus_setting.criterion_date,
                base_on: base_on ?? bonus_setting.base_on,
                type: type ?? bonus_setting .type,
				update_date: now,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusSetting(id: number): Promise<void> {
		const now = new Date();
        BonusSetting.destroy(
            { where: { id: id } }
        );
	}
}
