import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
    createBonusSeniorityInput,
    updateBonusSeniorityInput,
} from "../api/input_type/parameters_input";
import { BonusSeniority } from "../database/entity/bonus_seniority";
import { select_value } from "./helper_function";


@injectable()
export class BonusSeniorityService {
	constructor() {}

	async createBonusSeniority({
		seniority,
        multiplier,
	}: z.infer<typeof createBonusSeniorityInput>): Promise<BonusSeniority> {
		const newData = await BonusSeniority.create({
            seniority: seniority,
            multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusSeniorityById(id: number): Promise<BonusSeniority | null> {
		const bonusSeniority = await BonusSeniority.findOne({
			where: {
				id: id,
			},
		});
		return bonusSeniority;
	}

    async getCurrentBonusSeniority(): Promise<BonusSeniority[] | null> {
		const bonusSeniority = this.getAllBonusSeniority();
		return bonusSeniority;
	}

	async getAllBonusSeniority(): Promise<BonusSeniority[] | null> {
		const bonusSeniority = await BonusSeniority.findAll();
		return bonusSeniority;
	}

	async updateBonusSeniority({
		id,
		seniority,
        multiplier,
	}: z.infer<typeof updateBonusSeniorityInput>): Promise<void> {
		const bonus_seniority = await this.getBonusSeniorityById(id!);
		if (bonus_seniority == null) {
			throw new BaseResponseError("BonusSeniority does not exist");
		}

		const affectedCount = await BonusSeniority.update(
			{
				seniority: select_value(seniority , bonus_seniority.seniority),
				multiplier: select_value(multiplier , bonus_seniority.multiplier),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusSeniority(id: number): Promise<void> {
        BonusSeniority.destroy(
            { where: { id: id } }
        );
	}
}
