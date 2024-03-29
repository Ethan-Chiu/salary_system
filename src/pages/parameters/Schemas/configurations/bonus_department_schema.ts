import { z } from "zod";

const zc = z.coerce;

export const bonusDepartmentSchema = z.object({
	department: z.string(),
	multiplier: zc.number(),
});
