import { z } from "zod";

export const syncInput = z.object({
  emp_no: z.string(),
  key: z.string(),
});
export type syncInputType = z.infer<typeof syncInput>;


export const QuitDateEnum = z.enum(["past", "current", "future"])
export type QuitDateEnumType = z.infer<typeof QuitDateEnum>;
