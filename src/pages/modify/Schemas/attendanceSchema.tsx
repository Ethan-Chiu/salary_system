import * as z from "zod";

export const attendanceSchema = (data: any) => {
	return z.object({
		personal_leave_dock: z.coerce.number().describe("personal_leave_dock").default(data.personal_leave_dock),
		sick_leave_dock: z.coerce.number().describe("sick_leave_dock").default(data.sick_leave_dock),
		rate_of_unpaid_leave: z.coerce
			.number()
			.describe("rate_of_unpaid_leave")
      .default(data.rate_of_unpaid_leave),
		unpaid_leave_compensatory_1: z.coerce
			.number()
			.describe("unpaid_leave_compensatory_1")
      .default(data.unpaid_leave_compensatory_1),
		unpaid_leave_compensatory_2: z.coerce
			.number()
			.describe("unpaid_leave_compensatory_2")
      .default(data.unpaid_leave_compensatory_2),
		unpaid_leave_compensatory_3: z.coerce
			.number()
			.describe("unpaid_leave_compensatory_3")
      .default(data.unpaid_leave_compensatory_3),
		unpaid_leave_compensatory_4: z.coerce
			.number()
			.describe("unpaid_leave_compensatory_4")
      .default(data.unpaid_leave_compensatory_4),
		unpaid_leave_compensatory_5: z.coerce
			.number()
			.describe("unpaid_leave_compensatory_5")
      .default(data.unpaid_leave_compensatory_5),
		overtime_by_foreign_workers_1: z.coerce
			.number()
			.describe("overtime_by_foreign_workers_1")
      .default(data.overtime_by_foreign_workers_1),
		overtime_by_foreign_workers_2: z.coerce
			.number()
			.describe("overtime_by_foreign_workers_2")
      .default(data.overtime_by_foreign_workers_2),
		overtime_by_foreign_workers_3: z.coerce
			.number()
			.describe("overtime_by_foreign_workers_3")
      .default(data.overtime_by_foreign_workers_3),
		overtime_by_local_workers_1: z.coerce
			.number()
			.describe("overtime_by_local_workers_1")
      .default(data.overtime_by_local_workers_1),
		overtime_by_local_workers_2: z.coerce
			.number()
			.describe("overtime_by_local_workers_2")
      .default(data.overtime_by_local_workers_2),
		overtime_by_local_workers_3: z.coerce
			.number()
			.describe("overtime_by_local_workers_3")
      .default(data.overtime_by_local_workers_3),
		local_worker_holiday: z.coerce
			.number()
			.describe("local_worker_holiday")
      .default(data.local_worker_holiday),
		foreign_worker_holiday: z.coerce
			.number()
			.describe("foreign_worker_holiday")
      .default(data.foreign_worker_holiday),
		start_date: z.coerce.date().describe("start date").default(new Date(data.start_date)),
		// end_date: z.coerce.date().describe("end date").default(data.end_date).optional(),
	});
};
