import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createLevelInput,
	updateLevelInput,
} from "../api/input_type/parameters_input";
import { Level } from "../database/entity/level";
import { select_value } from "./helper_function";

@injectable()
export class LevelService {
	constructor() {}

	async createLevel({
		level,
	}: z.infer<typeof createLevelInput>): Promise<Level> {
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
		const level = await Level.findAll();
		return level;
	}

	async updateLevel({
		id,
		level,
	}: z.infer<typeof updateLevelInput>): Promise<void> {
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
		if (affectedCount[0] != 1) {
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
}
