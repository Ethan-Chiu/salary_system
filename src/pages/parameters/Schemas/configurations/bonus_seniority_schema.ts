import { z } from "zod";

export const bonusSenioritySchema = z.object({
  seniority: z.number(),
  multiplier: z.number(),
});
