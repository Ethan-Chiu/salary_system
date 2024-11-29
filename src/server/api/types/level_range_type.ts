import { z } from "zod";
import { dateAll, dateCreate, Id } from "./common_type";

const levelRangeBase = z.object({
  type: z.string(),
  level_start_id: z.number(),
  level_end_id: z.number(),
})

const levelRangeBaseAPI = z.object({
  type: z.string(),
  level_start: z.number(),
  level_end: z.number(),
});

// Exposed Types
// Create Types
export const createLevelRangeAPI = levelRangeBaseAPI.merge(dateCreate).omit({ end_date: true });
export const createLevelRangeService = levelRangeBase.merge(dateCreate);

// Update Types
export const updateLevelRangeAPI = levelRangeBaseAPI.merge(dateAll).partial().merge(Id);
export const updateLevelRangeService = levelRangeBase.merge(dateAll).partial().merge(Id);

// Frontend Types
export const levelRangeFE = z
  .object({
    id: z.number(),
  })
  .merge(levelRangeBaseAPI)
  .merge(dateAll);
export type LevelRangeFEType = z.infer<typeof levelRangeFE>;
