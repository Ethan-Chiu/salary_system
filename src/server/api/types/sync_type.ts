import { z } from "zod";

export const syncInput = z.object({
  emp_no: z.string(),
  keys: z.string().array(),
});
export type syncInputType = z.infer<typeof syncInput>;


export const QuitDateEnum = z.enum(["null", "past", "current", "future"])
export type QuitDateEnumType = z.infer<typeof QuitDateEnum>;
