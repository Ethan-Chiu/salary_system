import { z } from "zod";
import { func, metadata } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";

const BonusSeniorityBase = z.object({
    period_id: z.number(),
    bonus_type: bonusTypeEnum,
    seniority: z.number(),
    multiplier: z.number(),
});

export const bonusSeniorityFE = z
    .object({
        id: z.number(),
    })
    .merge(BonusSeniorityBase)
    .merge(metadata)
    .merge(func);

export type BonusSeniorityFEType = z.infer<typeof bonusSeniorityFE>;