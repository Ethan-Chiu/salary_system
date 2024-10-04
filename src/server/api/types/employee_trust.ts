import { z } from "zod";
import { DateAPI, DateService, EmpData, Id } from "./common_type";
import { EnterFullScreenIcon } from "@radix-ui/react-icons";

export const EmployeeTrust = z.object({
	emp_no: z.string(),
	emp_trust_reserve_enc: z.string(),
	org_trust_reserve_enc: z.string(),
	emp_special_trust_incent_enc: z.string(),
	org_special_trust_incent_enc: z.string(),
	entry_date: z.string(),
}).merge(DateService);

export const EmployeeTrustFE = z.object({
	emp_no: z.string(),
	emp_trust_reserve: z.number(),
	org_trust_reserve: z.number(),
	emp_special_trust_incent: z.number(),
	org_special_trust_incent: z.number(),
	entry_date: z.string(),
}).merge(EmpData).merge(DateAPI);

export const createEmployeeTrustAPI = EmployeeTrustFE;
export const createEmployeeTrustService = EmployeeTrust;
export const updateEmployeeTrustAPI = EmployeeTrustFE.merge(Id)
	.partial();
export const updateEmployeeTrustService = EmployeeTrust.merge(Id)
	.partial();