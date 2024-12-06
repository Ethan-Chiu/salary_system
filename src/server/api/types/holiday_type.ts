import { sign } from "crypto";
import { NonceProvider } from "react-select";
import { z } from "zod";

export const HolidayFE=z.object({
    department: z.string(),
    emp_no: z.string(),
    emp_name: z.string(),
    position: z.number(),
    work_day: z.number(),
	special_personal_leave: z.number(),
	personal_leave: z.number(),
	full_attendance_personal_leave: z.number(),
	sick_leave: z.number(),
	full_attendance_sick_leave: z.number(),
	special_leave: z.number(),
	compensatory_leave: z.number(),
	non_leave_special: z.number(),
	non_leave_compensatory_1: z.number(),
	non_leave_compensatory_2: z.number(),
	non_leave_compensatory_3: z.number(),
	non_leave_compensatory_4: z.number(),
	non_leave_compensatory_5: z.number(),
    // holiday_type_name: z.string(),
	// total_hours: z.number(),
	// annual_1: z.number().nullable(),
	// compensatory_134: z.number().nullable(),
	// compensatory_167: z.number().nullable(),
	// compensatory_267: z.number().nullable(),
	// compensatory_1: z.number().nullable(),
	// compensatory_2: z.number().nullable(),
})

export type HolidayFEType = z.infer<typeof HolidayFE>