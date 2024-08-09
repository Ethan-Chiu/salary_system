import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { createLevelRangeAPI, createLevelRangeService, updateLevelRangeAPI, updateLevelRangeService } from "~/server/api/types/level_range_type";
import { LevelService } from "~/server/service/level_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";

@injectable()
export class LevelRangeMapper {
    async getLevelRange(level_range_FE: z.infer<typeof createLevelRangeAPI>): Promise<z.infer<typeof createLevelRangeService>> {
        const levelService = container.resolve(LevelService)
        const level_start = await levelService.getLevelByLevel(level_range_FE.level_start)
        const level_end = await levelService.getLevelByLevel(level_range_FE.level_end)
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRange: z.infer<typeof createLevelRangeService> = {
            ...level_range_FE,
            level_start_id: level_start.id,
            level_end_id: level_end.id,
        }

        return convertDatePropertiesToISOString(levelRange)
    }

    async getLevelRangeFE(level_range: z.infer<typeof createLevelRangeService>): Promise<z.infer<typeof createLevelRangeAPI>> {
        const levelService = container.resolve(LevelService)
        const level_start = await levelService.getLevelById(level_range.level_start_id)
        const level_end = await levelService.getLevelById(level_range.level_end_id)
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRangeFE: z.infer<typeof createLevelRangeAPI> = {
            ...level_range,
            level_start: level_start.level,
            level_end: level_end.level,
        }

        return convertDatePropertiesToISOString(deleteProperties(levelRangeFE, ["level_start_id", "level_end_id"]))
    }

    async getLevelRangeNullable(level_range_FE: z.infer<typeof updateLevelRangeAPI>): Promise<z.infer<typeof updateLevelRangeService>> {
        const levelService = container.resolve(LevelService)
        const level_start = level_range_FE.level_start == null ? null : await levelService.getLevelByLevel(level_range_FE.level_start)
        const level_end = level_range_FE.level_end == null ? null : await levelService.getLevelByLevel(level_range_FE.level_end)
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRange: z.infer<typeof updateLevelRangeService> = {
            ...level_range_FE,
            level_start_id: level_start.id,
            level_end_id: level_end.id,
        }

        return convertDatePropertiesToISOString(levelRange)
    }
}