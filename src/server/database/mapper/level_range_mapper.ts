import { container, injectable } from "tsyringe";
import { z } from "zod";
import { BaseResponseError } from "~/server/api/error/BaseResponseError";
import { LevelRangeFE, LevelRange, updateLevelRangeAPI, updateLevelRangeService } from "~/server/api/types/level_range_type";
import { LevelService } from "~/server/service/level_service";
import { convertDatePropertiesToISOString, deleteProperties } from "./helper_function";

@injectable()
export class LevelRangeMapper {
    async getLevelRangeFE(level_range: z.infer<typeof LevelRange>): Promise<z.infer<typeof LevelRangeFE>> {
        const levelService = container.resolve(LevelService)
        const level_start = await levelService.getLevelById(level_range.level_start_id)
        const level_end = await levelService.getLevelById(level_range.level_end_id)
        if (level_start == null || level_end == null) {
            throw new BaseResponseError("Level does not exist")
        }

        const levelRangeFE: z.infer<typeof LevelRangeFE> = convertDatePropertiesToISOString({
            level_start: level_start.level,
            level_end: level_end.level,
            ...level_range,
        })

        return levelRangeFE
    }
}