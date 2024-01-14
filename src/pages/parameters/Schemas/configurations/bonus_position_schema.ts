import { z } from "zod";

export const bonusPositionSchema = z.object({
  position: z.number(),
  multiplier: z.number(),
});