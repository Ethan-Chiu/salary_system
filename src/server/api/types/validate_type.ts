import { z } from "zod";
import { dateCreate } from "./common_type";

export const validateBase = z.object({}).merge(dateCreate);

export const validateEmployeeTrust = validateBase.merge(z.object({
    emp_no: z.string(),
}))

export const validateEmployeePayment = validateBase.merge(z.object({
    emp_no: z.string(),
}))