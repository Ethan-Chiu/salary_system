import { z } from "zod";
import { zodOptionalDate, zodRequiredDate } from "~/lib/utils/zod_types";

const zc = z.coerce;

export const attendanceSchema = z.object({
	personal_leave_dock: zc.number().min(0).max(100),
	sick_leave_dock: zc.number(),
	rate_of_unpaid_leave: zc.number(),
	unpaid_leave_compensatory_1: zc.number(),
	unpaid_leave_compensatory_2: zc.number(),
	unpaid_leave_compensatory_3: zc.number(),
	unpaid_leave_compensatory_4: zc.number(),
	unpaid_leave_compensatory_5: zc.number(),
	overtime_by_foreign_workers_1: zc.number(),
	overtime_by_foreign_workers_2: zc.number(),
	overtime_by_foreign_workers_3: zc.number(),
	overtime_by_local_workers_1: zc.number(),
	overtime_by_local_workers_2: zc.number(),
	overtime_by_local_workers_3: zc.number(),
	local_worker_holiday: zc.number(),
	foreign_worker_holiday: zc.number(),
	start_date: zodRequiredDate("start_date"),
	end_date: zodOptionalDate(),
});
