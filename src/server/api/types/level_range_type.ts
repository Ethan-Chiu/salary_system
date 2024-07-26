import { z } from "zod";

import { Id } from "./common_type";

const LevelRange = z.object({
	type: z.string(),
	level_start: z.number(),
	level_end: z.number(),
});

const createLevelRange = z.object({
  type: z.string(),
  level_start: z.number(),
  level_end_id: z.number(),
})

export type LevelRangeCreateType = z.infer<typeof createLevelRange>;

export const createLevelRangeAPI = createLevelRange;
export const createLevelRangeService = createLevelRange;

export const updateLevelRangeAPI = LevelRange.merge(Id).partial();
export const updateLevelRangeService = LevelRange.merge(Id).partial();
