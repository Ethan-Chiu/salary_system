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
	constructor() { }

	async createBonusPosition({
		period_id,
		bonus_type,
		position,
		position_multiplier,
		position_type,
		position_type_multiplier
	}: z.infer<typeof createBonusPositionService>): Promise<BonusPosition> {
		const newData = await BonusPosition.create(
			{
				period_id: period_id,
				bonus_type: bonus_type,
				position: position,
				position_multiplier: position_multiplier,
				position_type: position_type,
				position_type_multiplier: position_type_multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			}
		);
		return newData;
	}
	async batchCreateBonusPosition(
		data_array: z.infer<typeof createBonusPositionService>[]
	) {
		const new_data_array = data_array.map((data) => {
			return {
				period_id: data.period_id,
				bonus_type: data.bonus_type,
				position: data.position,
				position_multiplier: data.position_multiplier,
				position_type: data.position_type,
				position_type_multiplier: data.position_type_multiplier,
				disabled: false,
				create_by: "system",
				update_by: "system",
			};
		});
		await BonusPosition.bulkCreate(new_data_array);
	}
	async getBonusPositionById(id: number): Promise<BonusPosition | null> {
		const bonusPosition = await BonusPosition.findOne(
			{
				where: { id: id },
			}
		);
		return bonusPosition;
	}

	async getBonusPositionByBonusType(
		period_id: number,
		bonus_type: BonusTypeEnumType
	): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll({
			where: {
				period_id: period_id,
				bonus_type: bonus_type,
				disabled: false,
			},
		});
		return bonusPosition;
	}
	async getMultiplier(
		period_id: number,
		bonus_type: BonusTypeEnumType,
		position: number,
		position_type: string
	): Promise<number | undefined> {
		const position_multiplier = (
			await BonusPosition.findOne({
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					position: position,
					position_type: position_type,
				},
			})
		)?.position_multiplier;

		const position_type_multiplier = (
			await BonusPosition.findOne({
				where: {
					period_id: period_id,
					bonus_type: bonus_type,
					position: position,
					position_type: position_type,
				},
			})
		)?.position_type_multiplier;
		if (position_multiplier == undefined || position_type_multiplier == undefined) {
			return undefined;
		}
		return position_multiplier * position_type_multiplier;
	}
	async getAllBonusPosition(): Promise<BonusPosition[] | null> {
		const bonusPosition = await BonusPosition.findAll(
			{
				where: { disabled: false },
			}
		);
		return bonusPosition;
	}

	async updateBonusPosition({
		id,
		position,
		position_multiplier,
		position_type,
		position_type_multiplier,
	}: z.infer<typeof updateBonusPositionService>): Promise<void> {
		const bonus_position = await this.getBonusPositionById(id);
		if (bonus_position == null) {
			throw new BaseResponseError("BonusPosition does not exist");
		}

		await this.deleteBonusPosition(id);

		await this.createBonusPosition(
			{
				period_id: bonus_position.period_id,
				bonus_type: bonus_position.bonus_type,
				position: select_value(position, bonus_position.position),
				position_multiplier: select_value(position_multiplier, bonus_position.position_multiplier),
				position_type: select_value(position_type, bonus_position.position_type),
				position_type_multiplier: select_value(position_type_multiplier, bonus_position.position_type_multiplier),
			}
		);
	}

	async deleteBonusPosition(id: number): Promise<void> {
		const destroyedRows = await BonusPosition.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}
}
