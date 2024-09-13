import { injectable } from "tsyringe";
import { BonusPosition } from "../database/entity/SALARY/bonus_position";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusPositionService,
	updateBonusPositionService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusPositionService {
	constructor() {}

	async createBonusPosition({
		period_id,
		bonus_type,
		position,
		multiplier,
	}: z.infer<typeof createBonusPositionService>): Promise<BonusPosition> {
		const newData = await BonusPosition.create({
			period_id: period_id,
			bonus_type: bonus_type,
			position: position,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusPositionById(id: number): Promise<BonusPosition | null> {
		const bonusPosition = await BonusPosition.findOne({
			where: {
				id: id,
			},
		});
		return bonusPosition;
	}

	async getBonusPositionByBonusType(period_id: number, bonus_type: BonusTypeEnumType): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
			},
		})
		return bonusPosition;
	}
	async getMultiplier(period_id: number, bonus_type: BonusTypeEnumType, position: number): Promise<number | undefined> {
        const multiplier = (await BonusPosition.findOne({
            where: {
                period_id: period_id,
                bonus_type: bonus_type,
				position: position
            }
        }))?.multiplier
        return multiplier
    }
	async getAllBonusPosition(): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll();
		return bonusPosition;
	}

	async updateBonusPosition({
		id,
		position,
		multiplier,
	}: z.infer<typeof updateBonusPositionService>): Promise<void> {
		const bonus_position = await this.getBonusPositionById(id!);
		if (bonus_position == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}

		const affectedCount = await BonusPosition.update(
			{
				position: select_value(position, bonus_position.position),
				multiplier: select_value(multiplier, bonus_position.multiplier),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusPosition(id: number): Promise<void> {
		const destroyedRows = await BonusPosition.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
