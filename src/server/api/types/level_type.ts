import { z } from "zod";
import { dateAll, dateCreate, Id } from "./common_type";
const LevelBase = z.object({
    level: z.number(),
});

export const createLevelAPI = LevelBase.merge(dateCreate).omit({ end_date: true });
export const createLevelService = LevelBase.merge(dateCreate);
export const updateLevelAPI = LevelBase.merge(dateAll).partial().merge(Id);
export const updateLevelService = LevelBase.merge(dateAll).partial().merge(Id);

// Frontend Types
export const LevelFE = z
    .object({
        id: z.number(),
    })
    .merge(LevelBase)
    .merge(dateAll);

export type LevelFEType = z.infer<typeof LevelFE>;