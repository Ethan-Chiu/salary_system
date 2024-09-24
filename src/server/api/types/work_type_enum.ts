import { z } from "zod";

export const WorkTypeEnum = z.enum(["直接人員", "間接人員", "外籍勞工"]);
export type WorkTypeEnumType = z.infer<typeof WorkTypeEnum>;
