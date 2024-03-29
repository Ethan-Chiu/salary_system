import { z } from "zod";

export const TabsEnum = z.enum(["current", "history", "calendar"]);
export type TabsEnumType = z.infer<typeof TabsEnum>;
