import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";

export const EmployeeTrust = z.object({
	emp_no: z.string(),
	emp_trust_reserve: z.number(),
	org_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
	org_special_trust_incent: z.number(),
});

export const EmployeeTrustFE = EmployeeTrust.merge(EmpData);

export const createEmployeeTrustAPI = EmployeeTrust.merge(DateAPI);
export const createEmployeeTrustService = EmployeeTrust.merge(DateService);
export const updateEmployeeTrustAPI = EmployeeTrust.merge(Id)
	.merge(DateAPI)
	.partial();
export const updateEmployeeTrustService = EmployeeTrust.merge(Id)
	.merge(DateService)
	.partial();