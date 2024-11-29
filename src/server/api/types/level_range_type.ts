import { z } from "zod";

import { dateAPI, dateService, Id } from "./common_type";

const levelRangeBase = z.object({
  type: z.string(),
  level_start_id: z.number(),
  level_end_id: z.number(),
}).merge(dateService)

const levelRangeBaseAPI = z.object({
  type: z.string(),
  level_start: z.number(),
  level_end: z.number(),
}).merge(dateAPI);

// Exposed Types
// Create Types
export const createLevelRangeAPI = levelRangeBaseAPI.omit({ end_date: true });
export const createLevelRangeService = levelRangeBase;

// Update Types
export const updateLevelRangeAPI = levelRangeBaseAPI.partial().merge(Id);
export const updateLevelRangeService = levelRangeBase.partial().merge(Id);

// Frontend Types
export const levelRangeFE = levelRangeBaseAPI 
export type LevelRangeFEType = z.infer<typeof levelRangeFE>;
