import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const bonusSchema = z.object({
	fixed_multiplier: zc.number(),
	criterion_date: zodRequiredDate("criterion_date"),
	base_on: z.string(),
	type: z.enum(["A", "B", "C", "D", "E"]),
});
