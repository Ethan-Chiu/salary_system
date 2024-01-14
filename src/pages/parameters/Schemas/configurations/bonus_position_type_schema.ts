import { z } from "zod";

export const bonusPositionTypeSchema = z.object({
  position_type: z.object({
    type: z.string(),
    max: z.number().max(2),
  }),
  multiplier: z.object({
    type: z.number(),
  }),
});
