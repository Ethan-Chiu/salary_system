import { z } from "zod";

const zc = z.coerce;

export const levelRangeSchema = z.object({
	type: z.enum(["勞保", "健保", "職災", "勞退"]),
	start_date: zc.string(),
	end_date: zc.string().optional(),
	// level_start: zc.number(),
	// level_end: zc.number(),
});
