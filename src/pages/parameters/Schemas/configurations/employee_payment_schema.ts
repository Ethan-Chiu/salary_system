import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const employeePaymentSchema = z.object({
	emp_no: zc.string(),
	base_salary: zc.number(),
	food_allowance: zc.number(),
	l_r_self: zc.number(),
	l_i: zc.number(),
	h_i: zc.number(),
	l_r: zc.number(),
	occupational_injury: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
