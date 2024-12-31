import { z } from "zod";

const zc = z.coerce;

export const bonusPositionTypeSchema = z.object({
	id: zc.number(),
	position_type: z.string().max(2),
	multiplier: zc.number(),
});
