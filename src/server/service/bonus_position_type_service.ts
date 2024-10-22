import { injectable } from "tsyringe";
import { BonusPositionType } from "../database/entity/SALARY/bonus_position_type";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createBonusPositionTypeService,
	updateBonusPositionTypeService,
} from "../api/types/parameters_input_type";
import { select_value } from "./helper_function";
import { BonusTypeEnumType } from "../api/types/bonus_type_enum";

@injectable()
export class BonusPositionTypeService {
	constructor() {}

	async createBonusPositionType({
		period_id,
		bonus_type,
		position_type,
		multiplier,
	}: z.infer<
		typeof createBonusPositionTypeService
	>): Promise<BonusPositionType> {
		const newData = await BonusPositionType.create({
			period_id: period_id,
			bonus_type: bonus_type,
			position_type: position_type,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}
	async batchCreateBonusPositionType(
		data_array: z.infer<typeof createBonusPositionTypeService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				bonus_type: data.bonus_type,
				position_type: data.position_type,
				multiplier: data.multiplier,
				create_by: "system",
				update_by: "system",
			};
		});
		await BonusPositionType.bulkCreate(new_data_array);
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
	async getMultiplier(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		position_type: number
	): Promise<number> {
		const multiplier = (
			await BonusPositionType.findOne({
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					position_type: position_type,
				},
			})
		)?.multiplier;
		return multiplier ?? 0;
	}
	async getBonusPositionTypeByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	): Promise<BonusPositionType[] | null> {
		const bonusPositionType = await BonusPositionType.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
			},
		});
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
		if (affectedCount[0] == 0) {
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
