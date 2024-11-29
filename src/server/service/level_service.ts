import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { type z } from "zod";
import {
	createLevelService,
	type updateLevelService,
} from "../api/types/parameters_input_type";
import {
	Level,
	type LevelDecType,
	decLevel,
	encLevel,
} from "../database/entity/SALARY/level";
import { get_date_string, select_value } from "./helper_function";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { LevelRangeService } from "./level_range_service";
import { BaseMapper } from "../database/mapper/base_mapper";

@injectable()
export class LevelService {
	private readonly levelMapper: BaseMapper<Level, LevelDecType>;

	constructor() {
		this.levelMapper = new BaseMapper<Level, LevelDecType>(
			encLevel,
			decLevel
		);
	}

	async createLevel(
		data: z.infer<typeof createLevelService>
	): Promise<Level> {
		const d = createLevelService.parse(data);

		const level = await this.levelMapper.encode({
			...d,
			start_date: d.start_date ?? new Date(),
			disabled: false,
			create_by: "system",
			update_by: "system",
		});

		const newData = await Level.create(level, {
			raw: true,
		});

		return newData;
	}

	async getLevelById(id: number): Promise<LevelDecType | null> {
		const level = await Level.findOne({
			where: {
				id: id,
			},
		});
		return this.levelMapper.decode(level);
	}

	async getLevelByLevel(
		level: number,
		start_date: string
	): Promise<LevelDecType | null> {
		const date = new Date(start_date);
		const start_date_string = get_date_string(
			new Date(date.setFullYear(date.getFullYear(), 0, 1))
		);
		const levelData = await Level.findOne({
			where: {
				level: level,
				start_date: start_date_string,
				disabled: false,
			},
		});
		return this.levelMapper.decode(levelData);
	}

	async getCurrentLevel(period_id: number): Promise<LevelDecType[]> {
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
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		return this.levelMapper.decodeList(level);
	}

	async getAllLevel(): Promise<LevelDecType[]> {
		const level = await Level.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		return this.levelMapper.decodeList(level);
	}

	async getAllFutureLevel(): Promise<LevelDecType[]> {
		const current_date_string = get_date_string(new Date());
		const level = await Level.findAll({
			where: {
				start_date: {
					[Op.gt]: current_date_string,
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		return this.levelMapper.decodeList(level);
	}

	async updateLevel({
		id,
		level,
		start_date,
		end_date,
	}: z.infer<typeof updateLevelService>): Promise<void> {
		const _level = await this.getLevelById(id);
		if (_level == null) {
			throw new BaseResponseError("Level does not exist");
		}

		await this.deleteLevel(id);

		const newData = await this.createLevel({
			level: select_value(level, _level.level),
			start_date: select_value(start_date, _level.start_date),
			end_date: select_value(end_date, _level.end_date),
		});

		const levelRangeService = container.resolve(LevelRangeService);
		await levelRangeService.updateLevelRangeId({
			old_id: id,
			new_id: newData.id,
		});
	}

	async deleteLevel(id: number): Promise<void> {
		const destroyedRows = await Level.update(
			{ disabled: true },
			{ where: { id: id } }
		);
		if (destroyedRows[0] == 0) {
			throw new BaseResponseError("Delete error");
		}
	}

	async getCurrentLevelBySalaryByDate(
		date: Date,
		salary: number,
		level_start_id: number,
		level_end_id: number
	): Promise<LevelDecType> {
		const minLevel = await this.getLevelById(level_start_id);
		const maxLevel = await this.getLevelById(level_end_id);
		const date_string = get_date_string(date);
		if (minLevel == null || maxLevel == null) {
			throw new BaseResponseError("Level does not exist");
		}
		const levelList = await Level.findAll({
			where: {
				level: {
					[Op.gte]: minLevel.level,
					[Op.lte]: maxLevel.level,
				},
				start_date: {
					[Op.lte]: date_string,
				},
				end_date: {
					[Op.or]: [{ [Op.gte]: date_string }, { [Op.eq]: null }],
				},
				disabled: false,
			},
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
			],
		});
		const targetLevel = levelList.find((level) => level.level >= salary);
		const result = targetLevel ?? levelList[levelList.length - 1]!;

		return this.levelMapper.decode(result);
	}

	async rescheduleLevel(): Promise<void> {
		const levelListEnc = await Level.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
				["update_date", "ASC"],
			],
		});

		const levelList = await this.levelMapper.decodeList(levelListEnc);

		for (const level of levelList) {
			const start_date = new Date(level.start_date);
			const start_date_adjust = new Date(
				start_date.setFullYear(start_date.getFullYear(), 0, 1)
			);
			const end_date = new Date(
				start_date.setFullYear(start_date.getFullYear(), 11, 31)
			);
			if (
				level.start_date != start_date_adjust ||
				level.end_date != end_date
			) {
				await this.updateLevel({
					id: level.id,
					start_date: start_date_adjust,
					end_date: end_date,
				});
			}
		}
		const updatedLevelList = await Level.findAll({
			where: { disabled: false },
			order: [
				["start_date", "DESC"],
				["level", "ASC"],
				["update_date", "ASC"],
			],
		});
		for (let i = 0; i < updatedLevelList.length - 1; i += 1) {
			if (
				updatedLevelList[i]!.level == updatedLevelList[i + 1]!.level &&
				updatedLevelList[i]!.start_date ==
					updatedLevelList[i + 1]!.start_date
			) {
				await this.deleteLevel(updatedLevelList[i]!.id);
			}
		}
	}
}
