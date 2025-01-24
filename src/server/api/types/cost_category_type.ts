import { z } from "zod";

export const CostCategoryEnum = z.enum(["成本直接", "成本間接"])
export type CostCategoryEnumType = z.infer<typeof CostCategoryEnum>;