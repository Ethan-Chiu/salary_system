import { container, injectable } from "tsyringe";
import { BaseResponseError } from "../api/error/BaseResponseError";
import { z } from "zod";
import {
	createLevelService,
	updateLevelService,
} from "../api/types/parameters_input_type";
import { decLevel, encLevel, Level, LevelDecType } from "../database/entity/SALARY/level";
import { check_date, get_date_string, select_value } from "./helper_function";
import { Op } from "sequelize";
import { EHRService } from "./ehr_service";
import { LevelRangeService } from "./level_range_service";
import { BaseMapper } from "../database/mapper/base_mapper";

@injectable()
export class LevelService {
	private readonly levelMapper: BaseMapper<
		Level,
		LevelDecType
	>;

	constructor(private readonly ehrService: EHRService, private readonly levelRangeService: LevelRangeService) {
		this.levelMapper = new BaseMapper<
			Level,
			LevelDecType
		>(encLevel, decLevel);
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

	async getLevelById(id: number): Promise<LevelDecType> {
		const level = await Level.findOne({
			where: {
				id: id,
			},
		});

		if (level == null) {
			throw new BaseResponseError("Level does not exist");
		}

		return await this.levelMapper.decode(level);
	}

	async getLevelByLevel(level: number, start_date: string): Promise<LevelDecType> {
		const date = new Date(start_date);
		const start_date_string = get_date_string(
			new Date(date.setFullYear(date.getFullYear(), 0, 1))
		);
		const levelData = await Level.findOne(
			{
				where: {
					level: level,
					start_date: start_date_string,
					disabled: false,
				},
			}
		);
		return await this.levelMapper.decode(levelData);
	}

	async getCurrentLevel(period_id: number): Promise<LevelDecType[]> {
		const period = await this.ehrService.getPeriodById(period_id);
		const current_date_string = period.end_date;
		const level = await Level.findAll(
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
				order: [["start_date", "DESC"], ["level", "ASC"]]
			}
		);

		return await this.levelMapper.decodeList(level);
	}

	async getAllLevel(): Promise<LevelDecType[]> {
		const level = await Level.findAll(
			{
				where: { disabled: false },
				order: [["start_date", "DESC"], ["level", "ASC"]]
			}
		);
		return await this.levelMapper.decodeList(level);
	}

	async getAllFutureLevel(): Promise<LevelDecType[]> {
		const current_date_string = get_date_string(new Date());
		const level = await Level.findAll(
			{
				where: {
					start_date: {
						[Op.gt]: current_date_string,
					},
					disabled: false,
				},
				order: [["start_date", "DESC"], ["level", "ASC"]]
			}
		);

		return await this.levelMapper.decodeList(level);
	}

	async updateLevel(data: z.infer<typeof updateLevelService>): Promise<void> {
		const transData = await this.getLevelAfterSelectValue(data);
		const newData = await this.createLevel(transData);
		await this.deleteLevel(data.id);
		await this.levelRangeService.updateLevelRangeId({ old_id: data.id, new_id: newData.id });
	}

	async deleteLevel(id: number): Promise<void> {
		const attendance_setting = await this.getLevelById(id);
		if (attendance_setting == null) {
			throw new BaseResponseError("Level does not exist");
		}
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
		const levelList = await Level.findAll(
			{
				where: {
					level: {
						[Op.gte]: minLevel.level,
						[Op.lte]: maxLevel.level,
					},
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
				order: [["start_date", "DESC"], ["level", "ASC"]]
			}
		);
		const targetLevel = levelList.find((level) => level.level >= salary);
		return await this.levelMapper.decode(targetLevel ?? levelList[levelList.length - 1]!);
	}

	async rescheduleLevel(): Promise<void> {
		const encodedList = await Level.findAll(
			{
				where: { disabled: false },
				order: [["start_date", "DESC"], ["level", "ASC"], ["update_date", "ASC"]],
			}
		);

		const levelList = await this.levelMapper.decodeList(
			encodedList
		);

		for (let i = 0; i < levelList.length; i += 1) {
			const end_date = levelList[i]!.end_date;
			const start_date = levelList[i]!.start_date;


			const new_start_date = new Date(start_date.setFullYear(start_date.getFullYear(), 0, 1))
			const new_end_date = new Date(start_date.setFullYear(start_date.getFullYear(), 11, 31))

			if (start_date.getTime() != new_start_date.getTime() || end_date?.getTime() != new_end_date.getTime()) {
				await this.updateLevel({
					id: levelList[i]!.id,
					start_date: new_start_date,
					end_date: new_end_date,
				});
			}
		}
		const updatedLevelList = await Level.findAll(
			{
				where: { disabled: false },
				order: [["start_date", "DESC"], ["level", "ASC"], ["update_date", "ASC"]],
			}
		);
		for (let i = 0; i < updatedLevelList.length - 1; i += 1) {
			if (updatedLevelList[i]!.level == updatedLevelList[i + 1]!.level && updatedLevelList[i]!.start_date == updatedLevelList[i + 1]!.start_date) {
				await this.deleteLevel(updatedLevelList[i]!.id);
			}
		}
	}

	private async getLevelAfterSelectValue({
		id,
		level,
		start_date,
		end_date,
	}: z.infer<typeof updateLevelService>): Promise<
		z.infer<typeof createLevelService>
	> {
		const _level = await this.getLevelById(id);

		if (_level == null) {
			throw new BaseResponseError("Level does not exist");
		}

		return {
			level: select_value(level, _level.level),
			start_date: select_value(start_date, _level.start_date),
			end_date: select_value(end_date, _level.end_date),
		};
	}
}
