import { injectable } from "tsyringe";
import { BonusPositionType } from "../database/entity/bonus_position_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusPositionTypeService,
	updateBonusPositionTypeService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";

@injectable()
export class BonusPositionTypeService {
	constructor() {}

	async createBonusPositionType({
		position_type,
		multiplier,
	}: z.infer<
		typeof createBonusPositionTypeService
	>): Promise<BonusPositionType> {
		const newData = await BonusPositionType.create({
			position_type: position_type,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getBonusPositionTypeById(
		id: number
	): Promise<BonusPositionType | null> {
		const bonusPositionType = await BonusPositionType.findOne({
			where: {
				id: id,
			},
		});
		return bonusPositionType;
	}

	async getCurrentBonusPositionType(): Promise<BonusPositionType[] | null> {
		const bonusPositionType = this.getAllBonusPositionType();
		return bonusPositionType;
	}

	async getAllBonusPositionType(): Promise<BonusPositionType[] | null> {
		const bonusPositionType = await BonusPositionType.findAll();
		return bonusPositionType;
	}

	async updateBonusPositionType({
		id,
		position_type,
		multiplier,
	}: z.infer<typeof updateBonusPositionTypeService>): Promise<void> {
		const bonus_position_type = await this.getBonusPositionTypeById(id!);
		if (bonus_position_type == null) {
			throw new BaseResponseError("BonusPositionType does not exist");
		}

		const affectedCount = await BonusPositionType.update(
			{
				position_type: select_value(
					position_type,
					bonus_position_type.position_type
				),
				multiplier: select_value(
					multiplier,
					bonus_position_type.multiplier
				),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteBonusPositionType(id: number): Promise<void> {
		const destroyedRows = await BonusPositionType.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
