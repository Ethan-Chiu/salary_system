import { z } from "zod";
import { dateAPI, dateService, Id } from "./common_type";

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
	.merge(dateService)
	.omit({ end_date: true });
export const createAttendanceSettingService = attendanceSettingBase.merge(dateService);

// Update Types
export const updateAttendanceSettingAPI = attendanceSettingBase
	.merge(dateAPI)
	.partial()
	.merge(Id);
export const updateAttendanceSettingService = attendanceSettingBase
	.merge(dateAPI)
	.partial()
	.merge(Id);

// Frontend Types
export const attendanceSettingFE = z
	.object({
		id: z.number(),
	})
	.merge(attendanceSettingBase)
	.merge(dateAPI);

export type AttendanceSettingFEType = z.infer<typeof attendanceSettingFE>;
