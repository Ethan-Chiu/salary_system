import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";
import { LongServiceeEnum } from "~/server/api/types/long_service_enum";

const zc = z.coerce;

export const employeePaymentSchema = z.object({
	emp_no: zc.string(),
	base_salary: zc.number(),
	food_allowance: zc.number(),
	supervisor_allowance: zc.number(),
	occupational_allowance: zc.number(),
	subsidy_allowance: zc.number(),
	long_service_allowance: zc.number(),
	long_service_allowance_type: LongServiceeEnum,
	l_r_self: zc.number(),
	// l_i: zc.number(),
	// h_i: zc.number(),
	// l_r: zc.number(),
	// occupational_injury: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
