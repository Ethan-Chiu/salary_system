import { workerData } from "worker_threads";
import { z } from "zod";

export const newOtherFE=z.object({
    emp_no: z.string(),
    emp_name: z.string(),
    department: z.string(),
    position: z.number(),
    work_day: z.number(),
    other_addition: z.number(),
    other_addition_tax: z.number(),
    other_deduction: z.number(),
    other_deduction_tax: z.number(),
    dorm_deduction: z.number(),
    g_i_deduction_promotion: z.number(),
    g_i_deduction_family: z.number(),
    income_tax_deduction: z.number(),
    l_r_self: z.number(),
    parking_fee: z.number(),
    brokerage_fee: z.number(),
    retirement_income: z.number(),
    l_i_disability_reduction: z.number(),
    h_i_subsidy: z.number(),
})

export type NewOtherFEType = z.infer<typeof newOtherFE>