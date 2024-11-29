import { z } from "zod";

export const HolidayFE=z.object({
    department: z.string(),
    emp_no: z.string(),
    emp_name: z.string(),
    position: z.number(),
    work_day: z.number(),
    holiday_type_name: z.string(),
	total_hours: z.number(),
	// annual_1: z.number().nullable(),
	// compensatory_134: z.number().nullable(),
	// compensatory_167: z.number().nullable(),
	// compensatory_267: z.number().nullable(),
	// compensatory_1: z.number().nullable(),
	// compensatory_2: z.number().nullable(),
})

export type HolidayFEType = z.infer<typeof HolidayFE>