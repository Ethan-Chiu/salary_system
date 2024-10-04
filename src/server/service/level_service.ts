import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createLevelService,
	updateLevelService,
} from "../api/types/parameters_input_type";
import { Level } from "../database/entity/SALARY/level";
import { check_date, get_date_string, select_value } from "./helper_function";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";

@injectable()
export class LevelService {
	constructor() { }

	async createLevel({
		level,
		start_date,
		end_date,
	}: z.infer<typeof createLevelService>): Promise<Level> {
		const current_date_string = get_date_string(new Date());
		check_date(start_date, end_date, current_date_string);

		const newData = await Level.create({
			level: level,
			start_date: start_date ?? current_date_string,
			end_date: end_date,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getLevelById(id: number): Promise<Level | null> {
		const level = await Level.findOne({
			where: {
				id: id,
			},
		});
		return level;
	}

	async getCurrentLevelById(period_id: number, id: number): Promise<Level | null> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const _level = await Level.findOne({
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
				id: id,
			},
		});

		return _level;
	}

	async getCurrentLevel(period_id: number): Promise<Level[]> {
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const level = await Level.findAll({
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
			}, order: [['level', 'asc']]
		});
		return level;
	}

	async getAllLevel(): Promise<Level[]> {
		const level = await Level.findAll({ order: [['level', 'asc']] });
		return level;
	}

	async updateLevel({
		id,
		level,
		start_date,
		end_date,
	}: z.infer<typeof updateLevelService>): Promise<void> {
		const _level = await this.getLevelById(id!);
		if (_level == null) {
			throw new BaseResponseError("Level does not exist");
		}

		const affectedCount = await Level.update(
			{
				level: select_value(level, _level.level),
				start_date: select_value(start_date, _level.start_date),
				end_date: select_value(end_date, _level.end_date),
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] == 0) {
			throw new BaseResponseError("Update error");
		}
	}

	async deleteLevel(id: number): Promise<void> {
		const destroyedRows = await Level.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}

	async getCurrentLevelBySalary(
		period_id: number,
		salary: number,
		level_start_id: number,
		level_end_id: number
	): Promise<Level> {
		const minLevel = await this.getLevelById(level_start_id);
		const maxLevel = await this.getLevelById(level_end_id);
		if (minLevel == null || maxLevel == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const ehr_service = container.resolve(EHRService);
		const period = await ehr_service.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const levelList = await Level.findAll({
			where: {
				level: {
					[Op.gte]: minLevel.level,
					[Op.lte]: maxLevel.level,
				},
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
			order: [["level", "ASC"]]
		});
		const targetLevel = levelList.find((level) => level.level >= salary);
		return targetLevel ?? levelList[levelList.length - 1]!;
	}
}
