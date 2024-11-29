import { z } from "zod";

import { dateAll, dateCreate, Id } from "./common_type";

export const LevelRangeFE = z.object({
  type: z.string(),
  level_start: z.number(),
  level_end: z.number(),
}).merge(dateAll);

export const LevelRange = z.object({
  type: z.string(),
  level_start_id: z.number(),
  level_end_id: z.number(),
}).merge(dateCreate)

export const createLevelRangeAPI = LevelRangeFE.omit({ end_date: true });
export const createLevelRangeService = LevelRange;

export const updateLevelRangeAPI = LevelRangeFE.partial().merge(Id);
export const updateLevelRangeService = LevelRange.partial().merge(Id);
