import { z } from "zod";

export const FunctionsEnum = z.enum(["month_salary"])
export type FunctionsEnumType = z.infer<typeof FunctionsEnum>;