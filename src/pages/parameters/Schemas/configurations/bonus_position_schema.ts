import { z } from "zod";

const zc = z.coerce;

export const bonusPositionSchema = z.object({
	position_level: zc.number(),
	multiplier: zc.number(),
});
