import { z } from "zod";

const zc = z.coerce;

export const bonusPositionTypeSchema = z.object({
  position_type: z.string().max(2),
  multiplier: zc.number()
});
