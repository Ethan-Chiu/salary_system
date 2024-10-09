import { z } from "zod";

export const levelRangeSchema = z.object({
	type: z.enum(["勞保", "健保", "職災", "勞退"]),
});
