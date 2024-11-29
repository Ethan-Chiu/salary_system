import { z } from "zod";

export const PaysetFE=z.object({
    department: z.string(),
    emp_no: z.string(),
    emp_name: z.string(),
    position: z.number(),
    work_day: z.number(),
    li_day: z.number()
})

export type PaysetFEType = z.infer<typeof PaysetFE>