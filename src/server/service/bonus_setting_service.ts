import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusSettingService,
	updateBonusSettingService,
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
	}: z.infer<typeof createBonusSettingService>): Promise<BonusSetting> {
		const newData = await BonusSetting.create({
			fixed_multiplier: fixed_multiplier,
			criterion_date: criterion_date,
			base_on: base_on,
			type: type,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusSettingById(id: number): Promise<BonusSetting | null> {
		const bonusSetting = await BonusSetting.findOne({
			where: {
				id: id,
			},
		});
		return bonusSetting;
	}

	async getCurrentBonusSetting(): Promise<BonusSetting[]> {
		const bonusSetting = await this.getAllBonusSetting();
		if (bonusSetting.length > 1) {
			throw new BaseResponseError("more than one Bonus setting");
		}
		return bonusSetting;
	}

	async getAllBonusSetting(): Promise<BonusSetting[]> {
		const bonusSetting = await BonusSetting.findAll();
		return bonusSetting;
	}

	async updateBonusSetting({
		id,
		fixed_multiplier,
		criterion_date,
		base_on,
		type,
	}: z.infer<typeof updateBonusSettingService>): Promise<void> {
		const bonus_setting = await this.getBonusSettingById(id!);
		if (bonus_setting == null) {
			throw new BaseResponseError("BonusSetting does not exist");
		}

		const affectedCount = await BonusSetting.update(
			{
				fixed_multiplier:
					fixed_multiplier ?? bonus_setting.fixed_multiplier,
				criterion_date: criterion_date ?? bonus_setting.criterion_date,
				base_on: base_on ?? bonus_setting.base_on,
				type: type ?? bonus_setting.type,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusSetting(id: number): Promise<void> {
		BonusSetting.destroy({ where: { id: id } });
	}
}
