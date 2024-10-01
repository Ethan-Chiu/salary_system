import { z } from "zod";

export const EmpTabsEnum = z.enum(["current", "history", "calendar"]);
export type EmpTabsEnumType = z.infer<typeof EmpTabsEnum>;
