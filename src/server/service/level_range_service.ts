import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { type z } from "zod";
import { LevelRange } from "../database/entity/SALARY/level_range";
import { select_value } from "./helper_function";
import { type createLevelRangeService, type updateLevelRangeService } from "../api/types/level_range_type";
import { LevelService } from "./level_service";

@injectable()
export class LevelRangeService {
	async createLevelRange({
		type,
		level_start_id,
		level_end_id,
	}: z.infer<typeof createLevelRangeService>): Promise<LevelRange> {
		const newData = await LevelRange.create({
			type: type,
			level_start_id: level_start_id,
			level_end_id: level_end_id,
			create_by: "system",
			update_by: "system",
		});

		return newData;
	}

	async getLevelRangeById(id: number): Promise<LevelRange | null> {
		const levelRange = await LevelRange.findOne({
			where: {
				id: id,
			}
		});
		return levelRange;
	}

	async getCurrentLevelRange(): Promise<LevelRange[]> {
		const levelRange = await this.getAllLevelRange();
		return levelRange;
	}

	async getAllLevelRange(): Promise<LevelRange[]> {
		const levelRange = await LevelRange.findAll({ raw: true });
		return levelRange;
	}

	async updateLevelRange({
		id,
		type,
		level_start_id,
		level_end_id,
	}: z.infer<typeof updateLevelRangeService>): Promise<void> {
		const levelRange = await this.getLevelRangeById(id!);
		if (levelRange == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}

		const affectedCount = await LevelRange.update(
			{
				type: select_value(type, levelRange.type),
				level_start_id: select_value(level_start_id, levelRange.level_start_id),
				level_end_id: select_value(level_end_id, levelRange.level_end_id),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteLevelRange(id: number): Promise<void> {
		const destroyedRows = await LevelRange.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
