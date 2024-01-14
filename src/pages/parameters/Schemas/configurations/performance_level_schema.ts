import { z } from "zod";

export const performanceLevelSchema = z.object({
	performance_level: z.string(),
	multiplier: z.number(),
});
