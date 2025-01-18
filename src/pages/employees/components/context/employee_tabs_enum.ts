import { z } from "zod";

export const EmpTabsEnum = z.enum(["current", "history"]);
export type EmpTabsEnumType = z.infer<typeof EmpTabsEnum>;
