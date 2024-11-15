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

export const newAllowanceFE = z.object({
    emp_no: z.string(),
    emp_name: z.string(),
    department: z.string(),
    position: z.number(),
    work_day: z.number(),
    supervisor_allowance: z.number(),
    occupational_allowance: z.number(),
    subsidy_allowance: z.number(),
    shift_allowance: z.number(),
    professional_cert_allowance: z.number(),
    long_service_allowance: z.number(),
})

export type AllowanceFEType = z.infer<typeof allowanceFE>;
export type NewAllowanceFEType = z.infer<typeof newAllowanceFE>;
