import { z } from "zod";

const zc = z.coerce;

export const bonusWorkTypeSchema = z.object({
	work_type: z.string(),
	multiplier: zc.number(),
});
