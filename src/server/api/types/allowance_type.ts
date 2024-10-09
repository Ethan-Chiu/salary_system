import { z } from "zod";

export const allowanceFE = z.object({
    emp_no: z.string(),
    name: z.string(),
    department: z.string(),
    position: z.number(),
    work_day: z.number(),
    allowance_type_name: z.string(),
    amount: z.number(),
    // note: z.string(),
});

export type AllowanceFEType = z.infer<typeof allowanceFE>;
