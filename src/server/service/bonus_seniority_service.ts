import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusSeniorityService,
	updateBonusSeniorityService,
} from "../api/types/parameters_input_type";
import { BonusSeniority } from "../database/entity/SALARY/bonus_seniority";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusSeniorityService {
	constructor() {}

	async createBonusSeniority({
		period_id,
		bonus_type,
		seniority,
		multiplier,
	}: z.infer<typeof createBonusSeniorityService>): Promise<BonusSeniority> {
		const newData = await BonusSeniority.create({
			period_id: period_id,
			bonus_type: bonus_type,
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

	async getBonusSeniorityByBonusType(period_id: number, bonus_type: BonusTypeEnumType): Promise<BonusSeniority[] | null> {
		const bonusSeniority = await BonusSeniority.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
			},
		})
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
	}: z.infer<typeof updateBonusSeniorityService>): Promise<void> {
		const bonus_seniority = await this.getBonusSeniorityById(id!);
		if (bonus_seniority == null) {
			throw new BaseResponseError("BonusSeniority does not exist");
		}

		const affectedCount = await BonusSeniority.update(
			{
				seniority: select_value(seniority, bonus_seniority.seniority),
				multiplier: select_value(
					multiplier,
					bonus_seniority.multiplier
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusSeniority(id: number): Promise<void> {
		const destroyedRows = await BonusSeniority.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
