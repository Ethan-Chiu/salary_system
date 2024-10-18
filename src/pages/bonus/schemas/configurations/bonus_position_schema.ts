import { z } from "zod";

const zc = z.coerce;

export const bonusPositionSchema = z.object({
	position: zc.number(),
	position_type: z.enum(["a", "b"]),
	position_multiplier: zc.number(),
	position_type_multiplier: zc.number(),
});
