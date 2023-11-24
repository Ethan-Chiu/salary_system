import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";
import { z } from "zod";
import {
    createBonusSeniorityInput,
    updateBonusSeniorityInput,
} from "../api/input_type/parameters_input";
import { BonusSeniority } from "../database/entity/bonus_seniority";


@injectable()
export class BonusSeniorityService {
	constructor() {}

	async createBonusSeniority({
		seniority,
        multiplier,
	}: z.infer<typeof createBonusSeniorityInput>): Promise<BonusSeniority> {
		const now = new Date();
		// check_date(start_date, end_date, now);

		const newData = await BonusSeniority.create({
            seniority: seniority,
            multiplier: multiplier,
			create_date: now,
			create_by: "system",
			update_date: now,
			update_by: "system",
		});
		return newData;
	}

	async getBonusSeniorityById(id: number): Promise<BonusSeniority | null> {
		const now = new Date();
		const bonusSeniority = await BonusSeniority.findOne({
			where: {
				id: id,
			},
		});
		return bonusSeniority;
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
