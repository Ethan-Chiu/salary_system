import { injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createLevelService,
	updateLevelService,
} from "../api/types/parameters_input_type";
import { Level } from "../database/entity/SALARY/level";
import { select_value } from "./helper_function";
import { Op } from "sequelize";

@injectable()
export class LevelService {
	constructor() {}

	async createLevel({
		level,
	}: z.infer<typeof createLevelService>): Promise<Level> {
		const newData = await Level.create({
			level: level,
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

	async getCurrentLevel(): Promise<Level[]> {
		const level = await this.getAllLevel();
		return level;
	}

	async getAllLevel(): Promise<Level[]> {
		const level = await Level.findAll({order: [['level', 'asc']], include: ['level_ranges']});
		return level;
	}

	async updateLevel({
		id,
		level,
	}: z.infer<typeof updateLevelService>): Promise<void> {
		const _level = await this.getLevelById(id!);
		if (_level == null) {
			throw new BaseResponseError("Level does not exist");
		}

		const affectedCount = await Level.update(
			{
				level: select_value(level, _level.level),
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

	async getLevelBySalary(
		salary: number,
		level_start: number,
		level_end: number
	): Promise<Level> {
		const levelList = await Level.findAll({
			where: {
				level: {
					[Op.gte]: salary,
				},
			},
		});
		const minLevel = await this.getLevelById(level_start);
		const maxLevel = await this.getLevelById(level_end);
		if (minLevel == null || maxLevel == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const targetLevel = levelList.sort((a, b) => a.level - b.level)[0]!;
		const level =
			targetLevel.level < minLevel.level
				? minLevel
				: targetLevel.level > maxLevel.level
				? maxLevel
				: targetLevel;
		return level;
	}
}
