import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { LevelRangeFE, LevelRange, updateLevelRangeAPI, updateLevelRangeService } from "~/server/api/types/level_range_type";
import { LevelService } from "~/server/service/level_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";
import { get_date_string } from "~/server/service/helper_function";

@injectable()
export class LevelRangeMapper {

    async getLevelRange(level_range: z.infer<typeof LevelRangeFE>): Promise<z.infer<typeof LevelRange>> {
        const levelService = container.resolve(LevelService)
        const level_start = await levelService.getLevelByLevel(level_range.level_start, get_date_string(level_range.start_date ?? new Date()))
        const level_end = await levelService.getLevelByLevel(level_range.level_end, get_date_string(level_range.start_date ?? new Date()))
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRange: z.infer<typeof LevelRange> = LevelRange.parse(
            deleteProperties(convertDatePropertiesToISOString({
                level_start_id: level_start.id,
                level_end_id: level_end.id,
                ...level_range,
            }), ["level_start", "level_end"])
        )

        return levelRange
    }

    async getLevelRangeFE(level_range: z.infer<typeof LevelRange>): Promise<z.infer<typeof LevelRangeFE>> {
        const levelService = container.resolve(LevelService)
        const level_start = await levelService.getLevelById(level_range.level_start_id)
        const level_end = await levelService.getLevelById(level_range.level_end_id)
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRangeFE: z.infer<typeof LevelRangeFE> = deleteProperties(convertDatePropertiesToISOString({
            level_start: level_start.level,
            level_end: level_end.level,
            ...level_range,
            start_date: level_range.start_date ? new Date(level_range.start_date) : null,
            end_date: level_range.end_date ? new Date(level_range.end_date) : null,
        }), ["level_start_id", "level_end_id"])

        return levelRangeFE
    }

    async getLevelRangeNullable(level_range_FE: z.infer<typeof updateLevelRangeAPI>): Promise<z.infer<typeof updateLevelRangeService>> {
        const levelService = container.resolve(LevelService)
        const level_start = level_range_FE.level_start == null ? null : await levelService.getLevelByLevel(level_range_FE.level_start, get_date_string(level_range_FE.start_date ?? new Date()))
        const level_end = level_range_FE.level_end == null ? null : await levelService.getLevelByLevel(level_range_FE.level_end, get_date_string(level_range_FE.start_date ?? new Date()))
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRange: z.infer<typeof updateLevelRangeService> = updateLevelRangeService.parse(
            deleteProperties(convertDatePropertiesToISOString({
                level_start_id: level_start.id,
                level_end_id: level_end.id,
                ...level_range_FE,
            }), ["level_start", "level_end"])
        )

        return levelRange
    }
}