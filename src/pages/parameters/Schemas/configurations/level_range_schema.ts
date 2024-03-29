import { z } from "zod";

const zc = z.coerce;

export const levelRangeSchema = z.object({
	type: z.enum(["勞保", "健保", "職災", "勞退"]),
	level_start: zc.number(),
	level_end: zc.number(),
});
