import { z } from "zod";
import { dateAll, dateCreate, Id } from "./common_type";
const salaryIncomeTaxBase = z.object({
    salary_start: z.number(),
    salary_end: z.number(),
    dependent: z.number(),
    tax_amount: z.number(),
});

export const createSalaryIncomeTaxAPI = salaryIncomeTaxBase.merge(dateCreate).omit({ end_date: true });
export const createSalaryIncomeTaxService = salaryIncomeTaxBase.merge(dateCreate);
export const updateSalaryIncomeTaxAPI = salaryIncomeTaxBase.merge(dateAll).partial().merge(Id);
export const updateSalaryIncomeTaxService = salaryIncomeTaxBase.merge(dateAll).partial().merge(Id);
export const batchCreateSalaryIncomeTaxAPI = z.array(createSalaryIncomeTaxAPI);

// Frontend Types
export const salaryIncomeTaxFE = z
    .object({
        id: z.number(),
    })
    .merge(salaryIncomeTaxBase)
    .merge(dateAll);

export type SalaryIncomeTaxFEType = z.infer<typeof salaryIncomeTaxFE>;