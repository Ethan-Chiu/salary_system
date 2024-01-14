import { z } from "zod";

export const bonusSchema = z.object({
  fixed_multiplier: z.number(),
  criterion_date: z.date(),
  base_on: z.string(),
  type: z.enum(["A", "B", "C", "D", "E"]),
});