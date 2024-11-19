import { z } from "zod";

export const newBonusFE = z.object({
    emp_no: z.string(),
    emp_name: z.string(),
    department: z.string(),
    position: z.number(),
    work_day: z.number(),
    project_bonus: z.number(),
    full_attendance_bonus: z.number(),
})

export type NewBonusFEType = z.infer<typeof newBonusFE>;
