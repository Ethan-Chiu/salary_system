import { z } from "zod";

const zc = z.coerce;

export const bonusPositionSchema = z.object({
  position: zc.number(),
  multiplier: zc.number(),
});