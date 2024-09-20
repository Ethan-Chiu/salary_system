import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

export const salaryIncomeTaxSchema = z.object({
	salary_start: z
		.coerce
		.number(),
	salary_end: z
		.coerce
		.number(),
	dependent: z
		.coerce
		.number(),
	tax_amount: z
		.coerce
		.number(),
});
