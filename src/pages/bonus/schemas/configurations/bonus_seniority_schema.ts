import { z } from "zod";

const zc = z.coerce;
export const bonusSenioritySchema = z.object({
	id: zc.number(),
	seniority: zc.number(),
	multiplier: zc.number(),
});
