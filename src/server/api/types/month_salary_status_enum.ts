import { z } from "zod";

export const MonthSalaryStatusEnum = z.enum(["未發放月薪", "已發放月薪", "離職人員"])
export type MonthSalaryStatusEnumType = z.infer<typeof MonthSalaryStatusEnum>;