import { z } from "zod";
import { DateAPI, Id } from "./common_type";

const attendanceSetting = z.object({
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

export const createAttendanceSettingAPI = attendanceSetting
	.merge(DateAPI)
	.omit({ end_date: true });
export const createAttendanceSettingService = attendanceSetting.merge(DateAPI);

export const updateAttendanceSettingAPI = attendanceSetting
	.merge(DateAPI)
	.partial()
	.merge(Id);
export const updateAttendanceSettingService = attendanceSetting
	.merge(DateAPI)
	.partial()
	.merge(Id);

// TODO:
/* export type AttendanceSettingFEType = z.infer<typeof attendanceSettingFE>; */
