import * as z from "zod";
import { Translate } from "~/pages/develop_parameters/utils/translation";
import { createOneKeySchema } from "./createSchema";

function getTranslate(key: string) {
	return Translate(key) ?? "Not found"
}

function getRequiredError(key: string) {
	return {required_error: getTranslate(key) + " is required."}
}

function getInvalidNumberError(key: string) {
	return {invalid_type_error: getTranslate(key) + " must be a number.",};
}

// export const attendanceSchema = (data: any) => {
// 	const schemaObject: Record<string, any> = {};
  
// 	for (const key in data) {
// 	  const value = data[key];
  
// 	  schemaObject[key] = z.lazy(() => {
// 		if (typeof value === 'number') {
// 		  return z.coerce.number().default(value);
// 		} else if (typeof value === 'string') {
// 		  return z.string().default(value);
// 		} else if (value instanceof Date) {
// 		  return z.date().default(value);
// 		} else {
// 		  return z.unknown().default(value);
// 		}
// 	  });
// }}


export const attendanceConfig = (data: any) => {
	let config: any = {};
	Object.keys(data).map((key: any) => {
		config[key] = {inputProps: {required: true}};
	})
	return config;
}


export const attendanceSchema = (data: any) => {
	return z.object({
		personal_leave_dock: z.coerce
			.number()
			.min(0, {
				message: getTranslate("personal_leave_dock") + ">=0",
			})
			.max(10, {
				message: getTranslate("personal_leave_dock") + "<=10",
			})
			.describe(getTranslate("personal_leave_dock"))
			.default(data["personal_leave_dock"]),
		sick_leave_dock: z.coerce
			.number()
			.describe(getTranslate("sick_leave_dock"))
			.default(data.sick_leave_dock),
		rate_of_unpaid_leave: z.coerce
			.number()
			.describe(getTranslate("rate_of_unpaid_leave"))
      		.default(data.rate_of_unpaid_leave),
		unpaid_leave_compensatory_1: z.coerce
			.number()
			.describe(getTranslate("unpaid_leave_compensatory_1"))
      		.default(data.unpaid_leave_compensatory_1),
		unpaid_leave_compensatory_2: z.coerce
			.number()
			.describe(getTranslate("unpaid_leave_compensatory_2"))
      		.default(data.unpaid_leave_compensatory_2),
		unpaid_leave_compensatory_3: z.coerce
			.number()
			.describe(getTranslate("unpaid_leave_compensatory_3"))
      		.default(data.unpaid_leave_compensatory_3),
		unpaid_leave_compensatory_4: z.coerce
			.number()
			.describe(getTranslate("unpaid_leave_compensatory_4"))
      		.default(data.unpaid_leave_compensatory_4),
		unpaid_leave_compensatory_5: z.coerce
			.number()
			.describe(getTranslate("unpaid_leave_compensatory_5"))
      		.default(data.unpaid_leave_compensatory_5),
		overtime_by_foreign_workers_1: z.coerce
			.number()
			.describe(getTranslate("overtime_by_foreign_workers_1"))
      		.default(data.overtime_by_foreign_workers_1),
		overtime_by_foreign_workers_2: z.coerce
			.number()
			.describe(getTranslate("overtime_by_foreign_workers_2"))
      		.default(data.overtime_by_foreign_workers_2),
		overtime_by_foreign_workers_3: z.coerce
			.number()
			.describe(getTranslate("overtime_by_foreign_workers_3"))
      		.default(data.overtime_by_foreign_workers_3),
		overtime_by_local_workers_1: z.coerce
			.number()
			.describe(getTranslate("overtime_by_local_workers_1"))
      		.default(data.overtime_by_local_workers_1),
		overtime_by_local_workers_2: z.coerce
			.number()
			.describe(getTranslate("overtime_by_local_workers_2"))
      		.default(data.overtime_by_local_workers_2),
		overtime_by_local_workers_3: z.coerce
			.number()
			.describe(getTranslate("overtime_by_local_workers_3"))
      		.default(data.overtime_by_local_workers_3),
		local_worker_holiday: z.coerce
			.number()
			.describe(getTranslate("local_worker_holiday"))
      		.default(data.local_worker_holiday),
		foreign_worker_holiday: z.coerce
			.number()
			.describe(getTranslate("foreign_worker_holiday"))
      		.default(data.foreign_worker_holiday),
		start_date: z.coerce
			.date()
			.describe(getTranslate("start_date"))
			.default(new Date(data.start_date)),
		// end_date: z.coerce.date().describe("end date").default(data.end_date).optional(),
	});
};
