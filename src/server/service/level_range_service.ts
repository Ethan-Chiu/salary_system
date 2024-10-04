import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { type z } from "zod";
import { LevelRange } from "../database/entity/SALARY/level_range";
import { check_date, get_date_string, select_value } from "./helper_function";
import { type createLevelRangeService, type updateLevelRangeService } from "../api/types/level_range_type";
import { EHRService } from "./ehr_service";
import { Op } from "sequelize";

@injectable()
export class LevelRangeService {
	async createLevelRange({
		type,
		level_start_id,
		level_end_id,
		start_date,
		end_date
	}: z.infer<typeof createLevelRangeService>): Promise<LevelRange> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);

		const newData = await LevelRange.create({
			type: type,
			level_start_id: level_start_id,
			level_end_id: level_end_id,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		}, { raw: true });

		return newData;
	}

	async getLevelRangeById(id: number): Promise<LevelRange | null> {
		const levelRange = await LevelRange.findOne({
			where: {
				id: id,
			},
		});
		return levelRange;
	}

	async getCurrentLevelRange(period_id: number): Promise<LevelRange[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const levelRange = await LevelRange.findAll({
			where: {
				start_date: {
					[Op.lte]: current_date_string,
				},
				end_date: {
					[Op.or]: [
						{ [Op.gte]: current_date_string },
						{ [Op.eq]: null },
					],
				},
			},
			raw: true
		});
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
		start_date,
		end_date
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
				start_date: select_value(start_date, levelRange.start_date),
				end_date: select_value(end_date, levelRange.end_date),
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
