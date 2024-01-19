import { z } from "zod";

export const TabsEnum = z.enum(["now" , "history" , "calendar"]);
export type TabsEnumType = z.infer<typeof TabsEnum>;