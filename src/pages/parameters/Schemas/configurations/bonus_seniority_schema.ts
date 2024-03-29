import { z } from "zod";

const zc = z.coerce;
export const bonusSenioritySchema = z.object({
  seniority: zc.number(),
  multiplier: zc.number(),
});
