import { z } from "zod";
import { dateAll, dateCreate, Id } from "./common_type";

const attendanceSettingBase = z.object({
	overtime_by_local_workers_1: z.number(),
	overtime_by_local_workers_2: z.number(),
	overtime_by_local_workers_3: z.number(),
	overtime_by_local_workers_4: z.number(),
	overtime_by_local_workers_5: z.number(),
	overtime_by_foreign_workers_1: z.number(),
	overtime_by_foreign_workers_2: z.number(),
	overtime_by_foreign_workers_3: z.number(),
	overtime_by_foreign_workers_4: z.number(),
	overtime_by_foreign_workers_5: z.number(),
});


// Exposed Types
// Create Types
export const createAttendanceSettingAPI = attendanceSettingBase
	.merge(dateCreate)
	.omit({ end_date: true });
export const createAttendanceSettingService = attendanceSettingBase.merge(dateCreate);

// Update Types
export const updateAttendanceSettingAPI = attendanceSettingBase
	.merge(dateAll)
	.partial()
	.merge(Id);
export const updateAttendanceSettingService = attendanceSettingBase
	.merge(dateAll)
	.partial()
	.merge(Id);

// Frontend Types
export const attendanceSettingFE = z
	.object({
		id: z.number(),
	})
	.merge(attendanceSettingBase)
	.merge(dateAll);

export type AttendanceSettingFEType = z.infer<typeof attendanceSettingFE>;
