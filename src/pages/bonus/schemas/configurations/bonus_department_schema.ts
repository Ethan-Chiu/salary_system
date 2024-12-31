import { z } from "zod";

const zc = z.coerce;

export const bonusDepartmentSchema = z.object({
	id: zc.number(),
	department: z.string(),
	multiplier: zc.number(),
});
