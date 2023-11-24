import { injectable } from "tsyringe";
import { BonusPositionType} from "../database/entity/bonus_position_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusPositionTypeInput,
	updateBonusPositionInput,
} from "../api/input_type/parameters_input";
import { select_value } from "./helper_function";


@injectable()
export class BonusPositionTypeService {
	constructor() {}

	async createBonusPositionType({
        position_type,
        multiplier,
	}: z.infer<typeof createBonusPositionTypeInput>): Promise<BonusPositionType> {
		const newData = await BonusPositionType.create({
            position_type: position_type,
            multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusPositionById(id: number): Promise<BonusPositionType | null> {
		const bonusPosition = await BonusPositionType.findOne({
			where: {
				id: id,
			},
		});
		return bonusPosition;
	}

    async getCurrentBonusPosition(): Promise<BonusPositionType[] | null> {
		const bonusPosition = this.getAllBonusPosition();
		return bonusPosition;
	}

	async getAllBonusPosition(): Promise<BonusPositionType[] | null> {
		const bonusPosition = await BonusPositionType.findAll();
		return bonusPosition;
	}

	async updateBonusPosition({
		id,
		position,
        position_type,
        multiplier,
	}: z.infer<typeof updateBonusPositionInput>): Promise<void> {
		const bonus_position = await this.getBonusPositionById(id!);
		if (bonus_position == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}

		const affectedCount = await BonusPositionType.update(
			{
                position_type: select_value(position_type, bonus_position.position_type),
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
        BonusPositionType.destroy(
            { where: { id: id } }
        );
	}
}
