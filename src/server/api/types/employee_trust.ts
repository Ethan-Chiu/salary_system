import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";

export const EmployeeTrust = z.object({
	emp_no: z.string(),
	emp_trust_reserve_enc: z.string(),
	// org_trust_reserve_enc: z.string(),
	emp_special_trust_incent_enc: z.string(),
	// org_special_trust_incent_enc: z.string(),
	// entry_date: z.string(),
}).merge(DateService);

export const EmployeeTrustDec = z.object({
	emp_no: z.string(),
	emp_trust_reserve: z.number(),
	// org_trust_reserve_enc: z.string(),
	emp_special_trust_incent: z.number(),
	// org_special_trust_incent_enc: z.string(),
	// entry_date: z.string(),
}).merge(DateAPI);

export const EmployeeTrustFE = z.object({
	emp_no: z.string(),
	emp_trust_reserve: z.number(),
	org_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
	org_special_trust_incent: z.number(),
	// entry_date: z.string(),
}).merge(EmpData).merge(DateAPI);

export const createEmployeeTrustAPI = EmployeeTrustDec;
export const createEmployeeTrustService = EmployeeTrust;
export const updateEmployeeTrustAPI = EmployeeTrustDec.partial().merge(Id);
export const updateEmployeeTrustService = EmployeeTrust.partial().merge(Id);
