import { z } from "zod";

import { DateAPI, DateService, Id } from "./common_type";

export const LevelRangeFE = z.object({
  type: z.string(),
  level_start: z.number(),
  level_end: z.number(),
}).merge(DateAPI);

export const LevelRange = z.object({
  type: z.string(),
  level_start_id: z.number(),
  level_end_id: z.number(),
}).merge(DateService)

export const createLevelRangeAPI = LevelRangeFE;
export const createLevelRangeService = LevelRange;

export const updateLevelRangeAPI = LevelRangeFE.partial().merge(Id);
export const updateLevelRangeService = LevelRange.partial().merge(Id);
