import { z } from "zod";

export const trustMoneySchema = z.object({
	position: z.number(),
	position_type: z.number().max(2),
	emp_trust_reserve_limit: z.number().optional(),
	org_trust_reserve_limit: z.number(),
	emp_special_trust_incent_limit: z.number().nullable(),
	org_special_trust_incent_limit: z.number(),
});
