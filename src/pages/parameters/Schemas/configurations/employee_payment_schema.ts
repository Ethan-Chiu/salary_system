import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const employeePaymentSchema = z.object({
	emp_no: zc.string(),
	base_salary: zc.number(),
	food_bonus: zc.number(),
	supervisor_comp: zc.number(),
	job_comp: zc.number(),
	subsidy_comp: zc.number(),
	professional_cert_comp: zc.number(),
	labor_retirement_self: zc.number(),
	l_i: zc.number(),
	h_i: zc.number(),
	labor_retirement: zc.number(),
	occupational_injury: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
