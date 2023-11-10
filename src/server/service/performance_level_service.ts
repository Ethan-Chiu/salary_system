import { injectable } from "tsyringe";
import { Op } from "sequelize";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createPerformanceLevelInput,
	updatePerformanceLevelInput,
} from "../api/input_type/parameters_input";
import { PerformanceLevel } from "../database/entity/performance_level";

@injectable()
export class PerformanceLevelService {
	constructor() {}

	async createPerformanceLevel({
		performance_level,
		multiplier,
	}: z.infer<typeof createPerformanceLevelInput>): Promise<PerformanceLevel> {
		const newData = await PerformanceLevel.create({
			performance_level: performance_level,
			multiplier: multiplier,
			create_by: "system",
			update_by: "system",
		});
		return newData;
	}

	async getPerformanceLevelById(
		id: number
	): Promise<PerformanceLevel | null> {
		const performanceLevel = await PerformanceLevel.findOne({
			where: {
				id: id,
			},
		});
		return performanceLevel;
	}

	async getCurrentPerformanceLevel(): Promise<PerformanceLevel[]> {
		const performanceLevel = await this.getAllPerformanceLevel();
		return performanceLevel;
	}

	async getAllPerformanceLevel(): Promise<PerformanceLevel[]> {
		const performanceLevel = await PerformanceLevel.findAll();
		return performanceLevel;
	}

	async updatePerformanceLevel({
		id,
		performance_level,
		multiplier,
	}: z.infer<typeof updatePerformanceLevelInput>): Promise<void> {
		const performanceLevel = await this.getPerformanceLevelById(id!);
		if (performanceLevel == null) {
			throw new BaseResponseError("PerformanceLevel does not exist");
		}

		const affectedCount = await PerformanceLevel.update(
			{
				performance_level:
					performance_level ?? performanceLevel.performance_level,
				multiplier: multiplier ?? performanceLevel.multiplier,
				update_by: "system",
			},
			{ where: { id: id } }
		);
		if (affectedCount[0] != 1) {
			throw new BaseResponseError("Update error");
		}
	}

	async deletePerformanceLevel(id: number): Promise<void> {
		const destroyedRows = await PerformanceLevel.destroy({
			where: { id: id },
		});
		if (destroyedRows != 1) {
			throw new BaseResponseError("Delete error");
		}
	}
}
