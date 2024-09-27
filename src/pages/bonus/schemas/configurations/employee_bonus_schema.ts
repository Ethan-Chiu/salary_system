import { z } from "zod";

const zc = z.coerce;

export const employeeBonusSchema = z.object({
    emp_no: z.string(),
    multiplier: zc.number(),
    fixed_amount: zc.number(),
});