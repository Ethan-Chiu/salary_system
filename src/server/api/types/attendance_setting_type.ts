import { z } from "zod";
import { DateAPI, Id } from "./common_type";

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
export const createAttendanceSettingAPI = attendanceSettingBase
	.merge(DateAPI)
	.omit({ end_date: true });
export const createAttendanceSettingService = attendanceSettingBase.merge(DateAPI);

export const updateAttendanceSettingAPI = attendanceSettingBase
	.merge(DateAPI)
	.partial()
	.merge(Id);
export const updateAttendanceSettingService = attendanceSettingBase
	.merge(DateAPI)
	.partial()
	.merge(Id);


export const attendanceSettingFE = z
	.object({
		id: z.number(),
	})
	.merge(attendanceSettingBase)
	.merge(DateAPI);

export type AttendanceSettingFEType = z.infer<typeof attendanceSettingFE>;
