import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";
import { z } from "zod";
import {
    createBonusSeniorityInput,
    createBonusSettingInput,
    updateBonusSeniorityInput,
} from "../api/input_type/parameters_input";
import { BonusSeniority } from "../database/entity/bonus_seniority";
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

    async getCurrentBonusSeniority(): Promise<BonusSeniority[] | null> {
		const now = Date();
		const bonusSeniority = this.getAllBonusSeniority();
		return bonusSeniority;
	}

	async getAllBonusSeniority(): Promise<BonusSeniority[] | null> {
		const now = Date();
		const bonusSeniority = await BonusSeniority.findAll();
		return bonusSeniority;
	}

	async updateBonusSeniority({
		id,
		seniority,
        multiplier,
	}: z.infer<typeof updateBonusSeniorityInput>): Promise<void> {
		const bonus_seniority = await this.getBonusSeniorityById(id);
		if (bonus_seniority == null) {
			throw new BaseResponseError("BonusSeniority does not exist");
		}

		const now = new Date();
		const affectedCount = await BonusSeniority.update(
			{
				seniority: seniority ?? bonus_seniority.seniority,
				multiplier: multiplier ?? bonus_seniority.multiplier,
				update_date: now,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusSeniority(id: number): Promise<void> {
		const now = new Date();
        BonusSeniority.destroy(
            { where: { id: id } }
        );
	}
}
