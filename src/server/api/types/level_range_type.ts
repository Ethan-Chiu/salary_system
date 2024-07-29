import { z } from "zod";

import { Id } from "./common_type";

const LevelRangeFE = z.object({
  type: z.string(),
  level_start: z.number(),
  level_end: z.number(),
});

const LevelRange = z.object({
  type: z.string(),
  level_start_id: z.number(),
  level_end_id: z.number(),
})

export const createLevelRangeAPI = LevelRangeFE;
export const createLevelRangeService = LevelRange;

export const updateLevelRangeAPI = LevelRangeFE.merge(Id).partial();
export const updateLevelRangeService = LevelRange.merge(Id).partial();
