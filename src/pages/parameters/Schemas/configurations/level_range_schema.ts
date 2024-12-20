import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";

export const levelRangeSchema = z.object({
	type: z.enum(["勞保", "健保", "職災", "勞退"]),
	start_date: zodRequiredDate("start_date"),
  level_start: z.number(),
  level_end: z.number(),
});
