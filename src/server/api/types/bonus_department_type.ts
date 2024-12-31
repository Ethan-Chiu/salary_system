import { z } from "zod";
import { func, metadata } from "./common_type";
import { bonusTypeEnum } from "./bonus_type_enum";

const BonusDepartmentBase = z.object({
    period_id: z.number(),
    bonus_type: bonusTypeEnum,
    department: z.string(),
    multiplier: z.number(),
});

export const bonusDepartmentFE = z
    .object({
        id: z.number(),
    })
    .merge(BonusDepartmentBase)
    .merge(metadata)
    .merge(func);

export type BonusDepartmentFEType = z.infer<typeof bonusDepartmentFE>;