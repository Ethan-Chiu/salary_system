import { injectable } from "tsyringe";
import { BonusPosition} from "../database/entity/bonus_position";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
    createBonusPositionInput,
	updateBonusPositionInput,
} from "../api/input_type/parameters_input";
import { select_value } from "./helper_function";


@injectable()
export class BonusPositionService {
	constructor() {}

	async createBonusPosition({
		position,
        multiplier,
	}: z.infer<typeof createBonusPositionInput>): Promise<BonusPosition> {
		const newData = await BonusPosition.create({
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

    async getCurrentBonusPosition(): Promise<BonusPosition[] | null> {
		const bonusPosition = this.getAllBonusPosition();
		return bonusPosition;
	}

	async getAllBonusPosition(): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll();
		return bonusPosition;
	}

	async updateBonusPosition({
		id,
		position,
        multiplier,
	}: z.infer<typeof updateBonusPositionInput>): Promise<void> {
		const bonus_position = await this.getBonusPositionById(id!);
		if (bonus_position == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}

		const affectedCount = await BonusPosition.update(
			{
				position: select_value(position, bonus_position.position),
				multiplier: select_value(multiplier , bonus_position.multiplier),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusPosition(id: number): Promise<void> {
        BonusPosition.destroy(
            { where: { id: id } }
        );
	}
}
