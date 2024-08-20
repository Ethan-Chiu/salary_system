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
	constructor() { }

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

	async getLevelByLevel(level: number): Promise<Level | null> {
		const _level = await Level.findOne({
			where: {
				level: level,
			},
		});

		return _level;
	}

	async getCurrentLevel(): Promise<Level[]> {
		const level = await this.getAllLevel();
		return level;
	}

	async getAllLevel(): Promise<Level[]> {
		const level = await Level.findAll({ order: [['level', 'asc']] });
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
		level_start_id: number,
		level_end_id: number
	): Promise<Level> {
		const minLevel = await this.getLevelById(level_start_id);
		const maxLevel = await this.getLevelById(level_end_id);
		if (minLevel == null || maxLevel == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const levelList = await Level.findAll({
			where: {
				level: {
					[Op.gte]: minLevel.level,
					[Op.lte]: maxLevel.level,
				},
			},
			order: [["level", "ASC"]]
		});
		const targetLevel = levelList.find((level) => level.level > salary);
		return targetLevel ?? levelList[levelList.length - 1]!;
	}
}
