import { z } from "zod";
import { zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const levelSchema = z.object({
	level: zc.number(),
	start_date: zodRequiredDate("start_date"),
});
