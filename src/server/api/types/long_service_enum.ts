import { z } from "zod";

export const LongServiceEnum = z.enum([
	"month_allowance",
	"one_year_allowance",
	"two_year_allowance",
]);
export type LongServiceEnumType = z.infer<typeof LongServiceEnum>;
