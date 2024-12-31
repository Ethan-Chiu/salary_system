import { z } from "zod";

const zc = z.coerce;

export const performanceLevelSchema = z.object({
	id: zc.number(),
	performance_level: z.string(),
	multiplier: zc.number(),
});
