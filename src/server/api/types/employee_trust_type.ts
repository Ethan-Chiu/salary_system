import { z } from "zod";
import { dateAll, dateCreate, empData, func, Id } from "./common_type";
import { optionalNumDefaultZero } from "./z_utils";

const employeeTrust = z.object({
	emp_no: z.string(),
	emp_trust_reserve: optionalNumDefaultZero,
	emp_special_trust_incent: optionalNumDefaultZero,
}).merge(dateCreate);

export const employeeTrustFE = z.object({
	id: z.number(),
	emp_no: z.string(),
	emp_trust_reserve: z.number(),
	org_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
	org_special_trust_incent: z.number(),
}).merge(empData).merge(dateAll).merge(func);

export const employeeTrustCreateAPI = employeeTrust;
export const employeeTrustCreateService = employeeTrust;

export const updateEmployeeTrustAPI = employeeTrustFE.partial().merge(Id);
export const updateEmployeeTrustService = employeeTrust.partial().merge(Id);

export type EmployeeTrustFEType = z.infer<typeof employeeTrustFE>;
