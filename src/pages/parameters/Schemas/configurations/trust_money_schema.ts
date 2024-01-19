import { z } from "zod";

const zc = z.coerce;

export const trustMoneySchema = z.object({
	position: zc.number(),
	position_type: zc.number().max(2),
	emp_trust_reserve_limit: zc.number().optional(),
	org_trust_reserve_limit: zc.number(),
	emp_special_trust_incent_limit: zc.number().nullable(),
	org_special_trust_incent_limit: zc.number(),
});
