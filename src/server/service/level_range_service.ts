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

		const newData = await LevelRange.create(
			{
				type: type,
				level_start_id: level_start_id,
				level_end_id: level_end_id,
				start_date: start_date ?? current_date_string,
				end_date: end_date,
				disabled: false,
				create_by: "system",
				update_by: "system",
			},
			{ raw: true }
		);

		return newData;
	}

	async getLevelRangeById(id: number): Promise<LevelRange | null> {
		const levelRange = await LevelRange.findOne(
			{
				where: { id: id },
			}
		);
		return levelRange;
	}

	async getCurrentLevelRange(period_id: number): Promise<LevelRange[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const levelRange = await LevelRange.findAll(
			{
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
					disabled: false,
				},
				raw: true
			}
		);
		return levelRange;
	}

	async getCurrentLevelRangeByDate(date: Date): Promise<LevelRange[]> {
		const date_string = get_date_string(date);
		const levelRange = await LevelRange.findAll(
			{
				where: {
					start_date: {
						[Op.lte]: date_string,
					},
					end_date: {
						[Op.or]: [
							{ [Op.gte]: date_string },
							{ [Op.eq]: null },
						],
					},
					disabled: false,
				},
				raw: true
			}
		);
		return levelRange;
	}

	async getAllLevelRange(): Promise<LevelRange[]> {
		const levelRange = await LevelRange.findAll({
			where: { disabled: false },
			order: [["start_date", "DESC"], ["type", "ASC"]],
			raw: true
		});
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
		const levelRange = await this.getLevelRangeById(id);
		if (levelRange == null) {
			throw new BaseResponseError("LevelRange does not exist");
		}

		await this.deleteLevelRange(id);

		await this.createLevelRange(
			{
				type: select_value(type, levelRange.type),
				level_start_id: select_value(level_start_id, levelRange.level_start_id),
				level_end_id: select_value(level_end_id, levelRange.level_end_id),
				start_date: select_value(start_date, levelRange.start_date),
				end_date: select_value(end_date, levelRange.end_date),
			},
		);
	}

	async updateLevelRangeId({
		old_id,
		new_id
	}: {
		old_id: number,
		new_id: number,
	}): Promise<void> {
		const levelRangeList = await LevelRange.findAll({ where: { disabled: false } });
		const promises = levelRangeList.map(async (levelRange) => {
			if (levelRange.level_start_id == old_id || levelRange.level_end_id == old_id) {
				this.updateLevelRange({
					id: levelRange.id,
					level_start_id: levelRange.level_start_id == old_id ? new_id : levelRange.level_start_id,
					level_end_id: levelRange.level_end_id == old_id ? new_id : levelRange.level_end_id,
				});
			}
		});

		await Promise.all(promises);
	}

	async deleteLevelRange(id: number): Promise<void> {
		const destroyedRows = await LevelRange.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async rescheduleLevelRange(): Promise<void> {
		const levelRangeList = await LevelRange.findAll(
			{
				where: { disabled: false },
				order: [
					['type', 'ASC'],
					["start_date", "ASC"],
					["update_date", "ASC"],
				],
			}
		);
		for (let i = 0; i < levelRangeList.length; i += 1) {
			const start_date = new Date(
				levelRangeList[i]!.start_date
			);
			const start_date_string = get_date_string(
				new Date(start_date.setFullYear(start_date.getFullYear(), 0, 1))
			);
			const end_date_string = get_date_string(
				new Date(start_date.setFullYear(start_date.getFullYear(), 11, 31))
			);
			if (levelRangeList[i]!.start_date != start_date_string || levelRangeList[i]!.end_date != end_date_string) {
				await this.updateLevelRange({
					id: levelRangeList[i]!.id,
					start_date: start_date_string,
					end_date: end_date_string,
				});
			}
		}

		const updatedLevelRangeList = await LevelRange.findAll(
			{
				where: { disabled: false },
				order: [
					['type', 'ASC'],
					["start_date", "ASC"],
					["update_date", "ASC"],
				],
			}
		);

		for (let i = 0; i < updatedLevelRangeList.length - 1; i += 1) {
			if (updatedLevelRangeList[i]!.type == updatedLevelRangeList[i + 1]!.type && updatedLevelRangeList[i]!.start_date == updatedLevelRangeList[i + 1]!.start_date) {
				await this.deleteLevelRange(updatedLevelRangeList[i]!.id);
			}
		}
	}
}
