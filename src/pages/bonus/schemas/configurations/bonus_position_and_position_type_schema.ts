import { z } from "zod";

const zc = z.coerce;

export const bonusPositionAndPositionTypeSchema = z.object({
	id: zc.number(),
	position_and_position_type: zc.string(),
	position_multiplier: zc.number(),
	position_type_multiplier: zc.number(),
});
