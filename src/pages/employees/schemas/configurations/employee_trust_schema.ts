import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const employeeTrustSchema = z.object({
	emp_no: zc.string(),
	emp_trust_reserve: zc.number(),
	// org_trust_reserve: zc.number(),
	emp_special_trust_incent: zc.number(),
	// org_sp
	ecial_trust_incent: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
