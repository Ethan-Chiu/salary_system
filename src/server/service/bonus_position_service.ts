import { injectable } from "tsyringe";
import { BonusPosition} from "../database/entity/bonus_position";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { check_date } from "./helper_function";
import { z } from "zod";
import {
    createBonusPositionInput,
	updateBonusPositionInput,
} from "../api/input_type/parameters_input";


@injectable()
export class BonusPositionService {
	constructor() {}

	async createBonusPosition({
		position,
        position_type,
        multiplier,
	}: z.infer<typeof createBonusPositionInput>): Promise<BonusPosition> {
		const now = new Date();
		// check_date(start_date, end_date, now);

		const newData = await BonusPosition.create({
            position: position,
            position_type: position_type,
            multiplier: multiplier,
			create_date: now,
			create_by: "system",
			update_date: now,
			update_by: "system",
		});
		return newData;
	}

	async getBonusPositionById(id: number): Promise<BonusPosition | null> {
		const now = new Date();
		const bonusPosition = await BonusPosition.findOne({
			where: {
				id: id,
			},
		});
		return bonusPosition;
	}

    async getCurrentBonusPosition(): Promise<BonusPosition[] | null> {
		const now = Date();
		const bonusPosition = this.getAllBonusPosition();
		return bonusPosition;
	}

	async getAllBonusPosition(): Promise<BonusPosition[] | null> {
		const now = Date();
		const bonusPosition = await BonusPosition.findAll();
		return bonusPosition;
	}

	async updateBonusPosition({
		id,
		position,
        position_type,
        multiplier,
	}: z.infer<typeof updateBonusPositionInput>): Promise<void> {
		const bonus_position = await this.getBonusPositionById(id);
		if (bonus_position == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}

		const now = new Date();
		const affectedCount = await BonusPosition.update(
			{
				position: position?? bonus_position.position,
                position_type: position_type?? bonus_position.position_type,
				multiplier: multiplier ?? bonus_position.multiplier,
				update_date: now,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusPosition(id: number): Promise<void> {
		const now = new Date();
        BonusPosition.destroy(
            { where: { id: id } }
        );
	}
}
