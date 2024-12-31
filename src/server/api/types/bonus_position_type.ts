import { z } from "zod";
import { func, metadata } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";

const BonusPositionBase = z.object({
    period_id: z.number(),
    bonus_type: bonusTypeEnum,
    position: z.number(),
    position_multiplier: z.number(),
    position_type: z.string(),
    position_type_multiplier: z.number(),
});

export const bonusPositionFE = z
    .object({
        id: z.number(),
    })
    .merge(BonusPositionBase)
    .merge(metadata)
    .merge(func);

export type BonusPositionFEType = z.infer<typeof bonusPositionFE>;